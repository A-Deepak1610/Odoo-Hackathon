import { APP_NAME } from '../constants/index.js'

const sections = [
  {
    title: 'Client',
    items: ['components', 'layouts', 'pages', 'hooks', 'context', 'services'],
  },
  {
    title: 'Server',
    items: ['config', 'controllers', 'middleware', 'routes', 'models', 'services', 'utils'],
  },
]

export default function HomePage() {
  return (
    <main>
      <section>
        <p>Full-stack starter</p>
        <h1>{APP_NAME}</h1>
        <p>The client and server folders are scaffolded and ready for feature work.</p>
      </section>

      <section>
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.items.join(' · ')}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
