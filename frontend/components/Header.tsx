export default function Header() {
  return (
    <header className="bg-primary-dark shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-primary-light text-2xl font-bold">
            Neudev
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-primary-white hover:text-primary-light transition-colors">
              Home
            </a>
            <a href="/portfolio" className="text-primary-white hover:text-primary-light transition-colors">
              Portfolio
            </a>
            <a href="/projects" className="text-primary-white hover:text-primary-light transition-colors">
              Projects
            </a>
            <a href="/contact" className="text-primary-white hover:text-primary-light transition-colors">
              Contact
            </a>
          </div>
          <div className="md:hidden">
            <button className="text-primary-white hover:text-primary-light">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
} 