import * as migration_20250422_101817 from './20250422_101817';

export const migrations = [
  {
    up: migration_20250422_101817.up,
    down: migration_20250422_101817.down,
    name: '20250422_101817'
  },
];
