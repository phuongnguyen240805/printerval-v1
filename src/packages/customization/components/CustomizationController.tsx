'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCustomization } from '../hooks/useCustomization';
import { OptionSelector } from './OptionSelector';
import { PreviewModal } from './PreviewModal';
import { Button } from '@/shared/ui/button';
import { CustomizationProduct, CustomizationTemplate } from '../types';

interface CustomizationControllerProps {
    product: CustomizationProduct;
    template?: CustomizationTemplate;
    onApply?: (design: any) => void;
    onClose?: () => void;
}

export const CustomizationController: React.FC<CustomizationControllerProps> = ({
    product,
    template,
    onApply,
    onClose,
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const lastApplyRef = useRef<any>(null);

    const {
        initialize,
        options,
        template: currentTemplate,
        elements,
        changeOption,
        updateText,
        applyPersonal,
    } = useCustomization();

    useEffect(() => {
        if (product && product.id !== undefined) {
            initialize(product, template);
        }
    }, [product?.id]);

    // Auto-update preview when elements or options change
    useEffect(() => {
        if (onApply && currentTemplate && elements.length > 0) {
            try {
                const design = applyPersonal();
                // Check if elements actually changed before calling onApply
                const elementsStr = JSON.stringify(elements);
                if (lastApplyRef.current !== elementsStr) {
                    lastApplyRef.current = elementsStr;
                    onApply({ design, elements });
                }
            } catch (error) {
                console.error('[CustomizationController] Error in effect:', error);
            }
        }
    }, [elements, currentTemplate, options, onApply]);

    const handleOptionChange = (optionId: string, valueId: string) => {
        console.log('[CustomizationController] handleOptionChange:', { optionId, valueId });
        // For text-input options, valueId is actually the text content
        if (optionId === 'custom-text') {
            console.log('[CustomizationController] Calling updateText for custom-text:', valueId);
            updateText(optionId, valueId);
        } else {
            changeOption(optionId, valueId);
        }
    };

    const handleAddToCart = () => {
        try {
            const design = applyPersonal();
            if (onApply) {
                onApply({ design, elements: elements });
            }
            setPreviewOpen(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <>
            <div className="space-y-4">
                {/* Options Panel - No height constraint */}
                <div className="space-y-4">
                    {options.length > 0 ? (
                        <div className="pr-2">
                            {options.map((option) => (
                                <OptionSelector
                                    key={option.id}
                                    option={option}
                                    onSelectValue={(valueId) => handleOptionChange(option.id, valueId)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No customization options available</p>
                    )}
                </div>

                {/* Preview Button */}
                <Button
                    onClick={() => setPreviewOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base font-medium rounded-lg"
                >
                    👁️ Preview Your Personalization
                </Button>
            </div>


            {/* Preview Modal */}
            <PreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                template={currentTemplate}
                elements={elements}
                onAddToCart={handleAddToCart}
            />
        </>
    );
};


