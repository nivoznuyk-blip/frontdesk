import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CodeBlock } from '@/components/ui';
import { Container } from '@/components/layout/Container';
import { docBySlug, docs } from '@/mock/docs';
import type { DocArticle } from '@/mock/docs';
import { count } from '@/lib/format';
import { cn } from '@/lib/cn';

function Contents({ current }: { current?: DocArticle }) {
  return (
    <nav className="flex w-sidebar shrink-0 flex-col gap-4 max-md:w-full" aria-label="Docs">
      <span className="font-mono text-micro text-faint">contents</span>
      <ul className="flex flex-col gap-3">
        {docs.map((article) => {
          const active = article.slug === current?.slug;
          return (
            <li key={article.slug} className="flex flex-col gap-2">
              <Link
                to={`/docs/${article.slug}`}
                className={cn(
                  'text-sm transition-colors duration-fast ease-std',
                  active ? 'text-amber' : 'text-dim hover:text-text',
                )}
              >
                {article.title}
              </Link>
              {active && (
                <ul className="flex flex-col gap-2 border-l border-line pl-3">
                  {article.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="font-mono text-micro text-faint transition-colors duration-fast ease-std hover:text-dim"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Docs() {
  const { slug } = useParams();
  const article = slug ? docBySlug(slug) : undefined;

  if (slug && !article) {
    return (
      <Container className="flex flex-col gap-6 py-24">
        <h1 className="text-h2 font-medium">No such article</h1>
        <p className="max-w-measure text-dim">
          That address does not match anything in the docs. The four articles are listed below.
        </p>
        <Link to="/docs" className="font-mono text-micro text-faint transition-colors duration-fast ease-std hover:text-dim">
          back to the docs
        </Link>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-12 py-24">
      <header className="flex flex-col gap-3">
        <h1 className="text-h1 font-medium">Docs</h1>
        <p className="max-w-measure text-lg text-dim">
          Four short articles. They cover setting a bot up, keeping it accurate, and what it does
          when it does not know something.
        </p>
      </header>

      <div className="flex gap-12 max-md:flex-col">
        <Contents current={article} />

        <div className="flex min-w-0 flex-1 flex-col gap-12">
          {article ? (
            <article className="flex flex-col gap-12">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-micro text-faint tnum">
                  {count(article.minutes)} minute read
                </span>
                <h2 className="text-h2 font-medium">{article.title}</h2>
                <p className="max-w-measure text-lg text-dim">{article.summary}</p>
              </div>

              {article.sections.map((section) => (
                <section key={section.id} id={section.id} className="flex flex-col gap-4">
                  <h3 className="text-h3 font-medium">{section.heading}</h3>
                  {section.blocks.map((block, index) => {
                    if (block.type === 'code') return <CodeBlock key={index} code={block.text} />;
                    if (block.type === 'list') {
                      return (
                        <ul key={index} className="flex max-w-measure flex-col gap-2">
                          {block.items.map((item) => (
                            <li key={item} className="flex gap-3 text-dim">
                              <span className="text-faint">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} className="max-w-measure text-dim">
                        {block.text}
                      </p>
                    );
                  })}
                </section>
              ))}
            </article>
          ) : (
            <ul className="flex flex-col">
              {docs.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/docs/${item.slug}`}
                    className="group flex flex-col gap-2 border-b border-line py-6 first:pt-0 transition-colors duration-fast ease-std hover:bg-surface"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-lg text-text">{item.title}</span>
                      <span className="ml-auto shrink-0 font-mono text-micro text-faint tnum">
                        {count(item.minutes)} min
                      </span>
                    </span>
                    <span className="max-w-measure text-dim">{item.summary}</span>
                    <span className="flex items-center gap-2 font-mono text-micro text-faint transition-colors duration-fast ease-std group-hover:text-text">
                      read it
                      <ArrowRight size={12} aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
