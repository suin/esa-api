import { isObject } from "@suin/is-object";
import { AxiosError, AxiosResponse } from "axios";

export class Ratelimit {
  readonly limit: number;
  readonly remaining: number;
  readonly reset: number;

  constructor({
    limit,
    remaining,
    reset,
  }: {
    readonly limit: number;
    readonly remaining: number;
    readonly reset: number;
  }) {
    this.limit = limit;
    this.remaining = remaining;
    this.reset = reset;
  }

  get resetAsDate(): Date {
    return new Date(this.reset * 1000);
  }

  async cooldown(
    timeoutMilliseconds: number = 15 * 60 * 1000, // 15 minutes
  ): Promise<void> {
    if (this.remaining > 0) {
      return;
    }

    const milliseconds = this.reset - Date.now();
    let timer1: NodeJS.Timeout | number = 0;
    let timer2: NodeJS.Timeout | number = 0;

    try {
      await Promise.race([
        new Promise((resolve) => (timer1 = setTimeout(resolve, milliseconds))),
        new Promise(
          (resolve) => (timer2 = setTimeout(resolve, timeoutMilliseconds)),
        ),
      ]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  }
}

/**
 * @internal
 */
declare module "axios" {
  export interface AxiosResponse<T = any> {
    ratelimit?: Ratelimit;
  }
}

/**
 * @internal
 */
export function setRatelimit(response: AxiosResponse): AxiosResponse;
export function setRatelimit<T>(error: T): Promise<T>;
export function setRatelimit<T>(
  responseOrError: AxiosResponse | T,
): AxiosResponse | Promise<T> {
  let response: AxiosResponse | undefined;
  let returns: AxiosResponse | Promise<T>;
  if (isObject(responseOrError) && "headers" in responseOrError) {
    response = responseOrError;
    returns = responseOrError;
  } else {
    returns = Promise.reject(responseOrError);
    response =
      isAxiosError(responseOrError) && isObject(responseOrError.response)
        ? responseOrError.response
        : undefined;
  }
  if (response === undefined) {
    return returns;
  }
  const limit = parseInt(response.headers?.["x-ratelimit-limit"]);
  const remaining = parseInt(response.headers?.["x-ratelimit-remaining"]);
  const reset = parseInt(response.headers?.["x-ratelimit-reset"]);
  if (
    Number.isInteger(limit) &&
    Number.isInteger(remaining) &&
    Number.isInteger(reset)
  ) {
    response.ratelimit = new Ratelimit({ limit, remaining, reset });
  }
  return returns;
}

const isAxiosError = (error: unknown): error is AxiosError =>
  isObject<AxiosError>(error) && error.isAxiosError === true;
