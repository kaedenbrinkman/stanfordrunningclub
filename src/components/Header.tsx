'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image src="/android-chrome-192x192.png" alt="Stanford Running Club" width={20} height={20} />
          <span className="text-sm font-black uppercase tracking-wide text-foreground hidden md:block lg:hidden">
            STANFORD RUN
          </span>
          <span className="text-sm font-black uppercase tracking-wide text-foreground hidden md:hidden lg:block">
            STANFORD RUNNING CLUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-1 list-none m-0 p-0">
            <li>
              <Link
                href="/about"
                className="px-3 py-2 hover:bg-muted text-xs font-semibold uppercase tracking-wide transition-colors no-underline text-foreground"
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/runs"
                className="px-3 py-2 hover:bg-muted text-xs font-semibold uppercase tracking-wide transition-colors no-underline text-foreground"
              >
                RUNS
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="px-3 py-2 hover:bg-muted text-xs font-semibold uppercase tracking-wide transition-colors no-underline text-foreground"
              >
                TEAM
              </Link>
            </li>
            <li>
              <Link
                href="/records"
                className="px-3 py-2 hover:bg-muted text-xs font-semibold uppercase tracking-wide transition-colors no-underline text-foreground"
              >
                RECORDS
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className="px-3 py-2 hover:bg-muted text-xs font-semibold uppercase tracking-wide transition-colors no-underline text-foreground"
              >
                HISTORY
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold uppercase tracking-wide transition-opacity no-underline border-b-2 border-destructive"
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            {mobileMenuOpen ? (
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="square" strokeLinejoin="miter" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="px-4 py-2">
            <ul className="flex flex-col gap-0 list-none m-0 p-0">
              <li>
                <Link
                  href="/about"
                  className="block px-3 py-3 hover:bg-muted text-xs font-semibold uppercase tracking-wide no-underline text-foreground border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/runs"
                  className="block px-3 py-3 hover:bg-muted text-xs font-semibold uppercase tracking-wide no-underline text-foreground border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  RUNS
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="block px-3 py-3 hover:bg-muted text-xs font-semibold uppercase tracking-wide no-underline text-foreground border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  TEAM
                </Link>
              </li>
              <li>
                <Link
                  href="/records"
                  className="block px-3 py-3 hover:bg-muted text-xs font-semibold uppercase tracking-wide no-underline text-foreground border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  RECORDS
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="block px-3 py-3 hover:bg-muted text-xs font-semibold uppercase tracking-wide no-underline text-foreground border-b border-border"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HISTORY
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block px-3 py-3 bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold uppercase tracking-wide no-underline text-center mt-2 border-b-2 border-destructive"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
