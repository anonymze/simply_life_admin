import * as migration_20250406_204801 from './20250406_204801';
import * as migration_20250407_193807 from './20250407_193807';

export const migrations = [
  {
    up: migration_20250406_204801.up,
    down: migration_20250406_204801.down,
    name: '20250406_204801',
  },
  {
    up: migration_20250407_193807.up,
    down: migration_20250407_193807.down,
    name: '20250407_193807'
  },
];
