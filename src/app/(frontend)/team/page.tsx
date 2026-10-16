import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import config from '@/payload.config'
import RosterMemberCard from '@/components/custom/RosterMemberCard'
import {
  classYearOrder,
  classYearSectionLabels,
  groupMembersByClassYear,
} from '@/lib/rosterGrouping'
import { rosterPublicSelect } from '@/lib/rosterPublicSelect'

export const revalidate = 60

export const metadata = {
  title: 'Stanford Running Club | The Team',
  description: 'Meet the Stanford Running Club competitive team and coach',
}

export default async function TeamPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const teamData = await payload.findGlobal({
    slug: 'team',
    depth: 2,
  })

  const activeRosterSeason = teamData.activeRosterSeason || '2025–26'

  const rosterResult = await payload.find({
    collection: 'competitive-team-members',
    depth: 1,
    limit: 500,
    sort: 'order',
    select: rosterPublicSelect,
    where: {
      and: [
        { published: { equals: true } },
        { season: { equals: activeRosterSeason } },
      ],
    },
  })

  const rosterByClass = groupMembersByClassYear(rosterResult.docs)

  const heroImageData = typeof teamData.heroImage === 'object' ? teamData.heroImage : null
  const coachImageData = typeof teamData.coachImage === 'object' ? teamData.coachImage : null
  const coachHeadshotData =
    typeof teamData.coachHeadshot === 'object' ? teamData.coachHeadshot : null

  return (
    <div className="bg-background">
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto mb-12">
          {heroImageData && heroImageData.url ? (
            <div className="relative w-full aspect-video overflow-hidden border-2 border-border">
              <Image
                src={heroImageData.url}
                alt={heroImageData.alt || 'Stanford Running Club Team'}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted border-2 border-border" />
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 uppercase tracking-tight">
            {teamData.header}
          </h1>
          <div className="w-24 h-1 bg-primary mb-8" />

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            {teamData.description}
          </p>

          <a
            href={teamData.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity no-underline border-b-2 border-destructive"
          >
            JOIN THE TEAM
          </a>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {coachImageData && coachImageData.url && (
              <div className="hidden lg:block relative w-full h-full min-h-[500px] overflow-hidden">
                <Image
                  src={coachImageData.url}
                  alt={coachImageData.alt || teamData.coachName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                {coachHeadshotData && coachHeadshotData.url && (
                  <div className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-border flex-shrink-0">
                    <Image
                      src={coachHeadshotData.url}
                      alt={coachHeadshotData.alt || teamData.coachName}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}

                <div className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
                  COACH
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight mb-4">
                {teamData.coachName}
              </h2>
              <div className="w-16 h-1 bg-primary mb-6" />

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {teamData.coachBio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-3">
            {activeRosterSeason} ROSTER
          </h2>
          <div className="w-24 h-1 bg-primary mb-4" />
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            Competitive team members racing with SRC this season.
          </p>
        </div>

        {rosterResult.docs.length === 0 ? (
          <div className="border-2 border-border bg-card p-12 text-center">
            <p className="text-sm uppercase tracking-wide font-semibold text-muted-foreground">
              ROSTER COMING SOON
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {classYearOrder.map((yearKey) => {
              const members = rosterByClass.get(yearKey) || []
              if (members.length === 0) return null

              return (
                <div key={yearKey}>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-2">
                    {classYearSectionLabels[yearKey]}
                  </h3>
                  <div className="w-16 h-1 bg-primary mb-8" />

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {members.map((member) => (
                      <RosterMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
