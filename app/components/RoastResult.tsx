import { useState } from 'react';

interface RoastResultProps {
  roast: string;
  onRoastAgain: () => void;
}

export default function RoastResult({ roast, onRoastAgain }: RoastResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn">
      <div className="bg-gray-800 rounded-lg p-6 mb-6 relative">
        <div className="absolute -top-3 left-4 bg-orange-500 text-xs px-2 py-1 rounded">
          Your Roast 🔥
        </div>
        
        <p className="text-lg mt-2 leading-relaxed text-gray-200 font-medium">
          {roast}
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy Roast'}
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.navigator.share({
                  title: 'My AI Roast',
                  text: roast,
                });
              }
            }}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Share
          </button>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onRoastAgain}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 transition-opacity"
        >
          Roast Me Again! 🔥
        </button>
      </div>
    </div>
  );
}
