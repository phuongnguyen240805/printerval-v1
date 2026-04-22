'use client';

import { useMemo } from 'react';
import { useCustomizationStore } from '../store/customizationStore';
import { CustomizationProduct, CustomizationTemplate, CustomDesign } from '../types';

export function useCustomization() {
  // Use individual selectors to subscribe only to specific state slices
  const product = useCustomizationStore((state) => state.product);
  const template = useCustomizationStore((state) => state.template);
  const allOptions = useCustomizationStore((state) => state.options);
  const customDesign = useCustomizationStore((state) => state.customDesign);
  const elements = useCustomizationStore((state) => state.elements);
  const selectedElement = useCustomizationStore((state) => state.selectedElement);
  const isLoading = useCustomizationStore((state) => state.isLoading);
  const error = useCustomizationStore((state) => state.error);
  
  // Get methods once
  const initialize = useCustomizationStore((state) => state.initialize);
  const selectOptionValue = useCustomizationStore((state) => state.selectOptionValue);
  const changeOptionValue = useCustomizationStore((state) => state.changeOptionValue);
  const updateTextOption = useCustomizationStore((state) => state.updateTextOption);
  const applyPersonal = useCustomizationStore((state) => state.applyPersonal);
  const reset = useCustomizationStore((state) => state.reset);

  // Memoize filtered options to avoid creating new array on every render
  const options = useMemo(
    () => allOptions.filter((opt) => opt.isShow !== false),
    [allOptions]
  );

  return {
    // State
    product,
    template,
    options,
    customDesign,
    elements,
    selectedElement,
    isLoading,
    error,

    // Methods
    initialize: (product: CustomizationProduct, template?: CustomizationTemplate) => {
      initialize(product, template);
    },

    selectOption: (optionId: string, valueId: string) => {
      selectOptionValue(optionId, valueId);
    },

    changeOption: (optionId: string, valueId: string) => {
      changeOptionValue(optionId, valueId);
    },

    updateText: (optionId: string, text: string) => {
      updateTextOption(optionId, text);
    },

    applyPersonal: (): CustomDesign => {
      return applyPersonal();
    },

    reset: () => {
      reset();
    },
  };
}

