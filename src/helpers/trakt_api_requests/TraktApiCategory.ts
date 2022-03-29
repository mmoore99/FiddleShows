export default abstract class TraktApiCategory {
  private _apiSession: any;

  protected constructor(apiSession: any) {
    this._apiSession = apiSession;
  }
}