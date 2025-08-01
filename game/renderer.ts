import { Player, Level, Tile } from './types';
import { TILE_SIZE } from './constants';

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

export function drawTile(ctx: CanvasRenderingContext2D, tile: Tile) {
  switch (tile.type) {
    case 'ground':
      ctx.fillStyle = 'green';
      break;
    case 'platform':
      ctx.fillStyle = 'brown';
      break;
    case 'water':
      ctx.fillStyle = 'blue'; // A simple blue for water
      break;
    default:
      ctx.fillStyle = 'black'; // Fallback color
  }
  ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
}

export function drawLevel(ctx: CanvasRenderingContext2D, level: Level) {
  for (const tile of level.tiles) {
    drawTile(ctx, tile);
  }
}