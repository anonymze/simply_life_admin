import * as migration_20250406_204801 from './20250406_204801';

export const migrations = [
  {
    up: migration_20250406_204801.up,
    down: migration_20250406_204801.down,
    name: '20250406_204801'
  },
];
