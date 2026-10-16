import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed placeholder competitive team roster members (no real personal data).
 *
 * Usage: set -a && source .env && set +a && pnpm exec tsx src/seed/competitive-team-members.ts
 */

const PLACEHOLDER_MEMBERS = [
  {
    name: 'Alex Runner',
    classYear: 'frosh' as const,
    hometown: 'Sample City, CA',
    highSchool: 'Example High School',
    major: 'Computer Science',
    mainEvents: '5k, 10k',
    eventInterests: ['distance', 'long-distance'] as ('distance' | 'long-distance')[],
    funFact: 'Once ran a race in a banana costume.',
    highlights: 'XC debut: 18:45 5k',
    order: 0,
  },
]

async function seedCompetitiveTeamMembers() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  console.log('🌱 Seeding competitive team members (placeholder data)...')

  for (const member of PLACEHOLDER_MEMBERS) {
    await payload.create({
      collection: 'competitive-team-members',
      data: {
        ...member,
        published: true,
        season: '2025–26',
      },
    })
  }

  console.log(`✅ Created ${PLACEHOLDER_MEMBERS.length} placeholder roster members`)
  process.exit(0)
}

seedCompetitiveTeamMembers().catch((err) => {
  console.error(err)
  process.exit(1)
})
