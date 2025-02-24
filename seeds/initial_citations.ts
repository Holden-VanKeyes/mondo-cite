import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("table_name").del();
  await knex('citation_authors').del()
  await knex('citations').del()
  await knex('authors').del()

  const [garcia, zhang, patel] = await knex('authors')
    .insert([
      {
        first_name: 'Maria',
        last_name: 'Garcia',
        affiliation: 'Universidad de São Paulo',
      },
      {
        first_name: 'Wei',
        last_name: 'Zhang',
        affiliation: 'Tsinghua University',
      },
      {
        first_name: 'Priya',
        last_name: 'Patel',
        affiliation: 'Indian Institute of Science',
      },
    ])
    .returning('id')

  // Insert citations
  const [citation1, citation2] = await knex('citations')
    .insert([
      {
        title:
          'Comparative Analysis of Research Methodologies in Latin America',
        journal: 'International Journal of Research Methods',
        year: 2023,
        doi: '10.1234/ijrm.2023.001',
        url: 'https://example.com/paper1',
        abstract:
          'A comprehensive study of research methodologies employed across Latin American institutions...',
      },
      {
        title:
          'Machine Learning Applications in Multilingual Academic Publishing',
        journal: 'Digital Library Quarterly',
        year: 2024,
        doi: '10.1234/dlq.2024.002',
        url: 'https://example.com/paper2',
        abstract:
          'Analysis of AI-driven approaches to managing multilingual academic content...',
      },
    ])
    .returning('id')

  // Create author associations
  await knex('citation_authors').insert([
    { citation_id: citation1.id, author_id: garcia.id },
    { citation_id: citation1.id, author_id: patel.id },
    { citation_id: citation2.id, author_id: zhang.id },
    { citation_id: citation2.id, author_id: garcia.id },
  ])
}
