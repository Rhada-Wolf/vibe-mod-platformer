import { Player, Tile } from './types';
import { GRAVITY, JUMP_FORCE, PLAYER_SPEED, TILE_SIZE } from './constants';

export function createPlayer(x: number, y: number): Player {
  return {
    x,
    y,
    width: TILE_SIZE,
    height: TILE_SIZE * 1.5, // Player is a bit taller than a tile
    dx: 0,
    dy: 0,
    onGround: false,
  };
}

export function updatePlayer(player: Player, tiles: Tile[], deltaTime: number) {
  // Apply gravity
  player.dy += GRAVITY * deltaTime;

  // Update player position
  player.x += player.dx * deltaTime;
  player.y += player.dy * deltaTime;

  // Basic collision detection (AABB)
  player.onGround = false;
  for (const tile of tiles) {
    if (
      player.x < tile.x + tile.width &&
      player.x + player.width > tile.x &&
      player.y < tile.y + tile.height &&
      player.y + player.height > tile.y
    ) {
      // Collision detected
      if (player.dy > 0 && player.y + player.height - tile.y < player.dy * deltaTime + 1) {
        // Collided from top (landing on ground)
        player.y = tile.y - player.height;
        player.dy = 0;
        player.onGround = true;
      } else if (player.dy < 0 && tile.y + tile.height - player.y < -player.dy * deltaTime + 1) {
        // Collided from bottom (hitting head on tile)
        player.y = tile.y + tile.height;
        player.dy = 0;
      } else if (player.dx > 0 && player.x + player.width - tile.x < player.dx * deltaTime + 1) {
        // Collided from left
        player.x = tile.x - player.width;
        player.dx = 0;
      } else if (player.dx < 0 && tile.x + tile.width - player.x < -player.dx * deltaTime + 1) {
        // Collided from right
        player.x = tile.x + tile.width;
        player.dx = 0;
      }
    }
  }
}

export function playerJump(player: Player) {
  if (player.onGround) {
    player.dy = -JUMP_FORCE;
    player.onGround = false;
  }
}

export function playerMove(player: Player, direction: 'left' | 'right') {
  if (direction === 'left') {
    player.dx = -PLAYER_SPEED;
  } else {
    player.dx = PLAYER_SPEED;
  }
}

export function playerStop(player: Player) {
  player.dx = 0;
}