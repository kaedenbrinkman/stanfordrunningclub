import type { PublicRosterMember } from '@/lib/rosterPublicSelect'

/** Display order for roster section headings */
export const classYearOrder = ['frosh', 'soph', 'junior', 'senior', 'grad'] as const

export const classYearSectionLabels: Record<(typeof classYearOrder)[number], string> = {
  frosh: 'FROSH',
  soph: 'SOPHOMORES',
  junior: 'JUNIORS',
  senior: 'SENIORS',
  grad: 'GRAD STUDENTS',
}

export function groupMembersByClassYear(
  members: PublicRosterMember[],
): Map<(typeof classYearOrder)[number], PublicRosterMember[]> {
  const groups = new Map<(typeof classYearOrder)[number], PublicRosterMember[]>()

  for (const year of classYearOrder) {
    groups.set(year, [])
  }

  for (const member of members) {
    const key = member.classYear as (typeof classYearOrder)[number]
    if (groups.has(key)) {
      groups.get(key)!.push(member)
    }
  }

  for (const [, list] of groups) {
    list.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.name.localeCompare(b.name)
    })
  }

  return groups
}
