'use client';

// Components
export {
  ColorSwatch,
  OptionSelector,
  CustomizationPreview,
  CustomizationController,
} from './components';

// Hooks
export { useCustomization } from './hooks/useCustomization';

// Store
export { useCustomizationStore } from './store/customizationStore';

// Types
export * from './types';

// Utils
export {
  isShowOption,
  changeOptionValue,
  updateVisibleElements,
  buildVariantKey,
  getSelectedConfiguration,
} from './utils/customizationLogic';

export { CustomizationCanvasRenderer } from './utils/canvasRenderer';


