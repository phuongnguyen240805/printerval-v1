import React, { useState } from 'react';
import { X, Plus, ChevronRight, Sparkles } from 'lucide-react';

export interface VirtualTryOnModalProps {
    onClose?: () => void;
}

export default function VirtualTryOnModal({ onClose }: VirtualTryOnModalProps) {
    // State để lưu model đang được chọn (id của model)
    const [selectedModel, setSelectedModel] = useState<number>(1);

    // Dummy data cho danh sách models
    const models = [
        { id: 1, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/1_jqyuop.jpg", alt: "Model 1" },
        { id: 2, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/2_acezza.jpg", alt: "Model 2" },
        { id: 3, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/4_vorxsl.jpg", alt: "Model 3" },
        { id: 4, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/4_vorxsl.jpg", alt: "Model 4" },
        { id: 5, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/4_vorxsl.jpg", alt: "Model 5" },
        { id: 6, src: "https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564409/4_vorxsl.jpg", alt: "Model 6" },
    ];

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col font-sans">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between  border-b border-gray-100">
                <h2 className="text-xl sticky top-0 font-semibold">
                    <span className="text-[#845ec2]">Start Virtual </span>
                    <span className="text-[#f97316]">Try-On</span>
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
                {/* ── INSTRUCTION BANNER ── */}
                <div className="bg-[#f8f9fc] rounded-2xl p-4 flex gap-2 items-center">
                    {/* Placeholder for the graphic */}
                    <div className="w-32 h-24 bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                        Graphic Here
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-start">
                            <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">Select or Upload a Model</h4>
                                <p className="text-xs text-gray-600 mt-0.5">Choose a model or upload your own to try on the outfit.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">Generate the Outfit Preview</h4>
                                <p className="text-xs text-gray-600 mt-0.5">Click 'Generate' to see the outfit come to life on the model.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RECENT UPLOAD ── */}
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Recent upload</h3>
                    <button className="w-[100px] h-[130px] rounded-xl border-2 border-dashed border-orange-300 flex flex-col items-center justify-center hover:bg-orange-50 transition-colors group">
                        <div className="relative">
                            <Plus className="w-8 h-8 text-orange-500" strokeWidth={2.5} />
                            {/* Sparkle dot decoration */}
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <span className="text-orange-500 font-semibold text-sm">Upload now</span>
                    </button>
                </div>

                {/* ── SELECT A MODEL (CAROUSEL) ── */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Or select a model</h3>
                    <div className="relative">
                        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {models.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`relative w-[110px] h-[150px] rounded-xl overflow-hidden flex-shrink-0 snap-start transition-all ${selectedModel === model.id
                                        ? 'border-2 border-[#845ec2] ring-2 ring-purple-100'
                                        : 'border border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={model.src}
                                        alt={model.alt}
                                        className="w-full h-full object-cover bg-gray-200"
                                    />
                                </button>
                            ))}
                        </div>
                        {/* Right Arrow Navigation */}
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 z-10">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* ── TIPS FOR UPLOADING ── */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Tips for uploading images</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-[120px] rounded-xl overflow-hidden relative">
                            <img
                                src="https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564421/tip-1_sxgymd.png"
                                alt="Tip Image 1"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="h-[120px] rounded-xl overflow-hidden relative">
                            <img
                                src="https://res.cloudinary.com/dzkcqktcl/image/upload/q_auto/f_auto/v1775564421/tip-2_dgt2sf.png"
                                alt="Tip Image 2"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div> 
                {/* ── GENERATE BUTTON ── */}
            <button className="w-full sticky bottom-0 py-4 px-6 flex items-center justify-center gap-2 text-white font-bold text-lg rounded-b-xl bg-gradient-to-r from-[#9b59b6] to-[#e67e22] hover:opacity-90 transition-opacity">
                <Sparkles className="w-6 h-6 fill-white" />
                GENERATE
            </button>
            </div>

           

        </div>
    );
}

