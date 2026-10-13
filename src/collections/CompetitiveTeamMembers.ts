import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

const classYearOptions = [
  { label: 'Frosh', value: 'frosh' },
  { label: 'Sophomore', value: 'soph' },
  { label: 'Junior', value: 'junior' },
  { label: 'Senior', value: 'senior' },
  { label: 'Grad Student', value: 'grad' },
] as const

const eventInterestOptions = [
  { label: 'Sprints (100–400m, etc.)', value: 'sprints' },
  { label: 'Jumps', value: 'jumps' },
  { label: 'Mid-Distance (800m, mile)', value: 'mid-distance' },
  { label: 'Distance (5k–10k)', value: 'distance' },
  { label: 'Long Distance (half-marathon+)', value: 'long-distance' },
  { label: 'Uphill / Trail', value: 'uphill-trail' },
] as const

export const CompetitiveTeamMembers: CollectionConfig = {
  slug: 'competitive-team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'classYear', 'season', 'published', 'order'],
    description: 'Competitive team roster profiles shown on /team when published.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        published: { equals: true },
      }
    },
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, this member appears on the /team roster.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional — site shows a placeholder circle when empty.',
      },
    },
    {
      name: 'classYear',
      type: 'select',
      required: true,
      options: [...classYearOptions],
    },
    {
      name: 'season',
      type: 'text',
      required: true,
      defaultValue: '2025–26',
      admin: {
        description: 'Academic season label, e.g. 2025–26',
      },
    },
    {
      name: 'hometown',
      type: 'text',
    },
    {
      name: 'highSchool',
      type: 'text',
    },
    {
      name: 'major',
      type: 'text',
      admin: {
        description: 'Field of study',
      },
    },
    {
      name: 'mainEvents',
      type: 'text',
      admin: {
        description: 'Primary events for the roster card (e.g. "800m, 5k")',
      },
    },
    {
      name: 'eventInterests',
      type: 'select',
      hasMany: true,
      options: [...eventInterestOptions],
    },
    {
      name: 'funFact',
      type: 'textarea',
    },
    {
      name: 'highlights',
      type: 'textarea',
      admin: {
        description: 'PRs, titles, and other achievements for the roster',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Sort order within class year (lower = first)',
      },
    },
  ],
}
