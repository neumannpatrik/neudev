'use client';
import { FaCogs, FaBolt, FaHandshake, FaLaptopCode } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const TorusKnot3D = dynamic(() => import('../components/TorusKnot3D'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center text-left rounded-xl mt-8 gap-4">
        <div className="flex-shrink-0 flex justify-center items-center">
          <TorusKnot3D />
        </div>
        <div className="flex-1">
          <h1 className="w-full text-3xl md:text-5xl font-extrabold text-primary-light mb-6">
            Complex problems. Clear solutions.
          </h1>
          <p className="w-full text-xl md:text-2xl text-primary-white">
            Providing efficient, end-to-end software development and problem-solving for your business.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-primary-medium p-8 rounded-xl flex flex-col items-start hover:scale-105 transition-transform">
            <FaCogs className="text-4xl text-primary-light mb-4" />
            <h3 className="text-xl font-semibold text-primary-light mb-2">End-to-End Development</h3>
            <p className="text-primary-white">From backend to frontend, I build complete, scalable solutions tailored to your needs — no outsourcing, no handoff delays.</p>
          </div>
          <div className="bg-primary-medium p-8 rounded-xl flex flex-col items-start hover:scale-105 transition-transform">
            <FaBolt className="text-4xl text-primary-light mb-4" />
            <h3 className="text-xl font-semibold text-primary-light mb-2">Rapid Problem Solving</h3>
            <p className="text-primary-white">I grasp your technical challenges fast and deliver smart solutions — without the usual friction.</p>
          </div>
          <div className="bg-primary-medium p-8 rounded-xl flex flex-col items-start hover:scale-105 transition-transform">
            <FaHandshake className="text-4xl text-primary-light mb-4" />
            <h3 className="text-xl font-semibold text-primary-light mb-2">Long-Term Collaboration</h3>
            <p className="text-primary-white">Think of me as your dedicated tech partner. I help you evolve, adapt, and succeed with every line of code.</p>
          </div>
          <div className="bg-primary-medium p-8 rounded-xl flex flex-col items-start hover:scale-105 transition-transform">
            <FaLaptopCode className="text-4xl text-primary-light mb-4" />
            <h3 className="text-xl font-semibold text-primary-light mb-2">Clean, Modern Tech Stack</h3>
            <p className="text-primary-white">I use robust and proven technologies to build clean, maintainable systems with long-term value.</p>
          </div>
        </div>
      </section>
    </main>
  );
} 