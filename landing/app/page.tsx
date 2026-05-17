'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Download, CheckSquare, Bookmark, Globe, Monitor, Lock, Code, ArrowRight } from 'lucide-react'

const DOWNLOAD = 'https://github.com/risshabs22-quantified/neolithic-app/releases/latest/download/Neolithic-Setup.exe'

type BezierEase = [number, number, number, number]
const EASE: BezierEase = [0.16, 1, 0.3, 1]

/* ─── animation presets ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.65, ease: EASE },
  }),
}

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   APP WINDOW MOCKUP
═══════════════════════════════════════════════════════════ */
function AppWindow() {
  const tasks = [
    { done: true,  text: 'Review Q4 report',       tag: 'high',   tc: 'text-red-400 bg-red-500/10 border border-red-500/20' },
    { done: false, text: 'Ship v1.0.6',             tag: 'high',   tc: 'text-red-400 bg-red-500/10 border border-red-500/20' },
    { done: false, text: 'Update changelog',         tag: 'medium', tc: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
    { done: false, text: 'Write release notes',      tag: 'medium', tc: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
    { done: false, text: 'Clean up old tab groups',  tag: 'low',    tc: 'text-sky-400 bg-sky-500/10 border border-sky-500/20' },
  ]

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow underneath */}
      <div
        className="absolute -inset-px -z-10 rounded-2xl"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(99,102,241,0.38) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)',
          filter: 'blur(36px)',
          transform: 'scale(1.1) translateY(8%)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(99,102,241,0.2)' }}
      />

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(7,7,7,0.97)', boxShadow: '0 70px 140px rgba(0,0,0,0.9)' }}>
        {/* Title bar */}
        <div className="relative flex items-center px-5 h-10 border-b border-white/[0.05]" style={{ background: 'rgba(10,10,10,0.9)' }}>
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-zinc-600 font-medium tracking-wider">Neolithic</span>
        </div>

        <div className="flex" style={{ height: '320px' }}>
          {/* Sidebar */}
          <div className="w-44 border-r border-white/[0.05] flex-shrink-0 py-4 px-2 flex flex-col gap-0.5" style={{ background: 'rgba(5,5,5,0.8)' }}>
            <p className="px-3 pb-2.5 text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-bold">Navigation</p>
            {[
              { label: 'Dashboard', dot: 'bg-zinc-700' },
              { label: 'Tasks',     dot: 'bg-indigo-500', active: true },
              { label: 'Tab Groups',dot: 'bg-violet-500' },
              { label: 'Browser',   dot: 'bg-sky-500' },
              { label: 'Windows',   dot: 'bg-emerald-500' },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 text-[11px] px-3 py-2 rounded-lg cursor-default ${
                  item.active ? 'bg-indigo-500/12 text-indigo-300 font-semibold' : 'text-zinc-600'
                }`}
                style={item.active ? { boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.2)' } : {}}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-5 min-w-0 overflow-hidden" style={{ background: 'rgba(7,7,7,0.7)' }}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">My Tasks</span>
                <span className="text-[10px] text-zinc-600 bg-zinc-900/80 border border-white/[0.05] px-1.5 py-0.5 rounded-full">5</span>
              </div>
              <div className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg cursor-default font-semibold">+ New</div>
            </div>

            <div className="flex gap-1.5 mb-4">
              {(['All', 'Active', 'Done'] as const).map((f, i) => (
                <span key={f} className={`text-[10px] px-2.5 py-1 rounded-lg cursor-default font-medium ${i === 0 ? 'bg-white/[0.08] text-white border border-white/[0.08]' : 'text-zinc-700'}`}>{f}</span>
              ))}
            </div>

            <div className="space-y-1.5">
              {tasks.map((t, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.04]" style={{ background: t.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.025)' }}>
                  <div
                    className={`w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center border-2 ${t.done ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-700'}`}
                    style={t.done ? { boxShadow: '0 0 8px rgba(99,102,241,0.5)' } : {}}
                  >
                    {t.done && (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 text-[11px] truncate ${t.done ? 'line-through text-zinc-700' : 'text-zinc-300'}`}>{t.text}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full flex-shrink-0 font-bold uppercase tracking-wide ${t.tc}`}>{t.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const features = [
  { Icon: CheckSquare, title: 'Task Manager',      desc: "Tasks with priority levels and due dates. The dashboard shows what's overdue the moment you open the app.", color: 'text-indigo-400', iconBg: 'rgba(99,102,241,0.12)',  glow: 'rgba(99,102,241,0.1)' },
  { Icon: Bookmark,    title: 'Tab Groups',         desc: "Name and save URL collections. Reopen an entire project's browser context with one click.",                  color: 'text-violet-400', iconBg: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.1)' },
  { Icon: Globe,       title: 'Browser Monitor',    desc: "See which browser windows are open and in focus. Get notified when a window title hasn't changed in days.",   color: 'text-sky-400',    iconBg: 'rgba(56,189,248,0.12)', glow: 'rgba(56,189,248,0.1)' },
  { Icon: Monitor,     title: 'Window Organizer',   desc: 'Snap windows left or right, maximize them, or auto-grid everything on screen in one click.',                 color: 'text-emerald-400',iconBg: 'rgba(52,211,153,0.12)', glow: 'rgba(52,211,153,0.1)' },
  { Icon: Lock,        title: 'All local. Encrypted.', desc: 'SQLite on your own disk. Encryption keys generated once per machine — they never leave your computer.',   color: 'text-amber-400',  iconBg: 'rgba(251,191,36,0.12)', glow: 'rgba(251,191,36,0.1)' },
  { Icon: Code,        title: 'Open source',        desc: 'MIT license. No hidden network calls, no tracking, nothing undisclosed.',                                   color: 'text-zinc-400',   iconBg: 'rgba(161,161,170,0.08)',glow: 'rgba(161,161,170,0.06)' },
]

const faqs = [
  { q: 'Windows SmartScreen blocked the installer. Is it safe?',  a: 'Yes. SmartScreen flags all new unsigned executables by default — it says nothing about whether the software is malicious. Neolithic is fully open source, so you can read every line before running it. Click "More info" → "Run anyway".' },
  { q: 'Where does my data go?',                                    a: 'Nowhere external. All data is written to a SQLite database at %APPDATA%\\neolithic-app\\neolithic.db on your own machine. The app makes no outbound network connections after your first login.' },
  { q: 'Do I need a browser extension?',                            a: 'No. Neolithic reads open window titles using the Windows API directly from the OS. No extension, no browser modification, no elevated permissions required.' },
  { q: 'Does it work offline?',                                     a: 'After your first login — which creates a local account — yes, completely. There is no dependency on any external server after that point.' },
  { q: 'What happens to my data if I uninstall?',                   a: 'Your database stays at %APPDATA%\\neolithic-app\\ untouched. Reinstall at any time and pick up exactly where you left off.' },
]

const marqueeItems = ['Task Manager','Tab Groups','Browser Monitor','Window Organizer','Local Only','No Cloud','Open Source','MIT License','Windows 10+','SQLite','Zero Telemetry','100% Offline']

const steps = [
  { n: '1', title: 'Download the installer', sub: 'One NSIS installer. No runtime, no dependencies, no admin rights required.',
    lines: [{ t: 'comment', v: '# Single file, 108 MB' }, { t: 'cmd', v: 'Neolithic-Setup.exe' }] },
  { n: '2', title: 'Run it — create a local account', sub: 'Your account lives on-device. No email verification. No cloud.',
    lines: [{ t: 'comment', v: '# First launch creates local account' }, { t: 'var', v: 'DATA_DIR', val: '%APPDATA%\\neolithic-app\\' }, { t: 'var', v: 'DB', val: 'neolithic.db  # encrypted SQLite' }] },
  { n: '3', title: "You're done", sub: 'All four tools are ready. Zero config. Fully offline from here.',
    lines: [{ t: 'ok', v: 'Tasks' }, { t: 'ok', v: 'Tab Groups' }, { t: 'ok', v: 'Browser Monitor' }, { t: 'ok', v: 'Window Organizer' }] },
]

/* ═══════════════════════════════════════════════════════════
   FAQ ITEM
═══════════════════════════════════════════════════════════ */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.05]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-left">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className={`flex-shrink-0 text-2xl font-thin leading-none mt-0.5 transition-colors duration-200 ${open ? 'text-indigo-400' : 'text-zinc-600'}`}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-zinc-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ── NAV ── floating pill */}
      <motion.header
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:px-0 sm:w-auto"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <nav
          className="flex items-center justify-between gap-6 px-5 h-12 rounded-full glass"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-[6px] flex items-center justify-center text-xs font-black select-none" style={{ boxShadow: '0 0 14px rgba(99,102,241,0.55)' }}>N</div>
            <span className="font-bold text-sm tracking-tight">Neolithic</span>
            <span className="hidden sm:inline text-[10px] text-indigo-400 font-mono border border-indigo-500/20 bg-indigo-500/[0.07] px-1.5 py-0.5 rounded-md">v1.0.6</span>
          </div>
        </nav>
      </motion.header>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-28 pb-24 overflow-hidden">

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute animate-orb-a" style={{ width: 720, height: 720, top: '5%', left: '15%', background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', filter: 'blur(70px)' }} />
          <div className="absolute animate-orb-b" style={{ width: 600, height: 600, top: '15%', right: '10%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', filter: 'blur(90px)' }} />
          <div className="absolute animate-orb-c" style={{ width: 450, height: 450, bottom: '15%', left: '38%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, black 25%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, black 25%, transparent 100%)' }} />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 border border-indigo-500/22 bg-indigo-500/[0.07] text-indigo-300 text-[11px] px-4 py-1.5 rounded-full mb-10 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              v1.0.6 &nbsp;·&nbsp; Windows 10+ &nbsp;·&nbsp; Free forever
              <ArrowRight className="w-3 h-3 opacity-50" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-black tracking-[-0.04em] leading-[0.88] mb-7"
              style={{ fontSize: 'clamp(54px, 10.5vw, 100px)' }}
            >
              <span className="block text-white">Your desktop.</span>
              <span className="text-gradient block">Under control.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp} custom={2} className="text-zinc-400 text-base sm:text-[1.1rem] max-w-lg mx-auto leading-relaxed mb-5">
              Tasks, browser tabs, and open windows — managed from one lightweight app.
              Everything lives on your machine. No cloud. No extension.
            </motion.p>

            {/* Tagline */}
            <motion.p variants={fadeUp} custom={3} className="text-zinc-600 text-sm italic max-w-md mx-auto leading-relaxed mb-10">
              &ldquo;A website I made just for those who just want to spill out what they
              need to do and get it done.&rdquo;
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
              <motion.a
                href={DOWNLOAD}
                download
                className="animate-glow group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-indigo-600 rounded-xl font-bold text-sm"
                style={{ minHeight: 48 }}
                whileHover={{ backgroundColor: 'rgb(99,102,241)', scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                Download for Windows
              </motion.a>
            </motion.div>

            <motion.p variants={fadeUp} custom={5} className="text-[11px] text-zinc-700">
              108 MB · NSIS installer · No admin rights required ·{' '}
              <span className="text-zinc-600">SmartScreen? &ldquo;More info&rdquo; → &ldquo;Run anyway&rdquo;</span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* App mockup */}
        <motion.div
          className="relative z-10 mt-20 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        >
          <AppWindow />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #030303)' }} />
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/[0.04] py-3.5 overflow-hidden" style={{ background: 'rgba(6,6,6,0.85)' }} aria-hidden="true">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 text-zinc-700 text-[11px] font-bold uppercase tracking-[0.18em] px-7">
              <span className="text-indigo-600/40">◆</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section className="px-5 py-20 sm:py-28">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background: 'rgba(7,7,7,0.6)' }}>
            {[
              { val: '108 MB',  sub: 'installed size',   color: 'text-indigo-400',  glow: 'rgba(99,102,241,0.3)' },
              { val: '0',       sub: 'cloud services',   color: 'text-violet-400',  glow: 'rgba(139,92,246,0.3)' },
              { val: 'SQLite',  sub: 'on-disk database', color: 'text-emerald-400', glow: 'rgba(52,211,153,0.3)' },
              { val: '100%',    sub: 'offline capable',  color: 'text-amber-400',   glow: 'rgba(251,191,36,0.3)' },
            ].map((s) => (
              <motion.div key={s.sub} className="px-6 py-10 sm:py-12 text-center" whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} transition={{ duration: 0.2 }}>
                <div className={`text-3xl sm:text-5xl font-black tabular-nums mb-2 ${s.color}`} style={{ textShadow: `0 0 32px ${s.glow}` }}>{s.val}</div>
                <div className="text-[11px] text-zinc-600 uppercase tracking-widest">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════
          MANIFESTO
      ══════════════════════════════════ */}
      <section className="relative border-y border-white/[0.05] px-5 py-28 sm:py-44 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 100%)' }} />
        <div className="absolute top-8 left-8 font-black select-none pointer-events-none" style={{ fontSize: 'clamp(120px, 20vw, 240px)', lineHeight: 1, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} aria-hidden="true">&ldquo;</div>

        <ScrollReveal className="relative max-w-4xl mx-auto text-center">
          <p className="text-[11px] text-indigo-400/80 font-bold uppercase tracking-[0.25em] mb-8">The philosophy</p>
          <blockquote className="font-black tracking-tight leading-[1.08]" style={{ fontSize: 'clamp(28px, 5.5vw, 58px)' }}>
            <span className="text-zinc-500">&ldquo;</span>
            <span className="text-white">A website I made just for those who </span>
            <span className="text-gradient">just want to spill out</span>
            <span className="text-white"> what they need to do</span>
            <span className="text-gradient"> and get it done.</span>
            <span className="text-zinc-500">&rdquo;</span>
          </blockquote>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════
          FEATURES — bento
      ══════════════════════════════════ */}
      <section className="px-5 py-20 sm:py-28 max-w-6xl mx-auto">
        <ScrollReveal className="mb-14">
          <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-3">Features</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] mb-4">What it does</h2>
          <p className="text-zinc-500 text-base max-w-md">Four focused tools in one installer. Nothing you don&apos;t need.</p>
        </ScrollReveal>

        <FeatureGrid />
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section className="border-t border-white/[0.05] px-5 py-20 sm:py-28" style={{ background: 'rgba(5,5,5,0.7)' }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="mb-14 text-center">
            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-3">Setup</p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] mb-4">Up in 30 seconds</h2>
            <p className="text-zinc-500">One installer. No config. No extension.</p>
          </ScrollReveal>

          <div className="space-y-8">
            {steps.map(({ n, title, sub, lines }, idx) => (
              <ScrollReveal key={n} delay={idx * 0.1}>
                <div className="group flex gap-5 sm:gap-8">
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center font-black text-sm text-zinc-600"
                    style={{ background: 'rgba(10,10,10,0.8)' }}
                    whileHover={{ borderColor: 'rgba(99,102,241,0.35)', color: 'rgb(129,140,248)' }}
                    transition={{ duration: 0.2 }}
                  >
                    {n}
                  </motion.div>
                  <div className="flex-1 min-w-0 pt-1.5">
                    <h3 className="font-bold text-[15px] text-white mb-1">{title}</h3>
                    <p className="text-zinc-500 text-sm mb-3.5">{sub}</p>
                    <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(9,9,9,0.95)' }}>
                      <div className="flex items-center gap-3 px-4 h-9 border-b border-white/[0.05]" style={{ background: 'rgba(12,12,12,0.9)' }}>
                        <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-zinc-800" />)}</div>
                        <span className="text-[10px] text-zinc-700 font-mono ml-1">step {n}</span>
                      </div>
                      <div className="px-5 py-4 font-mono text-[12px] leading-7">
                        {lines.map((ln, j) => {
                          if (ln.t === 'comment') return <p key={j} className="text-zinc-700">{ln.v}</p>
                          if (ln.t === 'cmd')     return <p key={j}><span className="text-indigo-400">$ </span><span className="text-zinc-200">{ln.v}</span></p>
                          if (ln.t === 'var')     return <p key={j}><span className="text-sky-400">{ln.v}</span><span className="text-zinc-600"> = </span><span className="text-emerald-400">{ln.val}</span></p>
                          if (ln.t === 'ok')      return <p key={j}><span className="text-emerald-400">✓  </span><span className="text-zinc-300">{ln.v}</span></p>
                          return null
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRIVACY
      ══════════════════════════════════ */}
      <section className="border-t border-white/[0.05] px-5 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <ScrollReveal>
            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-4">Privacy</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-[-0.03em] mb-8">
              Your data stays<br /><span className="text-gradient">on your desk</span>
            </h2>
            <ul className="space-y-4">
              {[
                'SQLite database written locally — no sync, no cloud backup',
                'Encryption keys generated once per machine, stored in AppData',
                'Zero outbound network connections after your first login',
                'Uninstall cleanly — your data stays in %APPDATA%\\neolithic-app\\',
              ].map((item, i) => (
                <motion.li
                  key={item}
                  className="flex gap-3.5 items-start text-sm text-zinc-400"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                >
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" style={{ boxShadow: '0 0 7px rgba(52,211,153,0.6)' }} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(6,6,6,0.95)', boxShadow: '0 40px 80px rgba(0,0,0,0.65)' }}>
              <div className="flex items-center gap-3 px-5 h-11 border-b border-white/[0.05]" style={{ background: 'rgba(10,10,10,0.9)' }}>
                <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-zinc-700" />)}</div>
                <span className="text-zinc-600 text-[11px] font-mono ml-2">AppData\Roaming</span>
              </div>
              <div className="p-6 font-mono text-[12px] space-y-2 leading-relaxed">
                <p className="text-zinc-700">C:\Users\you\AppData\Roaming\</p>
                <p className="text-zinc-500">{'└── '}<span className="text-white font-bold">neolithic-app</span>\</p>
                <p className="text-zinc-500 pl-7">{'├── '}<span className="text-emerald-400">neolithic.db</span><span className="text-zinc-700 ml-3 text-[11px]"># encrypted SQLite</span></p>
                <p className="text-zinc-500 pl-7">{'└── '}<span className="text-emerald-400">neolithic-secrets.json</span><span className="text-zinc-700 ml-3 text-[11px]"># machine keys</span></p>
                <div className="pt-5 mt-1 border-t border-white/[0.04] space-y-2">
                  <p className="text-zinc-700 text-[11px]"># network activity</p>
                  <p><span className="text-sky-400">outbound_requests</span><span className="text-zinc-600"> = </span><span className="text-white">0</span></p>
                  <p><span className="text-sky-400">telemetry        </span><span className="text-zinc-600"> = </span><span className="text-white">none</span></p>
                  <p><span className="text-sky-400">analytics        </span><span className="text-zinc-600"> = </span><span className="text-white">none</span></p>
                </div>
                <p className="pt-3">
                  <span className="text-indigo-400">$</span>
                  <span className="text-zinc-500"> _</span>
                  <span className="animate-blink text-zinc-400 ml-px">|</span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section className="border-t border-white/[0.05] px-5 py-20 sm:py-28" style={{ background: 'rgba(5,5,5,0.6)' }}>
        <div className="max-w-2xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.03em]">Common questions</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div>{faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA
      ══════════════════════════════════ */}
      <section className="relative border-t border-white/[0.05] px-5 py-28 sm:py-44 overflow-hidden">
        <div className="absolute inset-0 animate-gradient pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.14) 50%, rgba(99,102,241,0.07) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} aria-hidden="true" />

        <ScrollReveal className="relative max-w-xl mx-auto text-center">
          <h2 className="font-black tracking-[-0.04em] mb-5 text-gradient" style={{ fontSize: 'clamp(64px, 14vw, 120px)', lineHeight: 0.88 }}>
            Get it.
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">Free. Open source. Runs entirely on your machine.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href={DOWNLOAD}
              download
              className="animate-glow group inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 rounded-xl font-bold text-base"
              style={{ minHeight: 56 }}
              whileHover={{ scale: 1.03, backgroundColor: 'rgb(99,102,241)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
              Download v1.0.6 — Free
            </motion.a>
          </div>
          <p className="mt-7 text-xs text-zinc-700">108 MB · Windows 10 or later · No admin rights required</p>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] px-5 py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-6 h-6 bg-indigo-600 rounded-[5px] flex items-center justify-center text-[10px] font-black" style={{ boxShadow: '0 0 10px rgba(99,102,241,0.45)' }}>N</div>
              <span className="font-bold text-sm">Neolithic</span>
            </div>
            <p className="text-[11px] text-zinc-700 leading-relaxed">MIT License · Open source · Windows 10 or later<br />&copy; 2026 Neolithic</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FEATURE GRID — staggered scroll reveal
═══════════════════════════════════════════════════════════ */
function FeatureGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/[0.05]"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      {features.map(({ Icon, title, desc, color, iconBg, glow }) => (
        <motion.div
          key={title}
          variants={fadeUp}
          className="group relative p-8 overflow-hidden cursor-default"
          style={{ background: '#080808' }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {/* Hover radial glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 20%, ${glow} 0%, transparent 65%)` }} />

          <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-7 ${color}`} style={{ background: iconBg, boxShadow: `0 0 0 1px ${iconBg}` }}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="relative font-bold text-[15px] mb-3 text-white">{title}</h3>
          <p className="relative text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">{desc}</p>
          <div className="absolute bottom-7 right-7 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className={`w-4 h-4 ${color}`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
