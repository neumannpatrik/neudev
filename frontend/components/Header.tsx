"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-primary-dark shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center text-white text-2xl font-bold gap-2">
          NeuDev
          <img src="/icon.png" alt="neudev logo" className="h-10 w-10 object-contain" />
        </Link>
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-primary-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-primary-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-primary-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-primary-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
        <ul
          className={`flex-col md:flex-row md:flex gap-3 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-primary-dark md:bg-transparent z-40 transition-all duration-200 ${menuOpen ? 'flex' : 'hidden md:flex'}`}
        >
          <li>
            <Link href="/" className="text-primary-white hover:text-primary-light transition-colors block py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link href="/contact" className="ml-2 bg-primary-light text-primary-dark font-semibold px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all my-1 md:my-0" onClick={() => setMenuOpen(false)}>Get in Touch</Link>
          </li>
          <li>
            <Link href="/profile" className="text-primary-white hover:text-primary-light transition-colors block py-2" onClick={() => setMenuOpen(false)}>Client Portal</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 