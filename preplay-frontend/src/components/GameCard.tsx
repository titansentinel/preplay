import React from 'react';
import { Game, SearchResult } from '../types/game';
import { Calendar, Monitor } from 'lucide-react';

interface GameCardProps {
  game: Game | SearchResult;
  onClick?: () => void;
  isSelected?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, isSelected }) => {
  const isFullGame = 'genres' in game;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
        {game.coverImage ? (
          <img
            src={game.coverImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Monitor className="w-12 h-12" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{game.name}</h3>
        
        {isFullGame && (
          <>
            {game.genres && game.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {game.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            {game.releaseYear && (
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {game.releaseYear}
              </div>
            )}
            
            {game.summary && (
              <p className="text-gray-600 text-sm line-clamp-3">{game.summary}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};