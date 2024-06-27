export const CHANNEL_ID = "chrome-extension";

export type ApiBase = Record<string, (...args: any[]) => Promise<any>>;

export interface Api extends ApiBase {
  listExtensions: () => Promise<{}[]>;
}
