"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { createPlayer, updatePlayer, playerJump, playerMove, playerStop } from '../../game/player';
import { generateSimpleLevel, addTile } from '../../game/level';
import { generateTestStage } from '../../game/testStage';
import { drawPlayer, drawLevel } from '../../game/renderer';
import { Player, Level, Tile } from '../../game/types';
import { TILE_SIZE } from '../../game/constants';

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [selectedTileType, setSelectedTileType] = useState<'ground' | 'platform' | 'water'>('ground');

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !player || !level) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (!isEditorMode) {
      setPlayer(prevPlayer => {
        if (!prevPlayer) return null;
        const newPlayer = { ...prevPlayer };
        updatePlayer(newPlayer, level.tiles, 1); // deltaTime = 1 for simplicity
        return newPlayer;
      });
    }

    drawLevel(ctx, level);
    if (player) {
      drawPlayer(ctx, player);
    }

    requestAnimationFrame(gameLoop);
  }, [player, level, isEditorMode]);

  useEffect(() => {
    const levelParam = searchParams.get('level');
    let initialLevel: Level;
    if (levelParam === 'test') {
      initialLevel = generateTestStage();
    } else {
      initialLevel = generateSimpleLevel();
    }
    setLevel(initialLevel);
    setPlayer(createPlayer(initialLevel.playerStart.x, initialLevel.playerStart.y));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditorMode) return;
      if (player) {
        if (e.key === 'ArrowLeft') playerMove(player, 'left');
        if (e.key === 'ArrowRight') playerMove(player, 'right');
        if (e.key === 'ArrowUp' || e.key === ' ') playerJump(player);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isEditorMode) return;
      if (player) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') playerStop(player);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameLoop, isEditorMode, player, searchParams]); // Add searchParams to dependencies

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditorMode || !level) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    setLevel(prevLevel => {
      if (!prevLevel) return null;
      const newLevel = { ...prevLevel, tiles: [...prevLevel.tiles] };
      // Check if a tile already exists at this position
      const existingTileIndex = newLevel.tiles.findIndex(
        t => Math.floor(t.x / TILE_SIZE) === tileX && Math.floor(t.y / TILE_SIZE) === tileY
      );

      if (existingTileIndex !== -1) {
        // If existing tile is of the same type, remove it (toggle off)
        if (newLevel.tiles[existingTileIndex].type === selectedTileType) {
          newLevel.tiles.splice(existingTileIndex, 1);
        } else {
          // If existing tile is different type, change its type
          newLevel.tiles[existingTileIndex].type = selectedTileType;
        }
      } else {
        // Add new tile
        addTile(newLevel, tileX, tileY, selectedTileType);
      }
      return newLevel;
    });
  };

  const saveLevel = () => {
    if (level) {
      const levelData = JSON.stringify(level);
      localStorage.setItem('platformer_level', levelData);
      alert('Level saved!');
    }
  };

  const loadLevel = () => {
    const levelData = localStorage.getItem('platformer_level');
    if (levelData) {
      const loadedLevel: Level = JSON.parse(levelData);
      setLevel(loadedLevel);
      setPlayer(createPlayer(loadedLevel.playerStart.x, loadedLevel.playerStart.y));
      alert('Level loaded!');
    } else {
      alert('No saved level found!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Platformer Game</h1>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setIsEditorMode(!isEditorMode)}>
          {isEditorMode ? 'Switch to Game Mode' : 'Switch to Editor Mode'}
        </button>
        {isEditorMode && (
          <>
            <select
              onChange={(e) => setSelectedTileType(e.target.value as 'ground' | 'platform' | 'water')}
              value={selectedTileType}
              style={{ marginLeft: '10px' }}
            >
              <option value="ground">Ground</option>
              <option value="platform">Platform</option>
              <option value="water">Water</option>
            </select>
            <button onClick={saveLevel} style={{ marginLeft: '10px' }}>Save Level</button>
            <button onClick={loadLevel} style={{ marginLeft: '10px' }}>Load Level</button>
          </>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={level ? level.width * TILE_SIZE : 800}
        height={level ? level.height * TILE_SIZE : 600}
        style={{ border: '1px solid black', background: '#87CEEB' }}
        onClick={handleCanvasClick}
      />
      {!isEditorMode && player && (
        <div style={{ marginTop: '10px' }}>
          <p>Player X: {player.x.toFixed(2)}</p>
          <p>Player Y: {player.y.toFixed(2)}</p>
          <p>On Ground: {player.onGround ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default GamePage;