export default abstract class TraktApiCategory {
  protected _apiSession: any;

  protected constructor(apiSession: any) {
    this._apiSession = apiSession;
  }
}