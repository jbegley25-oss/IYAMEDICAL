import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { newsArticles } from '@/content/news'

export const metadata: Metadata = {
  title: 'News & Articles | Medical Insights',
  description:
    'Read the latest health articles and medical news from IYA Medical. Stay informed about interventional radiology, cancer treatment, vascular health, and minimally invasive procedures.',
  openGraph: {
    title: 'News & Articles | Medical Insights from IYA Medical',
    description:
      'Stay informed about interventional radiology, cancer treatment, vascular health, and minimally invasive procedures.',
    url: 'https://iyamedical.com/news',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IYA Medical News & Articles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Articles | Medical Insights from IYA Medical',
    description:
      'Latest health articles on interventional radiology, cancer treatment, and minimally invasive procedures.',
    images: ['/og-image.png'],
  },
}

export default function NewsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero relative bg-gradient-to-br from-teal-600 to-teal-800 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            News &amp; Articles
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-100">
            Read the latest health articles and medical news from IYA Medical.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <article
                key={article.slug}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image Placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-teal-200">IYA</span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {article.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>

                  <Link
                    href={`/news/${article.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
