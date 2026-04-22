import { useState } from "react";
import { mockTemplates } from "../../mockData";

export type ResponseType = Array<{
  id: string;
  name: string;
  json: string;
}>;

export const useGetTemplates = () => {
  const [data] = useState<ResponseType>(mockTemplates);

  return {
    data,
    isLoading: false,
    error: null,
  };
};
