export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-medium">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-light mb-6">
            Welcome to Neudev
          </h1>
          <p className="text-xl text-primary-white mb-8 max-w-2xl mx-auto">
            A modern portfolio and project management application built with NextJS, Express, Prisma, and PostgreSQL.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-primary-medium p-6 rounded-lg shadow-lg">
              <h3 className="text-primary-light text-xl font-semibold mb-3">Portfolio</h3>
              <p className="text-primary-white">Showcase your projects and skills with a beautiful, responsive design.</p>
            </div>
            
            <div className="bg-primary-medium p-6 rounded-lg shadow-lg">
              <h3 className="text-primary-light text-xl font-semibold mb-3">Project Management</h3>
              <p className="text-primary-white">Organize and track your projects with powerful management tools.</p>
            </div>
            
            <div className="bg-primary-medium p-6 rounded-lg shadow-lg">
              <h3 className="text-primary-light text-xl font-semibold mb-3">Modern Tech Stack</h3>
              <p className="text-primary-white">Built with the latest technologies for optimal performance and scalability.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button className="bg-primary-light hover:bg-opacity-80 text-primary-dark font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 