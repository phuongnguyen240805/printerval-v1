'use client';

import React from 'react';
import clsx from 'clsx';
import { OptionValue } from '../types';

interface ColorSwatchProps {
    value: OptionValue;
    isSelected: boolean;
    onClick: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
    value,
    isSelected,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            title={value.name}
            className={clsx(
                'w-10 h-10 rounded-full border-2 transition-all relative flex-shrink-0 cursor-pointer',
                isSelected
                    ? 'border-blue-500 ring-2 ring-offset-2 ring-blue-400'
                    : 'border-gray-300 hover:border-gray-500'
            )}
            style={{
                backgroundColor: value.color || '#cccccc',
            }}
        >
            {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    ✓
                </span>
            )}
        </button>
    );
};


