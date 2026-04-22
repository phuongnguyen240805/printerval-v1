'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  CustomizationState,
  CustomizationProduct,
  CustomizationTemplate,
  CustomizationOption,
  CanvasElement,
  CustomDesign,
} from '../types';
import {
  isShowOption,
  changeOptionValue as applyChangeOption,
  updateVisibleElements,
} from '../utils/customizationLogic';

interface CustomizationStore extends CustomizationState {
  // Init
  initialize: (product: CustomizationProduct, template?: CustomizationTemplate) => void;
  
  // Option management
  selectOptionValue: (optionId: string, valueId: string) => void;
  changeOptionValue: (optionId: string, valueId: string) => void;
  updateTextOption: (optionId: string, text: string) => void;
  
  // Template & Canvas
  loadTemplate: (templateId: string) => void;
  updateElement: (elementId: string, config: Partial<CanvasElement['config']>) => void;
  toggleElementVisibility: (elementId: string) => void;
  
  // Preview
  updatePreview: () => void;
  
  // Add to cart
  applyPersonal: () => CustomDesign;
  
  // Canvas
  selectElement: (elementId: string | null) => void;
  
  // Utils
  reset: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const initialState: CustomizationState = {
  product: null,
  template: null,
  options: [],
  customDesign: null,
  elements: [],
  selectedElement: null,
  isLoading: false,
  error: null,
};

export const useCustomizationStore = create<CustomizationStore>()(
  devtools((set, get) => ({
    ...initialState,

    // ==================== Initialize ====================
    initialize: (product, template) => {
      console.log('[Initialize] Starting with product.options:', product.options.map(o => ({ id: o.id, hasFunctionItems: !!o.function_items, functionItems: o.function_items })));
      
      // Initialize options with default values
      const initializedOptions = product.options.map((opt) => {
        let selectedValue = opt.selectedValue || null;
        
        // Tìm default value từ product.default_values hoặc lấy giá trị đầu tiên
        if (!selectedValue) {
          const defaultValueIdOrText = product.default_values?.[opt.id];
          if (defaultValueIdOrText) {
            // Try to find by ID first, then by value field
            selectedValue = opt.values.find(v => v.id === defaultValueIdOrText) || 
                           opt.values.find(v => v.value === defaultValueIdOrText) || 
                           opt.values[0];
          } else {
            selectedValue = opt.values[0];
          }
        }
        
        return {
          ...opt,
          selectedValue,
          isShow: true, // Sẽ tính lại ở dưới
        };
      });

      // Recalculate visibility dựa trên initial selections
      const optionsWithVisibility = initializedOptions.map((opt) => ({
        ...opt,
        isShow: isShowOption(opt, initializedOptions),
      }));

      // Initialize elements from template and apply visibility rules
      const initialElements = (template?.elements || []).map((el) => ({
        ...el,
        config: { ...el.config },
      }));
      
      // Apply visibility rules based on initial options
      updateVisibleElements(initialElements, optionsWithVisibility);

      // Apply function_items (text, color, images, etc.) to elements
      optionsWithVisibility.forEach((option) => {
        if (option.selectedValue && option.function_items) {
          applyChangeOption(option, option.selectedValue, optionsWithVisibility, initialElements, template);
        }
      });

      set((state) => ({
        ...state,
        product: product,
        template: template || product.template,
        options: optionsWithVisibility,
        elements: initialElements,
        customDesign: {
          product_id: product.id,
          template_id: template?.id || product.template_id,
          options_selected: product.default_values || {},
          configurations: {},
        },
      }));
    },

    // ==================== Option Management ====================
    selectOptionValue: (optionId, valueId) => {
      set((state) => {
        const option = state.options.find((o) => o.id === optionId);
        if (!option) return state;

        const value = option.values.find((v) => v.id === valueId);
        if (!value) return state;

        const updatedOptions = state.options.map((opt) =>
          opt.id === optionId ? { ...opt, selectedValue: value } : opt
        );

        const updatedDesign = state.customDesign
          ? {
              ...state.customDesign,
              options_selected: {
                ...state.customDesign.options_selected,
                [optionId]: valueId,
              },
            }
          : null;

        return {
          ...state,
          options: updatedOptions,
          customDesign: updatedDesign,
        };
      });
    },

    changeOptionValue: (optionId, valueId) => {
      set((state) => {
        const option = state.options.find((o) => o.id === optionId);
        if (!option) return state;

        const value = option.values.find((v) => v.id === valueId);
        if (!value) return state;

        // Apply logic
        applyChangeOption(option, value, state.options, state.elements, state.template);

        // FIRST: Update selected value for the changed option
        const optionsWithNewValue = state.options.map((opt) =>
          opt.id === optionId ? { ...opt, selectedValue: value } : opt
        );

        // THEN: Recalculate visibility based on UPDATED selections
        const updatedOptions = optionsWithNewValue.map((opt) => ({
          ...opt,
          isShow: isShowOption(opt, optionsWithNewValue),
        }));

        // Create a copy of elements with updated visibility
        const updatedElements = state.elements.map((el) => ({
          ...el,
          config: { ...el.config },
        }));

        updateVisibleElements(updatedElements, updatedOptions);

        const updatedDesign = state.customDesign
          ? {
              ...state.customDesign,
              options_selected: {
                ...state.customDesign.options_selected,
                [optionId]: valueId,
              },
            }
          : null;

        return {
          ...state,
          options: updatedOptions,
          elements: updatedElements,
          customDesign: updatedDesign,
        };
      });
    },

    updateTextOption: (optionId, text) => {
      set((state) => {
        console.log('[updateTextOption] CALLED with:', { optionId, text, elementsBefore: state.elements.map(e => ({ id: e.element_id, text: e.config?.text })) });
        
        // Update the option's selectedValue with complete new object
        const updatedOptions = state.options.map((opt) =>
          opt.id === optionId
            ? { 
                ...opt, 
                selectedValue: {
                  id: opt.selectedValue?.id || 'text-value',
                  value: text,
                  name: opt.selectedValue?.name,
                  color: opt.selectedValue?.color,
                  image_url: opt.selectedValue?.image_url,
                  template_id: opt.selectedValue?.template_id,
                  extra_price: opt.selectedValue?.extra_price,
                }
              }
            : opt
        );

        const customTextOption = updatedOptions.find(o => o.id === optionId);
        console.log('[updateTextOption] Updated option selectedValue:', customTextOption?.selectedValue);

        const updatedDesign = state.customDesign
          ? {
              ...state.customDesign,
              configurations: {
                ...state.customDesign.configurations,
                [optionId]: text,
              },
            }
          : null;

        // Deep copy elements and update text for matching elements
        const updatedElements = state.elements.map((el) => ({
          ...el,
          config: { ...el.config },
        }));

        // Apply function_items from the option to update elements
        if (customTextOption && customTextOption.selectedValue) {
          console.log('[updateTextOption] Calling applyChangeOption with:', { optionId, value: customTextOption.selectedValue });
          applyChangeOption(customTextOption, customTextOption.selectedValue, updatedOptions, updatedElements, state.template);
        }

        // Log after applyChangeOption
        console.log('[updateTextOption] Elements after applyChangeOption:', updatedElements.map(e => ({ id: e.element_id, text: e.config?.text, visible: e.isVisible })));

        // Update visibility for elements based on options
        updateVisibleElements(updatedElements, updatedOptions);

        const finalState = {
          ...state,
          options: updatedOptions,
          customDesign: updatedDesign,
          elements: updatedElements,
        };
        
        console.log('[updateTextOption] FINAL STATE elements:', finalState.elements.map(e => ({ id: e.element_id, type: e.type, text: e.config?.text, visible: e.isVisible })));

        return finalState;
      });
    },

    // ==================== Template & Canvas ====================
    loadTemplate: (templateId) => {
      // TODO: Call API to fetch template
      // set((state) => {
      //   state.template = newTemplate;
      //   state.elements = newTemplate.elements;
      // });
    },

    updateElement: (elementId, config) => {
      set((state) => {
        const updatedElements = state.elements.map((el) =>
          el.element_id === elementId
            ? {
                ...el,
                config: { ...el.config, ...config },
              }
            : el
        );

        return {
          ...state,
          elements: updatedElements,
        };
      });
    },

    toggleElementVisibility: (elementId) => {
      set((state) => {
        const updatedElements = state.elements.map((el) =>
          el.element_id === elementId
            ? { ...el, isVisible: !el.isVisible }
            : el
        );

        return {
          ...state,
          elements: updatedElements,
        };
      });
    },

    // ==================== Preview ====================
    updatePreview: () => {
      // TODO: Generate preview image from canvas
      return;
    },

    // ==================== Add to Cart ====================
    applyPersonal: () => {
      const state = get();
      if (!state.customDesign) {
        throw new Error('No customization design found');
      }

      const finalConfig: CustomDesign = {
        ...state.customDesign,
        preview_image_url: state.customDesign.preview_image_url,
        configurations: {
          ...state.customDesign.configurations,
          selections: state.options.reduce((acc, opt) => {
            if (opt.selectedValue) {
              acc[opt.label] = (opt.selectedValue.name ?? opt.selectedValue.value) as string;
            }
            return acc;
          }, {} as Record<string, string>),
        },
      };

      return finalConfig;
    },

    // ==================== Canvas Selection ====================
    selectElement: (elementId) => {
      set((state) => {
        if (!elementId) {
          return { ...state, selectedElement: null };
        }
        const element = state.elements.find((el) => el.element_id === elementId);
        if (element) {
          return { ...state, selectedElement: element };
        }
        return state;
      });
    },

    // ==================== Utils ====================
    reset: () => {
      set(initialState);
    },

    setError: (error) => {
      set((state) => ({
        ...state,
        error: error,
      }));
    },

    setLoading: (loading) => {
      set((state) => ({
        ...state,
        isLoading: loading,
      }));
    },
  }))
);


