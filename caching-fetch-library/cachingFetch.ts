// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge
import { useState, useEffect } from 'react';

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

// Cache object (to store the fetched data)
let cache: Record<string, { data: unknown; timestamp: number }> = {};

// Function to determine if the cache has expired (5 minutes for example)
const isCacheExpired = (timestamp: number): boolean => {
  const expirationTime = 5 * 60 * 1000; // 5 minutes
  return Date.now() - timestamp > expirationTime;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url: string) => {
  // State variables for loading, data, and error
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);

  // Check if the data is already in the cache
  useEffect(() => {
    if (cache[url] && !isCacheExpired(cache[url].timestamp)) {
      // If cache exists and is valid, use the cached data
      setData(cache[url].data);
      return;
    }

    // Fetch new data if not cached or cache is expired
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const fetchedData = await response.json();
        // Cache the new data
        cache[url] = { data: fetchedData, timestamp: Date.now() };
        setData(fetchedData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run when URL changes

  return { isLoading, data, error };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */

// Function to preload the data on the server
export const preloadCachingFetch = async (url: string): Promise<void> => {
  // Perform the fetch request to get the data
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data during preloading');
    }
    const fetchedData = await response.json();

    // Store the fetched data in the cache with the current timestamp
    cache[url] = { data: fetchedData, timestamp: Date.now() };
  } catch (err) {
    console.error('Error preloading data:', err);
  }
};


/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call serializeCache on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call initializeCache on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */

// 3.1 Serialize the cache to a string
export const serializeCache = (): string => {
  // Convert the cache object to a JSON string
  return JSON.stringify(cache);
};

export const initializeCache = (serializedCache: string): void => {};

export const wipeCache = (): void => {};