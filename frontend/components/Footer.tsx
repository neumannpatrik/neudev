export default function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-white py-4">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">© {new Date().getFullYear()} NeuDev</p>
          <div className="mt-2 text-sm text-gray-400">
            Portfolio & Project Management Application
          </div>
        </div>
      </div>
    </footer>
  )
} 