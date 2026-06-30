import { logger } from '../config/logger';

export class BaseHttpClient {
  protected async get<T>(url: string, headers?: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP GET failed with status ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      logger.error(`GET request to ${url} failed`, error);
      throw error;
    }
  }

  protected async post<T>(url: string, body: any, headers?: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP POST failed with status ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      logger.error(`POST request to ${url} failed`, error);
      throw error;
    }
  }
}
