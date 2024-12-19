'use client';

import { useState } from 'react';
import RoastResult from './components/RoastResult';

export default function Home() {
  const [formData, setFormData] = useState({
    basicInfo: '',
    activities: '',
    personalStatement: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roast, setRoast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roast');
      }

      setRoast(data.roast);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoastAgain = () => {
    setRoast(null);
    setFormData({
      basicInfo: '',
      activities: '',
      personalStatement: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <main className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            AI Roast Master
          </h1>
          <p className="text-gray-400">
            Prepare to get roasted by AI! Enter your info below and let the roasting begin.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {roast ? (
          <RoastResult roast={roast} onRoastAgain={handleRoastAgain} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-2">
              <label htmlFor="basicInfo" className="block text-sm font-medium text-gray-300">
                Basic Info
              </label>
              <input
                type="text"
                id="basicInfo"
                placeholder="Age, occupation, or anything interesting about you"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.basicInfo}
                onChange={(e) => setFormData({ ...formData, basicInfo: e.target.value })}
              />
            </div>

            {/* Activities */}
            <div className="space-y-2">
              <label htmlFor="activities" className="block text-sm font-medium text-gray-300">
                Activities & Hobbies
              </label>
              <textarea
                id="activities"
                placeholder="List your activities, hobbies, or things you're passionate about"
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              />
            </div>

            {/* Personal Statement */}
            <div className="space-y-2">
              <label htmlFor="personalStatement" className="block text-sm font-medium text-gray-300">
                Personal Statement
              </label>
              <textarea
                id="personalStatement"
                placeholder="Tell us more about yourself. The more you share, the spicier the roast!"
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.personalStatement}
                onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Preparing Your Roast...' : 'Roast Me! 🔥'}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Don't worry, our roasts are spicy but keep it fun! No harmful content included.
        </p>
      </main>
    </div>
  );
}
