'use client'

import { CheckCircle, Download, Github, Zap, Lock, Layers, Monitor, MonitorOff, Clock, Code } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-400" />,
      title: 'Smart Task Manager',
      desc: 'Create, prioritize, and track tasks with due dates. See what\'s overdue at a glance.',
    },
    {
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      title: 'Tab Groups',
      desc: 'Save collections of URLs. Open entire groups with one click.',
    },
    {
      icon: <Monitor className="w-8 h-8 text-green-400" />,
      title: 'Window Monitor',
      desc: 'Track Chrome, Edge, Firefox windows. Get alerts when you forget about one.',
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Window Organizer',
      desc: 'Snap windows left/right, maximize, or auto-grid all at once.',
    },
    {
      icon: <Lock className="w-8 h-8 text-red-400" />,
      title: 'Fully Local',
      desc: 'Everything stays on your computer. Encrypted at rest. No cloud required.',
    },
    {
      icon: <Code className="w-8 h-8 text-indigo-400" />,
      title: 'Open Source',
      desc: 'See exactly what the app does. MIT licensed. Contribute on GitHub.',
    },
  ]

  const faqs = [
    {
      q: 'Is my data safe?',
      a: 'Yes. All data is stored locally in SQLite on your computer. Passwords and encryption keys are encrypted at rest. No cloud sync, no telemetry.',
    },
    {
      q: 'Do I need a browser extension?',
      a: 'No. Neolithic uses Windows APIs to detect open browser windows. No extension required or recommended.',
    },
    {
      q: 'Can I use it offline?',
      a: 'Yes, mostly. You need internet only for the first login to create your account. Everything else works offline.',
    },
    {
      q: 'Will it slow down my computer?',
      a: 'No. It\'s lightweight (100MB installed), uses minimal CPU, and doesn\'t hook into your browser.',
    },
    {
      q: 'What if I uninstall it?',
      a: 'Your database stays on disk in %APPDATA%/Neolithic. Reinstall anytime to pick up where you left off.',
    },
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b border-stone-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
              N
            </div>
            <span className="text-lg sm:text-xl font-bold truncate">Neolithic</span>
          </div>
          <a
            href="https://github.com/risshabs22-quantified/neolithic-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-stone-800/50 transition text-sm sm:text-base"
          >
            <Github className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-24 lg:py-32 max-w-6xl mx-auto">
        <div className="absolute inset-0 -top-40 opacity-30 hidden sm:block">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative space-y-6 sm:space-y-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black gradient-text leading-tight">
            Your tasks. Your windows. All local.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed px-2">
            Neolithic is a lightweight Windows desktop app that organizes your tasks, manages browser tab groups, and monitors your windows—all stored locally. No cloud. No extension. Just you and your data.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
            <a
              href="https://github.com/risshabs22-quantified/neolithic-app/releases/latest"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all glow active:scale-95"
            >
              <Download className="w-5 h-5 flex-shrink-0" />
              <span>Download for Windows</span>
            </a>
            <a
              href="https://github.com/risshabs22-quantified/neolithic-app"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-800 rounded-xl font-semibold text-base sm:text-lg hover:bg-stone-700 transition-all active:scale-95"
            >
              <Github className="w-5 h-5 flex-shrink-0" />
              <span>View on GitHub</span>
            </a>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 pt-2 sm:pt-4">
            Windows 10+ • 108 MB • One-click installer • No admin required
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Everything you need</h2>
          <p className="text-stone-400 text-sm sm:text-lg">Six powerful tools in one lightweight app</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-stone-900/50 border border-stone-800/50 hover:border-stone-700 transition-all hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="mb-3 sm:mb-4 text-3xl sm:text-4xl">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-stone-400 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-6">Built for privacy</h2>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm sm:text-base">
                <Lock className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                <span>All data encrypted at rest on your computer</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base">
                <MonitorOff className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                <span>No phone home, no telemetry, no cloud required</span>
              </li>
              <li className="flex gap-3 text-sm sm:text-base">
                <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                <span>Works offline after first login</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-stone-800">
            <div className="aspect-square bg-stone-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-12 sm:w-16 h-12 sm:h-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-stone-400">Database location</p>
                <p className="font-mono text-xs sm:text-sm text-stone-300 mt-2 break-all px-2">%APPDATA%/Neolithic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Questions?</h2>
          <p className="text-stone-400 text-sm sm:text-lg">We've got answers</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group p-4 sm:p-6 rounded-lg sm:rounded-xl bg-stone-900/50 border border-stone-800/50 cursor-pointer hover:border-stone-700 transition-all"
            >
              <summary className="flex justify-between items-start sm:items-center font-semibold text-sm sm:text-lg gap-2">
                {faq.q}
                <span className="transition-transform group-open:rotate-180 flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-stone-400 leading-relaxed text-sm sm:text-base">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-stone-800 rounded-xl sm:rounded-2xl p-6 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to get organized?</h2>
          <p className="text-stone-300 mb-6 sm:mb-8 text-sm sm:text-lg">Download Neolithic and take control of your desktop.</p>
          <a
            href="https://github.com/risshabs22-quantified/neolithic-app/releases/latest"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all glow active:scale-95"
          >
            <Download className="w-5 h-5 flex-shrink-0" />
            Download Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800/30 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-stone-400 text-xs sm:text-sm text-center sm:text-left">
            © 2024 Neolithic. MIT License. Open source.
          </div>
          <div className="flex gap-4 sm:gap-6 text-sm">
            <a
              href="https://github.com/risshabs22-quantified/neolithic-app"
              className="text-stone-400 hover:text-stone-200 transition"
            >
              GitHub
            </a>
            <a
              href="https://github.com/risshabs22-quantified/neolithic-app/releases/latest"
              className="text-stone-400 hover:text-stone-200 transition"
            >
              Download
            </a>
            <a
              href="https://github.com/risshabs22-quantified/neolithic-app#readme"
              className="text-stone-400 hover:text-stone-200 transition"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
