import type { GlobalConfig } from 'payload'

export const Team: GlobalConfig = {
  slug: 'team',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'header',
      type: 'text',
      required: true,
      defaultValue: 'COMPETE WITH US!',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Ran in high school? We compete in cross country, track, and road races across the Bay Area and beyond. We have a great time and are always looking for new members.',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'joinUrl',
      type: 'text',
      required: true,
      defaultValue:
        'https://docs.google.com/forms/d/e/1FAIpQLSfqAx6QZlH1p14ZFe7uNFYTMaP15KNZ7BCYNd__-1Wid1flQQ/viewform?usp=sf_link',
    },
    {
      name: 'activeRosterSeason',
      type: 'text',
      required: true,
      defaultValue: '2025–26',
      admin: {
        description: 'Season label for the public roster on /team (must match member season values).',
      },
    },
    {
      name: 'coachName',
      type: 'text',
      required: true,
      defaultValue: 'Ernest Lee',
    },
    {
      name: 'coachBio',
      type: 'textarea',
      required: true,
      defaultValue:
        'A Palo Alto native (born in Stanford Hospital), Ernie Lee ran competitively for Gunn High School and Princeton University. After graduating with a degree in physics, Ernie completed graduate studies at Stanford in the applied physics department. It was then that he began coaching at his former high school. He coached both cross country and track and field at Gunn High School for 18 years. Ernie currently works for a nanomaterials company and still races as a member of the HOKA Aggies Running Club.',
    },
    {
      name: 'coachImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coachHeadshot',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
