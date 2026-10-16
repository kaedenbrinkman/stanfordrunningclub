import type { CompetitiveTeamMember } from '@/payload-types'

/** Fields safe to fetch for the public /team roster (Local API bypasses access by default). */
export const rosterPublicSelect = {
  name: true,
  photo: true,
  classYear: true,
  season: true,
  hometown: true,
  highSchool: true,
  major: true,
  mainEvents: true,
  eventInterests: true,
  funFact: true,
  highlights: true,
  order: true,
} as const

export type PublicRosterMember = Pick<
  CompetitiveTeamMember,
  'id' | keyof typeof rosterPublicSelect
>
