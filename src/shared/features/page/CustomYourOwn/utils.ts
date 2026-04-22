import fabric from "fabric";

interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && (item.type === "textbox");
    }
  });
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");

  anchorElement.href = file;
  anchorElement.download = `design-${generateUUID()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-text" || type === "textbox";
}

export function rgbaObjectToString(rgba: RGBColor | "transparent") {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

export const createFilter = (value: string) => {
  let effect;

  switch (value) {
    case "greyscale":
      effect = new fabric.filters.Grayscale();
      break;
    case "polaroid":
      // @ts-ignore
      effect = new fabric.filters.Polaroid();
      break;
    case "sepia":
      effect = new fabric.filters.Sepia();
      break;
    case "kodachrome":
      // @ts-ignore
      effect = new fabric.filters.Kodachrome();
      break;
    case "contrast":
      effect = new fabric.filters.Contrast({ contrast: 0.25 });
      break;
    case "brightness":
      effect = new fabric.filters.Brightness({ brightness: 0.1 });
      break;
    case "brownie":
      // @ts-ignore
      effect = new fabric.filters.Brownie();
      break;
    case "vintage":
      // @ts-ignore
      effect = new fabric.filters.Vintage();
      break;
    case "technicolor":
      // @ts-ignore
      effect = new fabric.filters.Technicolor();
      break;
    case "pixelate":
      effect = new fabric.filters.Pixelate({ blocksize: 5 });
      break;
    case "invert":
      effect = new fabric.filters.Invert();
      break;
    case "blur":
      effect = new fabric.filters.Blur({ blur: 0.3 });
      break;
    case "sharpen":
      // Sharpen not available in fabric v7, using Contrast instead
      effect = new fabric.filters.Contrast({ contrast: 0.5 });
      break;
    case "emboss":
      // Emboss not available in fabric v7, using enhanced Contrast
      effect = new fabric.filters.Contrast({ contrast: 0.75 });
      break;
    case "removecolor":
      effect = new fabric.filters.RemoveColor({ threshold: 0.2 });
      break;
    case "blacknwhite":
      effect = new fabric.filters.BlackWhite();
      break;
    case "vibrance":
      effect = new fabric.filters.Vibrance({ vibrance: 0.75 });
      break;
    case "blendcolor":
      effect = new fabric.filters.BlendColor({ color: "#000000" });
      break;
    case "huerotate":
      effect = new fabric.filters.HueRotation({ rotation: 0.5 });
      break;
    case "saturation":
      effect = new fabric.filters.Saturation({ saturation: 0.5 });
      break;
    case "gamma":
      effect = new fabric.filters.Gamma({ gamma: [1, 1, 1] });
      break;
    default:
      effect = null;
  }

  return effect;
};

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
