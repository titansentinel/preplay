import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { GameCard } from './components/GameCard';
import { GenreSelector } from './components/GenreSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { gameApi } from './services/api';
import { Game, Genre, SearchResult } from './types/game';
import { Gamepad2, Sparkles } from 'lucide-react';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<SearchResult | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  const [searchError, setSearchError] = useState<string | null>(null);
  const [genresError, setGenresError] = useState<string | null>(null);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  // Load genres on component mount
  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    setGenresError(null);
    try {
      const genresData = await gameApi.getGenres();
      setGenres(genresData);
    } catch (error) {
      setGenresError('Failed to load genres. Please try again.');
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await gameApi.searchGames(query);
      setSearchResults(results);
      setSelectedGame(null);
      setRecommendations([]);
    } catch (error) {
      setSearchError('Failed to search games. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGameSelect = (game: SearchResult) => {
    setSelectedGame(game);
    setRecommendations([]);
    setRecommendationsError(null);
  };

  const handleGetRecommendations = async () => {
    if (!selectedGame || !selectedGenre) return;

    setIsLoadingRecommendations(true);
    setRecommendationsError(null);
    try {
      const recs = await gameApi.getRecommendations(selectedGame.id, selectedGenre);
      setRecommendations(recs);
    } catch (error) {
      setRecommendationsError('Failed to get recommendations. Please try again.');
      setRecommendations([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">GameFinder</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next favorite game based on what you've played before
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Search for a Game You've Played
            </h2>
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isSearching}
              placeholder="Enter a game title..."
            />
            
            {searchError && (
              <div className="mt-4">
                <ErrorMessage 
                  message={searchError} 
                  onRetry={() => handleSearch('')} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="max-w-6xl mx-auto mb-12">
            <LoadingSpinner text="Searching for games..." />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Search Results - Select a Game
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => handleGameSelect(game)}
                    isSelected={selectedGame?.id === game.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Genre Selection */}
        {selectedGame && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Selected Game: <span className="text-indigo-600">{selectedGame.name}</span>
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What genre are you in the mood for?
                </label>
                <GenreSelector
                  genres={genres}
                  selectedGenre={selectedGenre}
                  onGenreSelect={setSelectedGenre}
                  isLoading={isLoadingGenres}
                />
              </div>
              
              {genresError && (
                <div className="mb-4">
                  <ErrorMessage 
                    message={genresError} 
                    onRetry={loadGenres} 
                  />
                </div>
              )}

              {selectedGenre && (
                <button
                  onClick={handleGetRecommendations}
                  disabled={isLoadingRecommendations}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isLoadingRecommendations ? 'Getting Recommendations...' : 'Get Recommendations'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {isLoadingRecommendations && (
          <div className="max-w-6xl mx-auto mb-12">
            <LoadingSpinner text="Finding perfect games for you..." />
          </div>
        )}

        {recommendationsError && (
          <div className="max-w-6xl mx-auto mb-12">
            <ErrorMessage 
              message={recommendationsError} 
              onRetry={handleGetRecommendations} 
            />
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                Recommended Games for You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isSearching && searchResults.length === 0 && !selectedGame && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Ready to Find Your Next Game?
              </h3>
              <p className="text-gray-500">
                Start by searching for a game you've enjoyed playing recently
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;