export default {
  name: 'news',
  title: 'Nyhed',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Overskrift',
      type: 'string',
    },
    {
      name: 'publishedAt',
      title: 'Udgivelsesdato',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    },
    {
      name: 'mainImage',
      title: 'Billede',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'body',
      title: 'Tekst',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
