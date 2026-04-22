import { mockImages } from "@/shared/features/page/CustomYourOwn/mockData";

export const useGetImages = () => {
    return {
        data: mockImages as any[],
        isLoading: false,
        isError: false,
    };
};
