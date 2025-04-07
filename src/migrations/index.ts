import * as migration_20250406_204801 from './20250406_204801';
import * as migration_20250407_193807 from './20250407_193807';
import * as migration_20250407_202157 from './20250407_202157';
import * as migration_20250407_202238 from './20250407_202238';

export const migrations = [
  {
    up: migration_20250406_204801.up,
    down: migration_20250406_204801.down,
    name: '20250406_204801',
  },
  {
    up: migration_20250407_193807.up,
    down: migration_20250407_193807.down,
    name: '20250407_193807',
  },
  {
    up: migration_20250407_202157.up,
    down: migration_20250407_202157.down,
    name: '20250407_202157',
  },
  {
    up: migration_20250407_202238.up,
    down: migration_20250407_202238.down,
    name: '20250407_202238'
  },
];
