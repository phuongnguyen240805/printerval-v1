import { useState } from "react";

export const useRemoveBg = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    data: { image: string },
    { onSuccess }: { onSuccess?: (result: any) => void } = {}
  ) => {
    setIsPending(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock response - return same image
      const result = {
        data: data.image,
      };
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to remove background");
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    mutateAsync: mutate,
    isPending,
    error,
  };
};
