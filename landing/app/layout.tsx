import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Neolithic | Task Manager & Window Organizer for Windows',
  description: 'Organize your tasks, manage browser tab groups, and monitor windows—all locally. No cloud. No extension required.',
  openGraph: {
    title: 'Neolithic',
    description: 'Organize your tasks, manage browser tab groups, and monitor windows—all locally.',
    url: 'https://neolithic.app',
    siteName: 'Neolithic',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
