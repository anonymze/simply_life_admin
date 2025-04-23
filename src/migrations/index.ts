import * as migration_20250422_101817 from './20250422_101817';
import * as migration_20250423_114716 from './20250423_114716';

export const migrations = [
  {
    up: migration_20250422_101817.up,
    down: migration_20250422_101817.down,
    name: '20250422_101817',
  },
  {
    up: migration_20250423_114716.up,
    down: migration_20250423_114716.down,
    name: '20250423_114716'
  },
];
