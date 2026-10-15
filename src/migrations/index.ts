import * as migration_20251012_initial_schema from './20251012_initial_schema'
import * as migration_20251013_rename_group_me_url_to_discord_url from './20251013_rename_group_me_url_to_discord_url'

export const migrations = [
  {
    up: migration_20251012_initial_schema.up,
    down: migration_20251012_initial_schema.down,
    name: '20251012_initial_schema',
  },
  {
    up: migration_20251013_rename_group_me_url_to_discord_url.up,
    down: migration_20251013_rename_group_me_url_to_discord_url.down,
    name: '20251013_rename_group_me_url_to_discord_url',
  },
]
