import { useState } from "react";

export const useGenerateImage = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    data: { prompt: string },
    { onSuccess }: { onSuccess?: (result: any) => void } = {}
  ) => {
    setIsPending(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock response with placeholder image
      const result = {
        data: "/assets/products/1.jpg",
      };
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to generate image");
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
