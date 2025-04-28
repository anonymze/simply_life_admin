import * as migration_20250425_040157 from './20250425_040157';
import * as migration_20250428_130252 from './20250428_130252';
import * as migration_20250428_135753 from './20250428_135753';

export const migrations = [
  {
    up: migration_20250425_040157.up,
    down: migration_20250425_040157.down,
    name: '20250425_040157',
  },
  {
    up: migration_20250428_130252.up,
    down: migration_20250428_130252.down,
    name: '20250428_130252',
  },
  {
    up: migration_20250428_135753.up,
    down: migration_20250428_135753.down,
    name: '20250428_135753'
  },
];
