import { ApiBase } from "../types";

export interface IMessage {
  id: string;
  target: string;
  name: string;
  params: any[];
  value?: any;
  error?: string;
}

export const NOOP: (...args: any[]) => unknown = () => {};

export class Invoker<T extends ApiBase> {
  protected id = 0;
  protected readonly calls: Record<
    string,
    {
      id: string;
      resolve: (value: any) => void;
      reject: (e: unknown) => void;
      promise: Promise<any>;
    }
  > = {};
  protected cancel: () => void;

  constructor(
    protected name: string,
    protected readonly send: (message: IMessage) => void,
    protected readonly subscribe: (
      onMessage: (message: IMessage) => void
    ) => () => void
  ) {
    this.cancel = subscribe((message) => {
      if (!this.calls[message.id]) {
        throw new Error("not mine");
      }
      const info = this.calls[message.id];
      if (message.error !== undefined) {
        info.reject(message.error);
      } else {
        info.resolve(message.value);
      }
    });
  }

  invoke(
    target: string,
    name: keyof T & string,
    ...params: Parameters<T[typeof name]>
  ): Promise<ReturnType<T[typeof name]>> {
    const id = `${this.name}-${this.id++}`;
    const info = {
      id,
      resolve: NOOP,
      reject: NOOP,
      promise: new Promise<ReturnType<T[typeof name]>>(NOOP),
    };
    info.promise = new Promise((r, j) => {
      info.resolve = r;
      info.reject = j;
    });
    this.calls[id] = info;
    this.send({ id, target, name, params });
    return info.promise;
  }

  dispose() {
    this.cancel();
  }
}
