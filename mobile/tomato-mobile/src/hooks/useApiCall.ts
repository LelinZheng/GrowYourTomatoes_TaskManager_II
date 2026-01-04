import { useState, useCallback } from 'react';

interface UseApiCallState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export const useApiCall = <T,>(
  apiFunction: () => Promise<T>,
  immediate = true
) => {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const result = await apiFunction();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, isLoading: false, error: err });
      throw err;
    }
  }, [apiFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};

import React from 'react';
