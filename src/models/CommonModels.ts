export interface Airs {
  day?: null | string;
  time?: null | string;
  timezone?: string;
}

export interface Ids {
  trakt?: number;
  tvdb?: number | null;
  imdb?: null | string;
  tmdb?: number | null;
  tvrage?: number | null;
  slug?: string;
}

export interface IDictionary {
  [index: string]: string;
}