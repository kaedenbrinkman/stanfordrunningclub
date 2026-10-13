import React from 'react'
import type { Record as RecordType } from '@/payload-types'

interface GroupedRecords {
  [category: string]: {
    [distance: string]: RecordType[]
  }
}

const categoryLabels: { [key: string]: string } = {
  track: 'TRACK',
  xc: 'CROSS COUNTRY',
  road: 'ROAD',
  field: 'FIELD',
  misc: 'MISCELLANEOUS',
}

const categoryOrder = ['track', 'xc', 'road', 'field', 'misc']

export function groupRecords(docs: RecordType[]): GroupedRecords {
  const groupedRecords: GroupedRecords = {}
  docs.forEach((record) => {
    if (!groupedRecords[record.category]) {
      groupedRecords[record.category] = {}
    }
    if (!groupedRecords[record.category][record.distance]) {
      groupedRecords[record.category][record.distance] = []
    }
    groupedRecords[record.category][record.distance].push(record)
  })
  return groupedRecords
}

interface RecordsSectionProps {
  records: RecordType[]
  heading?: string
  className?: string
  showHeading?: boolean
}

export default function RecordsSection({
  records,
  heading = 'RECORDS',
  className = '',
  showHeading = true,
}: RecordsSectionProps) {
  const groupedRecords = groupRecords(records)

  return (
    <section className={`max-w-7xl mx-auto px-4 py-16 md:py-24 ${className}`}>
      {showHeading ? (
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-3">
            {heading}
          </h2>
          <div className="w-24 h-1 bg-primary" />
        </div>
      ) : null}

      <div className="flex flex-col gap-12">
        {categoryOrder.map((category) => {
          if (!groupedRecords[category]) return null

          return (
            <div key={category} className="flex flex-col gap-4">
              <div className="mb-4">
                <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight mb-2">
                  {categoryLabels[category]}
                </h3>
                <div className="w-16 h-1 bg-primary" />
              </div>

              {Object.entries(groupedRecords[category]).map(([distance, categoryRecords]) => (
                <div
                  key={distance}
                  className="border-2 border-border p-6 bg-card flex flex-col gap-4"
                >
                  <h4 className="text-lg font-black text-foreground uppercase tracking-tight">
                    {distance}
                  </h4>

                  {categoryRecords.length === 0 ? (
                    <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">
                      NO RECORDS YET
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {categoryRecords.map((record) => (
                        <div
                          key={record.id}
                          className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 border-t border-border pt-3 first:border-t-0 first:pt-0"
                        >
                          <p className="font-bold text-foreground lg:w-48 flex-shrink-0 text-sm uppercase tracking-wide">
                            {record.name}
                          </p>
                          <p className="font-bold text-foreground lg:w-32 flex-shrink-0 text-sm">
                            {record.time}
                          </p>
                          <p className="text-muted-foreground text-xs lg:w-32 flex-shrink-0 uppercase tracking-wide font-semibold">
                            {record.date}
                          </p>
                          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">
                            {record.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
