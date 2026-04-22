import { useState } from "react";
import { mockProjectData } from "../../mockData";

export type ResponseType = {
  id: string;
  name: string;
  json: string;
  width: number;
  height: number;
  background?: string;
};

export const useGetProject = (id: string) => {
  const [data] = useState<ResponseType>({
    id: id || "project-1",
    name: mockProjectData.name,
    json: mockProjectData.json,
    width: mockProjectData.width,
    height: mockProjectData.height,
    background: mockProjectData.background,
  });

  return {
    data,
    isLoading: false,
    error: null,
  };
};
