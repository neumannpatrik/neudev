import React from 'react';

export default function ContactPage() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center py-16">
      <section className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-light mb-6 text-center">Get in Touch</h2>
        <p className="text-primary-white mb-8 max-w-xl text-center">
          Ready to start your project or have questions? Reach out and let's talk about how I can help you achieve your goals.
        </p>
        <form className="w-full max-w-lg bg-primary-dark rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <input type="text" placeholder="Your Name" className="px-4 py-3 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" required />
          <input type="email" placeholder="Your Email" className="px-4 py-3 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" required />
          <textarea placeholder="Your Message" className="px-4 py-3 rounded bg-primary-medium text-primary-white focus:outline-none focus:ring-2 focus:ring-primary-light" rows={5} required />
          <button type="submit" className="bg-primary-light text-primary-dark font-semibold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-all">Send Message</button>
        </form>
      </section>
    </main>
  );
} 