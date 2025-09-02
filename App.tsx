
import React, { useState, useCallback } from 'react';
import type { ImageState, TryOnResult } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { generateVirtualTryOn } from './services/geminiService';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageState | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImageState | null>(null);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !outfitImage) {
      setError('Please upload both a person and an outfit image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateVirtualTryOn(personImage, outfitImage);
      setResult(generatedResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console and ensure your API key is configured.');
    } finally {
      setIsLoading(false);
    }
  }, [personImage, outfitImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-lg text-gray-400 mb-8">
            Upload a photo of a person and an outfit to virtually try it on. The AI will generate an image of the person wearing the selected clothes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader
              id="person-uploader"
              title="1. Upload Person Image"
              onImageSelect={setPersonImage}
            />
            <ImageUploader
              id="outfit-uploader"
              title="2. Upload Outfit Image"
              onImageSelect={setOutfitImage}
            />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleTryOn}
              disabled={!personImage || !outfitImage || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Generating...' : '✨ Virtually Try On'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center my-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Loader />}
          {result && <ResultDisplay result={result} />}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini API. Images are not stored.</p>
      </footer>
    </div>
  );
};

export default App;
