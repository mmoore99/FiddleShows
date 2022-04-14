export interface Airs {
  day?: null | string;
  time?: null | string;
  timezone?: string;
}

export interface IDictionary {
  [index: string]: any;
}

export class Range<T>{
  begin: T;
  end: T;
  constructor(begin: T,  end:T) {
    this.begin = begin;
    this.end = end;
  } 
}

export interface RateLimit{
  name: string;
  period: number;
  limit: number;
  remaining: number;
  until: Date;
}