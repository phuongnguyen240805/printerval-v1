/**
 * Mock Data for Canva Designer
 * Contains realistic fabric.js canvas data, templates, images, and fonts
 */

// Mock Project with Fabric.js Canvas JSON
export const mockProjectData = {
  id: "project-1",
  name: "My Design",
  width: 800,
  height: 600,
  background: "#ffffff",
  json: JSON.stringify({
    version: "5.3.0",
    objects: [
      {
        type: "text",
        version: "5.3.0",
        originX: "left",
        originY: "top",
        left: 100,
        top: 100,
        width: 400,
        height: 80,
        fill: "#000000",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: "",
        fillRule: "nonzero",
        paintFirst: "fill",
        globalCompositeOperation: "source-over",
        skewX: 0,
        skewY: 0,
        fontFamily: "Arial",
        fontSize: 40,
        fontStyle: "normal",
        fontWeight: "normal",
        lineHeight: 1.16,
        text: "Welcome to Canvas",
        textAlign: "left",
        textBackgroundColor: "",
        textDecoration: "",
        underline: false,
        overline: false,
        linethrough: false,
        deltaY: 0,
      },
      {
        type: "rect",
        version: "5.3.0",
        originX: "center",
        originY: "center",
        left: 400,
        top: 300,
        width: 200,
        height: 150,
        fill: "#ff6b6b",
        stroke: null,
        strokeWidth: 2,
        strokeDashArray: null,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        rx: 0,
        ry: 0,
      },
    ],
    background: "#ffffff",
    width: 800,
    height: 600,
  }),
};

// Mock Templates
export const mockTemplates = [
  {
    id: "template-1",
    name: "Travel Poster",
    thumbnail: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ff6b35' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='24' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white'%3ETravel%3C/text%3E%3C/svg%3E",
    json: JSON.stringify({
      version: "5.3.0",
      objects: [
        {
          type: "text",
          left: 50,
          top: 50,
          fontSize: 60,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ff6b35",
          text: "EXPLORE THE WORLD",
        },
        {
          type: "rect",
          left: 100,
          top: 200,
          width: 600,
          height: 300,
          fill: "#e8f0f8",
          rx: 20,
        },
      ],
      width: 800,
      height: 600,
    }),
  },
  {
    id: "template-2",
    name: "Flash Sale",
    thumbnail: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ff0000' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='32' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white'%3E50%25%3C/text%3E%3C/svg%3E",
    json: JSON.stringify({
      version: "5.3.0",
      objects: [
        {
          type: "text",
          left: 100,
          top: 100,
          fontSize: 80,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ff0000",
          text: "50% OFF",
        },
        {
          type: "rect",
          left: 50,
          top: 50,
          width: 700,
          height: 500,
          fill: "#fff9e6",
          stroke: "#ff0000",
          strokeWidth: 5,
        },
      ],
      width: 800,
      height: 600,
    }),
  },
  {
    id: "template-3",
    name: "Coming Soon",
    thumbnail: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23333333' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='20' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white'%3EComing Soon%3C/text%3E%3C/svg%3E",
    json: JSON.stringify({
      version: "5.3.0",
      objects: [
        {
          type: "text",
          left: 150,
          top: 200,
          fontSize: 50,
          fontFamily: "Georgia",
          fill: "#333333",
          text: "COMING SOON",
        },
        {
          type: "text",
          left: 200,
          top: 300,
          fontSize: 24,
          fontFamily: "Arial",
          fill: "#666666",
          text: "Something amazing is on the way",
        },
      ],
      width: 800,
      height: 600,
    }),
  },
  {
    id: "template-4",
    name: "Product Card",
    thumbnail: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Crect fill='white' x='30' y='30' width='140' height='140' rx='8'/%3E%3Ctext x='50%25' y='50%25' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23333'%3EProduct%3C/text%3E%3C/svg%3E",
    json: JSON.stringify({
      version: "5.3.0",
      objects: [
        {
          type: "rect",
          left: 50,
          top: 50,
          width: 300,
          height: 500,
          fill: "#ffffff",
          stroke: "#cccccc",
          strokeWidth: 2,
          rx: 10,
        },
        {
          type: "text",
          left: 70,
          top: 80,
          fontSize: 28,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#000000",
          text: "Product Name",
        },
        {
          type: "text",
          left: 70,
          top: 450,
          fontSize: 32,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ff6b6b",
          text: "$99.99",
        },
      ],
      width: 800,
      height: 600,
    }),
  },
  {
    id: "template-5",
    name: "Social Media Post",
    thumbnail: "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='18' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white'%3ESocial Post%3C/text%3E%3C/svg%3E",
    json: JSON.stringify({
      version: "5.3.0",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 800,
          height: 600,
          fill: "#667eea",
        },
        {
          type: "text",
          left: 100,
          top: 150,
          fontSize: 50,
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ffffff",
          text: "Share Your Story",
        },
        {
          type: "circle",
          left: 600,
          top: 400,
          radius: 80,
          fill: "#f093fb",
          opacity: 0.8,
        },
      ],
      width: 800,
      height: 600,
    }),
  },
];

// Mock Images (Unsplash API structure)
export const mockImages = [
  {
    id: "img-1",
    alt_description: "Blue color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545886/Blue_wtki1y.png",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545886/Blue_wtki1y.png",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545886/Blue_wtki1y.png",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-2",
    alt_description: "Slate color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Slate_bve1pn.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Slate_bve1pn.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Slate_bve1pn.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-3",
    alt_description: "Purple color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Purple_fqpzt2.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Purple_fqpzt2.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Purple_fqpzt2.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-4",
    alt_description: "White color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/White_evwmzw.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/White_evwmzw.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/White_evwmzw.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-5",
    alt_description: "Red color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Red_xiscrj.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Red_xiscrj.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Red_xiscrj.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-6",
    alt_description: "Pink color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Pink_siatbj.png",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Pink_siatbj.png",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545876/Pink_siatbj.png",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-7",
    alt_description: "Magenta color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Magenta_f5snso.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Magenta_f5snso.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Magenta_f5snso.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-8",
    alt_description: "DarkGray color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/DarkGray_jcbrdv.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/DarkGray_jcbrdv.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/DarkGray_jcbrdv.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-9",
    alt_description: "LightBlue color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/LightBlue_h7umvp.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/LightBlue_h7umvp.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/LightBlue_h7umvp.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
  {
    id: "img-10",
    alt_description: "Charcoal color swatch",
    urls: {
      regular: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Charcoal_xkrj0e.jpg",
      small: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Charcoal_xkrj0e.jpg",
      thumb: "https://res.cloudinary.com/dzkcqktcl/image/upload/v1774545875/Charcoal_xkrj0e.jpg",
    },
    links: {
      html: "https://cloudinary.com",
    },
    user: {
      name: "Color Designer",
    },
  },
];

// Mock Shapes
export const mockShapes = [
  { id: "shape-circle", name: "Circle", type: "circle" },
  { id: "shape-rect", name: "Rectangle", type: "rect" },
  { id: "shape-triangle", name: "Triangle", type: "triangle" },
  { id: "shape-diamond", name: "Diamond", type: "diamond" },
];

// Mock Fonts
export const mockFonts = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Comic Sans MS",
  "Trebuchet MS",
  "Impact",
  "Palatino",
  "Garamond",
];

// Mock Colors
export const mockColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B88B",
  "#ABEBC6",
  "#F5B7B1",
  "#D5F4E6",
];

// Mock Filters
export const mockFilters = [
  { id: "none", name: "None", value: "none" },
  { id: "grayscale", name: "Grayscale", value: "greyscale" },
  { id: "sepia", name: "Sepia", value: "sepia" },
  { id: "blur", name: "Blur", value: "blur" },
  { id: "brightness", name: "Brightness", value: "brightness" },
  { id: "contrast", name: "Contrast", value: "contrast" },
  { id: "invert", name: "Invert", value: "invert" },
  { id: "pixelate", name: "Pixelate", value: "pixelate" },
  { id: "saturation", name: "Saturation", value: "saturation" },
];

// Recent Projects
export const mockRecentProjects = [
  {
    id: "project-1",
    name: "Summer Campaign",
    thumbnail: "https://via.placeholder.com/150?text=Summer",
    updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "project-2",
    name: "Product Launch",
    thumbnail: "https://via.placeholder.com/150?text=Launch",
    updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "project-3",
    name: "Holiday Special",
    thumbnail: "https://via.placeholder.com/150?text=Holiday",
    updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Export all mock data as a single object for easy import
export const mockCanvaData = {
  project: mockProjectData,
  templates: mockTemplates,
  images: mockImages,
  shapes: mockShapes,
  fonts: mockFonts,
  colors: mockColors,
  filters: mockFilters,
  recentProjects: mockRecentProjects,
};
