export type OptionType = 'swatch' | 'dropdown' | 'text-input' | 'image-upload' | 'button-group';

export interface OptionValue {
  id: string;
  name?: string; // Optional - not needed for text-input values
  value: string;
  color?: string; // Hex color for swatch
  image_url?: string;
  template_id?: string; // For change-template function items
  extra_price?: number;
}

export interface Condition {
  option_id: string;
  value_id: string;
  action: 'show' | 'hide';
  combination_operator?: 'and' | 'or';
}

export interface FunctionItem {
  type: 'text' | 'color' | 'dynamic-image' | 'change-template' | 'visibility' | 'price-adjustment';
  element_id?: string; // Canvas element ID to modify
  group_uuid?: string;
  target_property?: string; // e.g., 'fill', 'opacity', 'tint'
}

export interface CustomizationOption {
  id: string;
  label: string;
  description?: string;
  type: OptionType;
  values: OptionValue[];
  function_items?: FunctionItem[];
  conditions?: Condition[]; // Show/hide rules
  required?: boolean;
  order: number;
  isShow?: boolean;
  selectedValue?: OptionValue | null;
}

export interface CanvasElement {
  element_id: string;
  type: 'text' | 'shape' | 'image' | 'svg' | 'group';
  name: string;
  isVisible: boolean;
  isLocked?: boolean;
  zIndex: number;
  config: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    opacity?: number;
    rotation?: number;
    src?: string; // For images
    text?: string; // For text
    fontSize?: number;
    fontFamily?: string;
    svgPath?: string;
    linkedOptionId?: string;
    [key: string]: any;
  };
}

export interface CustomizationTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  canvas_width: number;
  canvas_height: number;
  elements: CanvasElement[];
  preview_image_url?: string;
}

export interface CustomizationProduct {
  id: string;
  name: string;
  template_id: string;
  template?: CustomizationTemplate;
  options: CustomizationOption[];
  default_values?: Record<string, string>; // option_id -> value_id
}

export interface CustomDesign {
  product_id: string;
  template_id: string;
  options_selected: Record<string, string>; // option_id -> value_id
  configurations?: Record<string, any>; // Custom data like text content, image uploads
  preview_image_url?: string;
}

export interface CustomizationState {
  product: CustomizationProduct | null;
  template: CustomizationTemplate | null;
  options: CustomizationOption[];
  customDesign: CustomDesign | null;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  isLoading: boolean;
  error: string | null;
}


