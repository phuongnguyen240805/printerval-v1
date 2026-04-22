'use client';

import { CanvasElement, CustomizationTemplate } from '../types';

export class CustomizationCanvasRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private svgContainer: SVGSVGElement | null = null;

  constructor(
    private width: number = 800,
    private height: number = 600
  ) {}
renderSVG(elements: CanvasElement[]): string {
  let svg = `<svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 ${this.width} ${this.height}" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    style="background: transparent !important; isolation: isolate;"
  >`;

  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  sorted.forEach((element) => {
    if (element.isVisible === false) return;

    const c = element.config || {};

    switch (element.type) {
      case 'shape':
        // Quan trọng: Nếu không có fill thì để transparent, tránh fill trắng mặc định
        const fill = c.fill && c.fill !== '#ffffff' && c.fill !== 'white' 
          ? c.fill 
          : 'transparent';

        svg += `<rect 
          x="${c.x || 0}" 
          y="${c.y || 0}" 
          width="${c.width || 0}" 
          height="${c.height || 0}" 
          fill="${fill}" 
          stroke="${c.stroke || 'none'}" 
          opacity="${c.opacity || 1}" 
        />`;
        break;

      case 'image':
        if (c.src) {
          svg += `<image 
            x="${c.x || 0}" 
            y="${c.y || 0}" 
            width="${c.width || 0}" 
            height="${c.height || 0}" 
            href="${c.src}" 
            opacity="${c.opacity || 1}" 
            preserveAspectRatio="xMidYMid slice" 
          />`;
        }
        break;

      case 'text':
        if (c.text) {
          svg += `<text 
            x="${c.x || 0}" 
            y="${c.y || 0}" 
            font-size="${c.fontSize || 14}" 
            font-family="${c.fontFamily || 'Arial'}" 
            fill="${c.fill || '#000000'}" 
            opacity="${c.opacity || 1}"
            dominant-baseline="hanging" 
            text-anchor="start"
          >
            ${this.escapeHtml(c.text)}
          </text>`;
        }
        break;

      case 'svg':
        if (c.svgPath) {
          svg += `<g transform="translate(${c.x || 0}, ${c.y || 0})" opacity="${c.opacity || 1}">
                    ${c.svgPath}
                  </g>`;
        }
        break;
    }
  });

  svg += '</svg>';
  return svg;
}

  /**
   * 用 Canvas 2D 渲染
   */
  async renderCanvas(elements: CanvasElement[], container: HTMLDivElement): Promise<string> {
    // 创建 canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    if (!this.ctx) throw new Error('Cannot get canvas context');

    // 清白背景
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 按 zIndex 排序
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // 加载所有图片
    const imagePromises = sorted
      .filter((el) => el.type === 'image' && el.config.src)
      .map((el) => this.loadImage(el.config.src));

    await Promise.all(imagePromises);

    // 绘制元素
    sorted.forEach((element) => {
      if (!element.isVisible || !this.ctx) return;

      const { x, y, width, height, fill, opacity } = element.config;

      this.ctx.globalAlpha = opacity || 1;

      switch (element.type) {
        case 'shape':
          this.ctx.fillStyle = fill || '#000';
          this.ctx.fillRect(x, y, width, height);
          break;

        case 'image':
          // Kiểm tra src có hợp lệ và đã load xong chưa
          const imageSrc = element.config.src;
          if (imageSrc && this.canvasImages[imageSrc]) {
            this.ctx.drawImage(this.canvasImages[imageSrc], x, y, width, height);
          }
          break;

        case 'text':
          this.ctx.fillStyle = fill || '#000';
          this.ctx.font = `${element.config.fontSize || 14}px ${element.config.fontFamily || 'Arial'}`;
          this.ctx.fillText(element.config.text || '', x, y);
          break;
      }
    });

    // 生成 dataURL
    const dataUrl = this.canvas.toDataURL('image/png');
    container.appendChild(this.canvas);

    return dataUrl;
  }

  /**
   * 加载图片
   */
  private canvasImages: Record<string, HTMLImageElement> = {};

  private loadImage(src: string | undefined): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Nếu src không hợp lệ, từ chối
      if (!src) {
        reject(new Error('Invalid image source'));
        return;
      }

      // Nếu hình ảnh đã được load trước đó, trả về từ cache
      if (this.canvasImages[src]) {
        resolve(this.canvasImages[src]);
        return;
      }

      // Tải hình ảnh mới
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.canvasImages[src] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 生成预览图片 URL
   */
  async generatePreviewImage(elements: CanvasElement[]): Promise<string> {
    const svg = this.renderSVG(elements);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }

  /**
   * 清理
   */
  dispose(): void {
    if (this.canvas?.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
    this.canvasImages = {};
  }

  /**
   * Escape HTML
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}


