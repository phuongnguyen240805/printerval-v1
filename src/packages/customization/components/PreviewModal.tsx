'use client';

import React, { useRef } from 'react';
import { CanvasElement, CustomizationTemplate } from '../types';
import { CustomizationCanvasRenderer } from '../utils/canvasRenderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    template: CustomizationTemplate | null;
    elements: CanvasElement[];
    onAddToCart?: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
    open,
    onClose,
    template,
    elements,
    onAddToCart,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CustomizationCanvasRenderer | null>(null);

    React.useEffect(() => {
        if (!open || !template || !containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        if (elements.length === 0) {
            containerRef.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999; font-size: 14px;">No customizations applied</div>';
            return;
        }

        // Initialize renderer
        rendererRef.current = new CustomizationCanvasRenderer(
            template.canvas_width,
            template.canvas_height
        );

        // Generate SVG
        const svgHtml = rendererRef.current.renderSVG(elements);
        containerRef.current.innerHTML = svgHtml;

        // Resize SVG to fit container
        setTimeout(() => {
            const svg = containerRef.current?.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
            }
        }, 0);

        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [open, template, elements]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className=" pb-4">
                    <DialogTitle className="text-2xl">Please check the preview carefully</DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">
                        Make sure the customization is correct to receive your item faster
                    </p>
                </DialogHeader>

                {/* Live Preview */}
            <div>
                <div className="flex justify-center">
                 <div 
                        className="relative w-full bg-white border border-gray-300 shadow-sm flex items-center justify-center overflow-hidden"
                        style={{ 
                            // Dùng aspect-ratio để giữ khung hình vuông hoặc theo tỉ lệ canvas
                            aspectRatio: `${template?.canvas_width || 1} / ${template?.canvas_height || 1}`,
                            maxHeight: '50vh',
                        }}
                        id="live-preview-container"
                        >
                        {template && elements.length > 0 ? (
                            <svg
                                viewBox={`0 0 ${template.canvas_width} ${template.canvas_height}`}
                                style={{background: '#fff', width: '100%', height: '100%' }}
                            >
                                {/* Render all visible elements */}
                                {elements.map((el) => {
                                    if (el.isVisible === false) {
                                        console.log('[Live Preview] Skipping invisible element:', { element_id: el.element_id, type: el.type });
                                        return null;
                                    }
                                    const { x, y, width, height, fill, stroke, opacity, fontSize, fontFamily, text } = el.config;

                                    if (el.type === 'text') {
                                        console.log('[Live Preview] Rendering text element:', {
                                            element_id: el.element_id,
                                            text,
                                            x, y, fontSize,
                                            visible: el.isVisible,
                                            type: el.type
                                        });
                                    }

                                    if (el.type === 'shape') {
                                        return (
                                            <rect
                                                key={`${el.element_id}-shape`}
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                fill={fill || '#000'}
                                                stroke={stroke || 'none'}
                                                opacity={opacity || 1}
                                            />
                                        );
                                    }

                                    if (el.type === 'text') {
                                        console.log('[Live Preview] Rendering text element:', {
                                            element_id: el.element_id,
                                            text: el.config?.text,
                                            linkedOptionId: el.config?.linkedOptionId,
                                            visible: el.isVisible
                                        });
                                        return (
                                            <text
                                                key={`${el.element_id}-text`}
                                                x={x}
                                                y={y}
                                                fontSize={fontSize || 14}
                                                fill={fill || '#000'}
                                                fontFamily={fontFamily || 'Arial'}
                                                opacity={opacity || 1}
                                                textAnchor="start"
                                                dominantBaseline="hanging"
                                            >
                                                {text}
                                            </text>
                                        );
                                    }

                                    return null;
                                })}
                            </svg>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: '300px', color: '#999' }}>
                                Waiting for selections...
                            </div>
                        )}
                    </div>
                </div>
            </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Back to Edit
                    </Button>
                    <Button
                        onClick={onAddToCart}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                    >
                        🛒 ADD TO CART
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};


