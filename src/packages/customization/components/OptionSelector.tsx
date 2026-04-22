'use client';

import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { CustomizationOption } from '../types';
import { ColorSwatch } from './ColorSwatch';
import clsx from 'clsx';

interface OptionSelectorProps {
    option: CustomizationOption;
    onSelectValue: (valueId: string) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
    option,
    onSelectValue,
}) => {
    const [textValue, setTextValue] = useState(option.selectedValue?.value || '');

    // Update text value when option selectedValue changes from external source (not this component)
    useEffect(() => {
        const optionValue = option.selectedValue?.value || '';
        console.log('[OptionSelector] useEffect - option changed:', {
            optionId: option.id,
            optionSelectedValue: optionValue,
            currentTextValue: textValue,
            willUpdate: optionValue !== textValue,
        });
        // Only sync if value from option differs from local state
        // This allows local state to keep user input while updating when parent changes the value
        if (optionValue !== textValue) {
            console.log('[OptionSelector] Syncing local state to option value:', optionValue);
            setTextValue(optionValue);
        }
    }, [option.selectedValue?.value]);
    if (!option.isShow) return null;

    const selectedValueId = option.selectedValue?.id;

    switch (option.type) {
        case 'swatch':
            // 颜色色板
            return (
                <div className="mb-4">
                    <label className="font-bold underline text-sm mb-2 block">
                        {option.label}
                        {option.description && <span className="font-normal text-xs ml-1">({option.description})</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                            <ColorSwatch
                                key={value.id}
                                value={value}
                                isSelected={selectedValueId === value.id}
                                onClick={() => {
                                    onSelectValue(value.id);
                                }}
                            />
                        ))}
                    </div>
                </div>
            );

        case 'dropdown':
            return (
                <div className="mb-4">
                    <label className="font-bold underline text-sm mb-2 block">{option.label}</label>
                    <Select value={selectedValueId || ''} onValueChange={onSelectValue}>
                        <SelectTrigger className="w-full h-10 text-sm border-gray-300 rounded-lg bg-white">
                            <SelectValue placeholder={`Choose ${option.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {option.values.map((value) => (
                                <SelectItem key={value.id} value={value.id} className="text-sm">
                                    {value.name}
                                    {value.extra_price ? ` (+$${value.extra_price.toFixed(2)})` : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'button-group':
            return (
                <div className="mb-4">
                    <label className="font-bold underline text-sm mb-2 block">{option.label}</label>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                            <button
                                key={value.id}
                                onClick={() => {
                                    onSelectValue(value.id);
                                }}
                                className={clsx(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                                    selectedValueId === value.id
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                                )}
                            >
                                {value.name}
                            </button>
                        ))}
                    </div>
                </div>
            );

        case 'text-input': {
            const maxLength = 15;
            const charCount = textValue.length;
            return (
                <div className="mb-4">
                    <label className="font-bold text-sm mb-2 block">
                        {option.label}: ({charCount}/{maxLength})
                    </label>
                    <input
                        type="text"
                        placeholder="Enter text"
                        value={textValue}
                        maxLength={maxLength}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                            const newValue = e.target.value;
                            console.log('[OptionSelector] Text input change:', { optionId: option.id, newValue });
                            setTextValue(newValue);
                            // Send update immediately on change for real-time preview
                            onSelectValue(newValue);
                        }}
                        onBlur={(e) => {
                            // Fallback in case onChange didn't trigger
                            console.log('[OptionSelector] Text input blur:', { optionId: option.id, value: e.target.value });
                            onSelectValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                console.log('[OptionSelector] Text input enter:', { optionId: option.id, value: e.currentTarget.value });
                                onSelectValue(e.currentTarget.value);
                            }
                        }}
                        autoComplete="off"
                    />
                </div>
            );
        }

        default:
            return null;
    }
};


