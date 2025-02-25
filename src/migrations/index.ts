import * as migration_20250225_170612 from './20250225_170612';

export const migrations = [
  {
    up: migration_20250225_170612.up,
    down: migration_20250225_170612.down,
    name: '20250225_170612'
  },
];
