'use client';

import { GoalsContainer } from './components/GoalsContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">doit</h1>
          <p className="text-gray-600">Stay organized and achieve your goals</p>
        </header>
        <GoalsContainer />
      </div>
    </main>
  );
}
