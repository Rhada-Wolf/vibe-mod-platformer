export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  dx: number;
  dy: number;
  onGround: boolean;
}

export interface Tile extends GameObject {
  type: 'ground' | 'platform' | 'water';
}

export interface Level {
  width: number;
  height: number;
  tiles: Tile[];
  playerStart: { x: number; y: number };
}