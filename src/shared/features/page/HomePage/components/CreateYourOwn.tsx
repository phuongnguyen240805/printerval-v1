import { useState, useRef } from "react";
import { useRouter } from "next/router";
import FadeIn from "@/shared/components/FadeIn";
import { IoCloudUploadOutline } from "react-icons/io5";

const CreateYourOwn = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (preview) {
            localStorage.setItem("cyo-upload-image", preview);
            router.push("/create-your-own");
        }
    };

    return (
        <div className='mx-auto w-full px-2 max-w-7xlsm:py-6 md:py-8'>
            <h1 className="text-lg px-8 xl:text-2xl font-semibold font-Inter text-gray-900 text-center mb-8 sm:mb-10">
                Customize products to reflect your unique taste and personality
            </h1>

            <div className="flex flex-col items-center justify-center gap-8">
                {/* Video Demo with Overlay Button */}
                <div className="relative max-w-2xl w-full" id="cyoMedia">
                    <video
                        width="640"
                        height="320"
                        controls
                        autoPlay
                        muted
                        loop
                        className="cyo-media w-full max-w-[640px] h-80 rounded-lg shadow-md bg-gray-100 block"
                        style={{
                            padding: '0px',
                            margin: '0px',
                            opacity: 1,
                            fontFamily: 'Inter',
                            fontSize: '16px',
                            color: 'rgb(68, 68, 68)'
                        }}
                        poster="/placeholder.png"
                    >
                        <source src="/video/cyo-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Upload Button - Positioned at 3/4 down */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute left-1/2 -translate-x-1/2 bottom-1/4 flex items-center gap-2 px-6 py-3 bg-[#FF8A00] text-white font-semibold rounded-lg hover:bg-[#E67600] transition-colors shadow-md hover:shadow-lg"
                    >
                        <span><IoCloudUploadOutline /></span> Upload image
                    </button>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Preview Section */}
                {preview && (
                    <div className="flex flex-col items-center mt-4 gap-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-xs rounded-lg shadow-md"
                        />
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            onClick={handleConfirm}
                        >
                            Create your own
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateYourOwn;