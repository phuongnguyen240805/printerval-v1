'use client';

import { CustomizationProduct, CustomizationTemplate, CanvasElement } from './types';

// ==================== Mock Template ====================
export const mockCoupleTemplate: CustomizationTemplate = {
  id: 'couple-template-1',
  name: 'Annoying Couple Mug',
  description: 'Customize couple portrait with different skin colors, hair styles, and accessories',
  canvas_width: 800,
  canvas_height: 600,
  elements: [
    // Background
    {
      element_id: 'bg-shape',
      type: 'shape',
      name: 'Background',
      isVisible: true,
      zIndex: 1,
      config: {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        fill: '#ffffff',
      },
    },
    // Man's body
    {
      element_id: 'man-body',
      type: 'shape',
      name: 'Man Body',
      isVisible: true,
      zIndex: 10,
      config: {
        x: 150,
        y: 300,
        width: 120,
        height: 150,
        fill: '#d4a574',
      },
    },
    // Man's head (skin color will change based on selection)
    {
      element_id: 'man-head',
      type: 'shape',
      name: 'Man Head',
      isVisible: true,
      zIndex: 15,
      config: {
        x: 170,
        y: 200,
        width: 80,
        height: 90,
        fill: '#d4a574', // Default light skin
        linkedOptionId: 'man-skin-color',
      },
    },
    // Man's hair (image or SVG)
    {
      element_id: 'man-hair',
      type: 'image',
      name: 'Man Hair',
      isVisible: true,
      zIndex: 20,
      config: {
        x: 160,
        y: 180,
        width: 100,
        height: 70,
        src: '/assets/hair-style-1.png', // Default hair
        linkedOptionId: 'man-hair-style',
      },
    },
    // Man's glasses
    {
      element_id: 'man-glasses',
      type: 'image',
      name: 'Man Glasses',
      isVisible: false,
      zIndex: 25,
      config: {
        x: 170,
        y: 220,
        width: 80,
        height: 25,
        src: '/assets/glasses-sunglasses.png',
        linkedOptionId: 'man-glasses',
      },
    },
    // Woman's body
    {
      element_id: 'woman-body',
      type: 'shape',
      name: 'Woman Body',
      isVisible: true,
      zIndex: 10,
      config: {
        x: 530,
        y: 300,
        width: 120,
        height: 150,
        fill: '#d4a574',
      },
    },
    // Woman's head (skin color)
    {
      element_id: 'woman-head',
      type: 'shape',
      name: 'Woman Head',
      isVisible: true,
      zIndex: 15,
      config: {
        x: 550,
        y: 200,
        width: 80,
        height: 90,
        fill: '#d4a574', // Default
        linkedOptionId: 'woman-skin-color',
      },
    },
    // Woman hair
    {
      element_id: 'woman-hair',
      type: 'image',
      name: 'Woman Hair',
      isVisible: true,
      zIndex: 20,
      config: {
        x: 540,
        y: 180,
        width: 100,
        height: 70,
        src: '/assets/hair-style-woman-1.png',
        linkedOptionId: 'woman-hair-style',
      },
    },
    // Text: "ANNOYING EACH OTHER"
    // Removed - user wanted to remove static text

    // Text: "AND STILL GOING STRONG"
    // Removed - user wanted to remove static text

    // Custom user text
    {
      element_id: 'custom-text-element',
      type: 'text',
      name: 'Custom User Text',
      isVisible: true,
      zIndex: 30,
      config: {
        x: 300,
        y: 480,
        width: 200,
        height: 30,
        text: 'Your text',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#ff6b9d',
      },
    },
  ],
};

// ==================== Mock Product ====================
export const mockCustomizationProduct: CustomizationProduct = {
  id: 'couple-mug-001',
  name: 'Couple Annoying Mug',
  template_id: 'couple-template-1',
  template: mockCoupleTemplate,
  options: [
    // ===== MAN OPTIONS =====
    {
      id: 'man-skin-color',
      label: 'Man Skin Color',
      type: 'swatch',
      order: 1,
      isShow: true,
      values: [
        {
          id: 'skin-light',
          name: 'Light',
          value: 'light',
          color: '#fdbcb4',
        },
        {
          id: 'skin-medium',
          name: 'Medium',
          value: 'medium',
          color: '#d4a574',
        },
        {
          id: 'skin-tan',
          name: 'Tan',
          value: 'tan',
          color: '#a67c52',
        },
        {
          id: 'skin-dark',
          name: 'Dark',
          value: 'dark',
          color: '#6d4c41',
        },
      ],
      function_items: [
        {
          type: 'color',
          element_id: 'man-head',
        },
        {
          type: 'color',
          element_id: 'man-body',
        },
      ],
    },
    {
      id: 'man-hair-style',
      label: 'Man Hair Style',
      type: 'button-group',
      order: 2,
      isShow: true,
      values: [
        {
          id: 'hair-bald',
          name: 'Bald',
          value: 'bald',
          image_url: '/assets/hair-bald.png',
        },
        {
          id: 'hair-short',
          name: 'Short',
          value: 'short',
          image_url: '/assets/hair-style-1.png',
        },
        {
          id: 'hair-medium',
          name: 'Medium',
          value: 'medium',
          image_url: '/assets/hair-style-2.png',
        },
        {
          id: 'hair-long',
          name: 'Long',
          value: 'long',
          image_url: '/assets/hair-style-3.png',
        },
      ],
      function_items: [
        {
          type: 'dynamic-image',
          element_id: 'man-hair',
        },
      ],
    },
    {
      id: 'man-hair-color',
      label: 'Man Hair Color',
      type: 'swatch',
      order: 3,
      isShow: true,
      values: [
        {
          id: 'hair-black',
          name: 'Black',
          value: 'black',
          color: '#000000',
        },
        {
          id: 'hair-brown',
          name: 'Brown',
          value: 'brown',
          color: '#6d4c41',
        },
        {
          id: 'hair-blonde',
          name: 'Blonde',
          value: 'blonde',
          color: '#d4a574',
        },
        {
          id: 'hair-red',
          name: 'Red',
          value: 'red',
          color: '#c85a54',
        },
      ],
    },
    {
      id: 'man-glasses',
      label: 'Man Glasses',
      type: 'button-group',
      order: 4,
      isShow: true,
      values: [
        {
          id: 'glasses-none',
          name: 'No Glasses',
          value: 'none',
        },
        {
          id: 'glasses-normal',
          name: 'Normal',
          value: 'normal',
          image_url: '/assets/glasses-normal.png',
        },
        {
          id: 'glasses-sunglasses',
          name: 'Sunglasses',
          value: 'sunglasses',
          image_url: '/assets/glasses-sunglasses.png',
        },
      ],
      function_items: [
        {
          type: 'visibility',
          element_id: 'man-glasses',
        },
      ],
    },
    // ===== WOMAN OPTIONS =====
    {
      id: 'woman-skin-color',
      label: 'Woman Skin Color',
      type: 'swatch',
      order: 5,
      isShow: true,
      values: [
        {
          id: 'wskin-light',
          name: 'Light',
          value: 'light',
          color: '#fdbcb4',
        },
        {
          id: 'wskin-medium',
          name: 'Medium',
          value: 'medium',
          color: '#d4a574',
        },
        {
          id: 'wskin-tan',
          name: 'Tan',
          value: 'tan',
          color: '#a67c52',
        },
        {
          id: 'wskin-dark',
          name: 'Dark',
          value: 'dark',
          color: '#6d4c41',
        },
      ],
      function_items: [
        {
          type: 'color',
          element_id: 'woman-head',
        },
        {
          type: 'color',
          element_id: 'woman-body',
        },
      ],
    },
    {
      id: 'woman-hair-style',
      label: 'Woman Hair Style',
      type: 'button-group',
      order: 6,
      isShow: true,
      values: [
        {
          id: 'whair-short',
          name: 'Short',
          value: 'short',
          image_url: '/assets/hair-style-woman-1.png',
        },
        {
          id: 'whair-medium',
          name: 'Medium',
          value: 'medium',
          image_url: '/assets/hair-style-woman-2.png',
        },
        {
          id: 'whair-long',
          name: 'Long',
          value: 'long',
          image_url: '/assets/hair-style-woman-3.png',
        },
      ],
      function_items: [
        {
          type: 'dynamic-image',
          element_id: 'woman-hair',
        },
      ],
    },
    {
      id: 'custom-text',
      label: 'Your Text Here',
      type: 'text-input',
      order: 7,
      isShow: true,
      values: [
        {
          id: 'text-value',
          name: 'Custom Text',
          value: 'Your text',
        },
      ],
      function_items: [
        {
          type: 'text',
          element_id: 'custom-text-element',
        },
      ],
    },
  ],
  default_values: {
    'man-skin-color': 'skin-medium',
    'man-hair-style': 'hair-short',
    'man-hair-color': 'hair-black',
    'man-glasses': 'glasses-none',
    'woman-skin-color': 'wskin-medium',
    'woman-hair-style': 'whair-medium',
    'custom-text': 'Your text',
  },
};


