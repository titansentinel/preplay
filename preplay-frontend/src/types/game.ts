export interface Game {
  id: number;
  name: string;
  coverImage: string | null;
  genres?: string[];
  summary?: string;
  releaseYear?: number | null;
  platforms?: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface SearchResult {
  id: number;
  name: string;
  coverImage: string | null;
}