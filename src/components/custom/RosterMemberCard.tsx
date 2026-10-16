import React from 'react'
import Image from 'next/image'
import type { PublicRosterMember } from '@/lib/rosterPublicSelect'

const classYearLabels: Record<string, string> = {
  frosh: 'Frosh',
  soph: 'Sophomore',
  junior: 'Junior',
  senior: 'Senior',
  grad: 'Grad Student',
}

const eventInterestLabels: Record<string, string> = {
  sprints: 'Sprints',
  jumps: 'Jumps',
  'mid-distance': 'Mid-Distance',
  distance: 'Distance',
  'long-distance': 'Long Distance',
  'uphill-trail': 'Uphill / Trail',
}

interface RosterMemberCardProps {
  member: PublicRosterMember
}

export default function RosterMemberCard({ member }: RosterMemberCardProps) {
  const photoData = typeof member.photo === 'object' ? member.photo : null
  const classLabel = classYearLabels[member.classYear] || member.classYear
  const tags = (member.eventInterests || []).map(
    (value) => eventInterestLabels[value] || value,
  )

  return (
    <article className="flex flex-col h-full border-2 border-border bg-card p-6">
      <div className="flex items-start gap-4 mb-4">
        {photoData?.url ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
            <Image
              src={photoData.url}
              alt={photoData.alt || member.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex-shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight">
            {member.name}
          </h3>
          <div className="mt-2 inline-block px-3 py-1 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
            {classLabel}
          </div>
        </div>
      </div>

      {member.mainEvents ? (
        <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">
          {member.mainEvents}
        </p>
      ) : null}

      {(member.major || member.hometown) && (
        <dl className="text-xs text-muted-foreground space-y-1 mb-4 uppercase tracking-wide font-semibold">
          {member.major ? (
            <div>
              <dt className="inline text-foreground/80">Studies: </dt>
              <dd className="inline">{member.major}</dd>
            </div>
          ) : null}
          {member.hometown ? (
            <div>
              <dt className="inline text-foreground/80">From: </dt>
              <dd className="inline">{member.hometown}</dd>
            </div>
          ) : null}
          {member.highSchool ? (
            <div>
              <dt className="inline text-foreground/80">HS: </dt>
              <dd className="inline">{member.highSchool}</dd>
            </div>
          ) : null}
        </dl>
      )}

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {member.highlights ? (
        <p className="text-sm text-foreground mb-3 leading-relaxed">{member.highlights}</p>
      ) : null}

      {member.funFact ? (
        <p className="text-sm text-muted-foreground mt-auto leading-relaxed border-t border-border pt-4">
          {member.funFact}
        </p>
      ) : null}
    </article>
  )
}
