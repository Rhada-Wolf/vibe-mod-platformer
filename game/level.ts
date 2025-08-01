import { Level, Tile } from './types';
import { TILE_SIZE } from './constants';

export function createLevel(width: number, height: number): Level {
  return {
    width,
    height,
    tiles: [],
    playerStart: { x: TILE_SIZE, y: height * TILE_SIZE - TILE_SIZE * 2 },
  };
}

export function addTile(level: Level, x: number, y: number, type: 'ground' | 'platform' | 'water') {
  level.tiles.push({
    x: x * TILE_SIZE,
    y: y * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    type,
  });
}

export function generateSimpleLevel(): Level {
  const level = createLevel(20, 15); // 20 tiles wide, 15 tiles high

  // Ground
  for (let i = 0; i < level.width; i++) {
    addTile(level, i, level.height - 1, 'ground');
    addTile(level, i, level.height - 2, 'ground');
  }

  // Platforms
  addTile(level, 5, level.height - 5, 'platform');
  addTile(level, 6, level.height - 5, 'platform');
  addTile(level, 7, level.height - 5, 'platform');

  addTile(level, 10, level.height - 8, 'platform');
  addTile(level, 11, level.height - 8, 'platform');

  return level;
}