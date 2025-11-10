import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image OCR - Agentic App',
  description: 'Extract text from images in your browser.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="border-b">
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              <span className="text-brand-600">Agentic</span> OCR
            </h1>
            <a
              className="text-sm text-gray-600 hover:text-gray-900"
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
            >
              Deployed on Vercel
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="border-t mt-16">
          <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-gray-500">
            Built with Next.js 14 and Tesseract.js
          </div>
        </footer>
      </body>
    </html>
  )
}
