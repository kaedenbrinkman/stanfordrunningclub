import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import RecordsSection from '@/components/custom/RecordsSection'

export const revalidate = 60

export const metadata = {
  title: 'Stanford Running Club | Records',
  description: 'Club records across track, cross country, road, field, and more',
}

export default async function RecordsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const recordsResult = await payload.find({
    collection: 'records',
    depth: 1,
    limit: 1000,
    sort: 'order',
  })

  return (
    <div className="bg-background">
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24 pb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground uppercase tracking-tight mb-3">
          RECORDS
        </h1>
        <div className="w-24 h-1 bg-primary mb-8" />
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
          All-time and recent club bests across track, cross country, road, field events, and more.
        </p>
      </section>

      <RecordsSection records={recordsResult.docs} showHeading={false} className="pt-8" />
    </div>
  )
}
