import React from 'react';
import { Genre } from '../types/game';
import { ChevronDown } from 'lucide-react';

interface GenreSelectorProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreSelect: (genreId: number) => void;
  isLoading?: boolean;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
  isLoading = false
}) => {
  const selectedGenreName = genres.find(g => g.id === selectedGenre)?.name || 'Select a genre';

  return (
    <div className="relative">
      <select
        value={selectedGenre || ''}
        onChange={(e) => onGenreSelect(Number(e.target.value))}
        disabled={isLoading}
        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer"
      >
        <option value="">Select a genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );
};