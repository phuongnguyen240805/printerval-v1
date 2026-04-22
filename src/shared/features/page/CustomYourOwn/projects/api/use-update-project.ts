import { useState } from "react";

type RequestType = { id: string; json: string; width: number; height: number };

export const useUpdateProject = (id: string) => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: RequestType) => {
    setIsPending(true);
    try {
      return { ...data, updatedAt: new Date() };
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, mutateAsync: mutate, isPending };
};
