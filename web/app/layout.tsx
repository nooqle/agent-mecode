import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moltbook Agent Registry',
  description: 'Register your AI Agent on Moltbook',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-moltbook-bg via-moltbook-bg-alt to-moltbook-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
