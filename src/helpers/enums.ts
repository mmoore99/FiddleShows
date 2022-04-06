export enum HttpVerb {
  get,
  post,
  put,
  delete,
}

export enum EntityType{
  show,
  movie
}

export enum AuthorizationRequirement{
  Required,
  NotRequired,
  Optional
}

export enum ShowMovieType{
  shows = "shows",
  movies = "movies"
}

export enum SyncGetHistoryTypes{
  movies = "movies",
  seasons = "seasons",
  episodes = "episodes",
  shows = "shows"
}

export enum SyncGetWatchlistTypes{
  movies = "movies",
  seasons = "seasons",
  episodes = "episodes",
  shows = "shows"
}

export enum GetListItemsTypes{
  movies = "movie",
  seasons = "season",
  episodes = "episode",
  shows = "show",
  person = "person"
}

export enum SyncGetWatchlistSortTypes{
  rank = "rank",
  added = "added",
  released = "released",
  title = "title"
}
