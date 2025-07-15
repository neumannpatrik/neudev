"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary-dark shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-white text-2xl font-bold">
          Neudev
        </Link>
        <ul className="flex gap-8 items-center">
          <li>
            <Link href="/" className="text-primary-white hover:text-primary-light transition-colors block py-2">Home</Link>
          </li>
          <li>
            <Link href="/contact" className="ml-2 bg-primary-light text-primary-dark font-semibold px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all">Get in Touch</Link>
          </li>
          <li>
            <Link href="/profile" className="text-primary-white hover:text-primary-light transition-colors block py-2">Client Portal</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 