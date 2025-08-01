import { Level, Tile } from './types';
import { TILE_SIZE } from './constants';
import { createLevel, addTile } from './level';

export function generateTestStage(): Level {
  const level = createLevel(40, 25); // 40 tiles wide, 25 tiles high

  // Ground layer
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
  addTile(level, 12, level.height - 8, 'platform');

  addTile(level, 15, level.height - 10, 'platform');
  addTile(level, 16, level.height - 10, 'platform');

  // Water pit
  for (let i = 20; i < 25; i++) {
    addTile(level, i, level.height - 1, 'water');
    addTile(level, i, level.height - 2, 'water');
  }

  // Player start position
  level.playerStart = { x: TILE_SIZE * 2, y: level.height * TILE_SIZE - TILE_SIZE * 3 };

  return level;
}