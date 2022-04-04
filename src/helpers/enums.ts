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