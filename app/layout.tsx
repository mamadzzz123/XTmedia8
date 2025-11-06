import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XT',
  description: 'XT — شبکه اجتماعی مدرن شبیه توییتر با تم آبی-سفید'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-3xl w-full">
          {children}
        </div>
      </body>
    </html>
  )
}


