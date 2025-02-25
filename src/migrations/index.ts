import * as migration_20250225_175442 from './20250225_175442';

export const migrations = [
  {
    up: migration_20250225_175442.up,
    down: migration_20250225_175442.down,
    name: '20250225_175442'
  },
];
