import * as migration_20250508_003538 from './20250508_003538';
import * as migration_20250512_131603 from './20250512_131603';
import * as migration_20250512_134359 from './20250512_134359';

export const migrations = [
  {
    up: migration_20250508_003538.up,
    down: migration_20250508_003538.down,
    name: '20250508_003538',
  },
  {
    up: migration_20250512_131603.up,
    down: migration_20250512_131603.down,
    name: '20250512_131603',
  },
  {
    up: migration_20250512_134359.up,
    down: migration_20250512_134359.down,
    name: '20250512_134359'
  },
];
