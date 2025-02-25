import * as migration_20250225_175024 from './20250225_175024';

export const migrations = [
  {
    up: migration_20250225_175024.up,
    down: migration_20250225_175024.down,
    name: '20250225_175024'
  },
];
