# Customization System Documentation

## 📋 Overview

Một hệ thống customization hoàn chỉnh cho phép người dùng tùy chỉnh sản phẩm với các options như:
- Màu da (Skin Color)
- Kiểu tóc (Hair Style)
- Màu tóc (Hair Color)
- Kính mắt (Glasses)
- Các accessories khác

System này tự động cập nhật preview canvas khi user thay đổi options.

## 🎯 Architecture

```
customization/
├── types/              # TypeScript interfaces
├── store/              # Zustand state management
├── hooks/              # React hooks
├── utils/              # Logic utilities & canvas renderer
├── components/         # React components
├── mockData.ts        # Mock data for testing
└── index.ts           # Main export
```

## 🚀 Quick Start

### 1. Import Components

```typescript
import {
  CustomizationController,
  useCustomization,
  mockCustomizationProduct,
} from '@/packages/customization';
```

### 2. Use in Your Component

```typescript
import React, { useState } from 'react';
import { CustomizationController, mockCustomizationProduct } from '@/packages/customization';
import { Dialog, DialogContent } from '@/shared/ui/dialog';

export default function ProductDetail() {
  const [showCustomization, setShowCustomization] = useState(false);

  const handleCustomizationApply = (design: any) => {
    console.log('Custom design:', design);
    // Add to cart with customization data
    setShowCustomization(false);
  };

  return (
    <>
      <button onClick={() => setShowCustomization(true)}>
        Customize This Product
      </button>

      <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
        <DialogContent className="max-w-4xl">
          <CustomizationController
            product={mockCustomizationProduct}
            onApply={handleCustomizationApply}
            onClose={() => setShowCustomization(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## 📦 Core Features

### 1. **Dynamic Preview**
- Real-time SVG rendering when options change
- Support for shapes, images, text elements
- zIndex-based layering

### 2. **Conditional Options**
- Show/hide options based on other selections
- AND/OR logic support
- Automatic rebuild of option visibility

### 3. **Function Items**
Các loại thay đổi khi user chọn option:
- `color` - Thay đổi màu sắc element
- `dynamic-image` - Thay đổi hình ảnh (e.g., hairstyle)
- `text` - Thay đổi text nội dung
- `visibility` - Ẩn/hiển thị element
- `change-template` - Tải template khác

### 4. **Option Types**
```typescript
- 'swatch'       // Màu sắc (color circles)
- 'dropdown'     // Dropdown list
- 'button-group' // Button selections
- 'text-input'   // Text input
- 'image-upload' // Image upload (TODO)
```

## 🎨 Canvas Elements

Mỗi element có thể có type:
- `shape` - Rectangle, circle, etc.
- `image` - Image elements
- `text` - Text elements
- `svg` - SVG paths
- `group` - Group of elements

**Config properties:**
```typescript
{
  x: number;           // X position
  y: number;           // Y position
  width: number;       // Width
  height: number;      // Height
  fill?: string;       // Color
  stroke?: string;     // Border
  opacity?: number;    // Transparency
  rotation?: number;   // Rotation angle
  src?: string;        // Image source
  text?: string;       // Text content
  fontSize?: number;   // Font size
  fontFamily?: string; // Font family
  linkedOptionId?: string; // Link to option
}
```

## 🔄 State Management

Using **Zustand** for state:

```typescript
import { useCustomizationStore } from '@/packages/customization';

// Direct store access
const store = useCustomizationStore();
store.changeOptionValue('man-skin-color', 'skin-dark');

// Or use hook
const { changeOption, elements, applyPersonal } = useCustomization();
changeOption('man-hair-style', 'hair-long');
const design = applyPersonal(); // Get final configuration
```

## 📊 Store Actions

```typescript
// Initialize
store.initialize(product, template);

// Select/Change options
store.selectOptionValue(optionId, valueId);
store.changeOptionValue(optionId, valueId);  // Triggers canvas update

// Update text
store.updateTextOption(optionId, text);

// Canvas operations
store.updateElement(elementId, config);
store.toggleElementVisibility(elementId);

// Apply
const design = store.applyPersonal(); // Returns CustomDesign object

// Utils
store.reset();
store.setError(error);
store.setLoading(loading);
```

## 🎯 Canvas Renderer

```typescript
import { CustomizationCanvasRenderer } from '@/packages/customization';

const renderer = new CustomizationCanvasRenderer(800, 600);

// Render as SVG
const svgHtml = renderer.renderSVG(elements);

// Render as Canvas (async)
const dataUrl = await renderer.renderCanvas(elements, container);

// Generate preview image
const imageUrl = await renderer.generatePreviewImage(elements);

// Cleanup
renderer.dispose();
```

## 📝 Creating Custom Products

### Step 1: Define Template

```typescript
const myTemplate: CustomizationTemplate = {
  id: 'my-template',
  name: 'My Product',
  canvas_width: 800,
  canvas_height: 600,
  elements: [
    // Define your elements here
    {
      element_id: 'background',
      type: 'shape',
      name: 'Background',
      isVisible: true,
      zIndex: 1,
      config: {
        x: 0, y: 0, width: 800, height: 600,
        fill: '#ffffff',
      },
    },
    // ... more elements
  ],
};
```

### Step 2: Define Options

```typescript
const myOptions: CustomizationOption[] = [
  {
    id: 'color-option',
    label: 'Choose Color',
    type: 'swatch',
    order: 1,
    isShow: true,
    values: [
      { id: 'red', name: 'Red', value: 'red', color: '#ff0000' },
      { id: 'blue', name: 'Blue', value: 'blue', color: '#0000ff' },
    ],
    function_items: [
      {
        type: 'color',
        element_id: 'background',
      },
    ],
  },
  // ... more options
];
```

### Step 3: Create Product

```typescript
const myProduct: CustomizationProduct = {
  id: 'my-product',
  name: 'My Custom Product',
  template_id: 'my-template',
  template: myTemplate,
  options: myOptions,
  default_values: {
    'color-option': 'red',
  },
};
```

## 🔌 Integration with Detail.tsx

Example integration:

```typescript
import { CustomizationController } from '@/packages/customization';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

// In Detail component
const [showCustomization, setShowCustomization] = useState(false);
const [customDesign, setCustomDesign] = useState(null);

const handleApplyCustomization = (design) => {
  setCustomDesign(design);
  setShowCustomization(false);
  // Then add to cart with customDesign data
};

return (
  <>
    {/* ... existing code ... */}
    
    <Button onClick={() => setShowCustomization(true)}>
      Customize This Design
    </Button>

    <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Customize Your Product</DialogTitle>
        </DialogHeader>
        <CustomizationController
          product={customizationProduct}
          onApply={handleApplyCustomization}
          onClose={() => setShowCustomization(false)}
        />
      </DialogContent>
    </Dialog>
  </>
);
```

## 🧪 Testing with Mock Data

```typescript
import { mockCustomizationProduct } from '@/packages/customization/mockData';

// Use mock data directly
<CustomizationController
  product={mockCustomizationProduct}
  onApply={handleApply}
/>
```

## 🎨 Styling

All components use Tailwind + Radix UI. Customize by modifying:
- `components/ColorSwatch.tsx`
- `components/OptionSelector.tsx`
- `components/CustomizationController.tsx`

## 🐛 Debugging

```typescript
// Enable Zustand DevTools
import { useCustomizationStore } from '@/packages/customization';

// Open Redux DevTools to inspect state changes
const store = useCustomizationStore();
console.log('Current design:', store.customDesign);
console.log('Elements:', store.elements);
console.log('Visible options:', store.options.filter(o => o.isShow));
```

## 📱 Responsive Design

- Mobile: Single column layout
- Desktop (md): Two column layout (preview left, options right)
- Preview scales to container width

## 🚀 Performance Tips

1. **Memoize options** - Use `useMemo` for filtered visible options
2. **Lazy load images** - Load hairstyle images on demand
3. **Canvas optimization** - Use SVG for vector graphics
4. **Debounce updates** - Debounce canvas re-renders if needed

## 📚 File Structure

```
src/packages/customization/
├── types/
│   └── index.ts              # All TypeScript interfaces
├── store/
│   └── customizationStore.ts # Zustand store
├── hooks/
│   └── useCustomization.ts   # React hooks
├── utils/
│   ├── customizationLogic.ts # Core logic
│   └── canvasRenderer.ts     # SVG/Canvas rendering
├── components/
│   ├── ColorSwatch.tsx
│   ├── OptionSelector.tsx
│   ├── CustomizationPreview.tsx
│   ├── CustomizationController.tsx
│   └── index.ts
├── mockData.ts               # Test data
└── index.ts                  # Main export
```

## 🔔 Next Steps

1. Create template for your product
2. Define customization options
3. Create mock images for hairstyles/accessories
4. Integrate with add-to-cart logic
5. Add backend API calls for template/product data
6. Implement image upload if needed
7. Add analytics tracking

---

**Version:** 1.0.0  
**Last Updated:** 2024
