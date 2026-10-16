import * as migration_20251012_initial_schema from './20251012_initial_schema'
import * as migration_20251013_rename_group_me_url_to_discord_url from './20251013_rename_group_me_url_to_discord_url'
import * as migration_20261013_competitive_team_roster from './20261013_competitive_team_roster'

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
  {
    up: migration_20261013_competitive_team_roster.up,
    down: migration_20261013_competitive_team_roster.down,
    name: '20261013_competitive_team_roster',
  },
]
