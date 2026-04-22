import { ReactNode } from "react";

interface UploadButtonProps {
    endpoint: string;
    onClientUploadComplete?: (res: any) => void;
    onUploadError?: (error: Error) => void;
    children?: ReactNode;
    [key: string]: any; // Allow any other props
}

export const UploadButton = ({
    endpoint,
    onClientUploadComplete,
    onUploadError,
    children,
    ...rest
}: UploadButtonProps) => {
    return (
        <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => {
                // Mock upload
                setTimeout(() => {
                    onClientUploadComplete?.([{ url: "https://via.placeholder.com/300" }]);
                }, 1000);
            }}
            {...rest}
        >
            {children || "Upload"}
        </button>
    );
};
