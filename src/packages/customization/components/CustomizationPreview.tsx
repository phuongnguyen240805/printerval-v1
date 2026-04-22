'use client';

import React, { useEffect, useRef } from 'react';
import { CanvasElement, CustomizationTemplate } from '../types';
import { CustomizationCanvasRenderer } from '../utils/canvasRenderer';

interface CustomizationPreviewProps {
    template: CustomizationTemplate | null;
    elements: CanvasElement[];
    className?: string;
}

export const CustomizationPreview: React.FC<CustomizationPreviewProps> = ({
    template,
    elements,
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<CustomizationCanvasRenderer | null>(null);

    useEffect(() => {
        if (!template || !containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Initialize renderer
        rendererRef.current = new CustomizationCanvasRenderer(
            template.canvas_width,
            template.canvas_height
        );

        // Generate SVG
        const svgHtml = rendererRef.current.renderSVG(elements);
        containerRef.current.innerHTML = svgHtml;

        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [template, elements]);

    if (!template) {
        return <div className={`${className} flex items-center justify-center bg-gray-100 rounded`}>No template selected</div>;
    }

    return (
        <div
            ref={containerRef}
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
            style={{
                width: `${template.canvas_width}px`,
                maxWidth: '100%',
                aspectRatio: `${template.canvas_width} / ${template.canvas_height}`,
            }}
        />
    );
};


