import {
    FaBold,
    FaItalic,
    FaStrikethrough,
    FaUnderline
} from "react-icons/fa";
import {
    ArrowUp,
    ArrowDown,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    Copy,
    Minus,
    Plus,
    ChevronDown,
} from "lucide-react";
import { RxTransparencyGrid } from "react-icons/rx";

import {
    ActiveTool,
    Editor,
} from "../types";

interface ToolbarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const FONT_FAMILIES = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Impact",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
];

// Divider
const Sep = () => <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />;

// Icon button
const TBtn = ({
    onClick,
    active,
    title,
    danger,
    children,
}: {
    onClick?: () => void;
    active?: boolean;
    title?: string;
    danger?: boolean;
    children: React.ReactNode;
}) => (
    <button
        onClick={onClick}
        title={title}
        className={[
            "flex items-center justify-center w-8 h-8 rounded transition-colors shrink-0 text-sm",
            active
                ? "bg-gray-200 text-gray-900"
                : danger
                    ? "hover:bg-red-50 text-red-500"
                    : "hover:bg-gray-100 text-gray-700",
        ].join(" ")}
    >
        {children}
    </button>
);

export const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
    const selectedObject = editor?.selectedObjects?.[0];

    const isText =
        selectedObject?.type === "text" ||
        selectedObject?.type === "i-text" ||
        selectedObject?.type === "textbox";

    const isImage = selectedObject?.type === "image";

    const isShape =
        selectedObject?.type === "rect" ||
        selectedObject?.type === "circle" ||
        selectedObject?.type === "triangle" ||
        selectedObject?.type === "polygon";

    // Text properties
    const obj = selectedObject as any;
    const fontFamily = obj?.fontFamily || "Arial";
    const fontSize = obj?.fontSize || 32;
    const isBold = obj?.fontWeight === "bold" || obj?.fontWeight >= 700;
    const isItalic = obj?.fontStyle === "italic";
    const isUnderline = !!obj?.underline;
    const isStrike = !!obj?.linethrough;
    const textAlign = obj?.textAlign || "left";
    const opacity = selectedObject?.opacity ?? 1;

    // Nothing selected → empty bar
    if (!selectedObject) {
        return (
            <div className="h-[49px] bg-white border-b border-gray-200 shrink-0" />
        );
    }

    return (
        <div className="h-auto min-h-[49px] bg-white border-b border-gray-200 shrink-0 flex items-center px-3 gap-1 flex-wrap py-1.5">

            {/* ── Color swatch (fill) ── */}
            <label
                title="Màu nền"
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer overflow-hidden shrink-0"
                style={{ background: (selectedObject?.fill as string) || "#ffffff" }}
            >
                <input
                    type="color"
                    value={(selectedObject?.fill as string) || "#ffffff"}
                    onChange={(e) => editor?.changeFillColor(e.target.value)}
                    className="opacity-0 w-0 h-0"
                />
            </label>

            {/* ── Text-specific ── */}
            {isText && (
                <>
                    <Sep />

                    {/* Font family picker */}
                    <div className="relative flex items-center shrink-0">
                        <select
                            value={fontFamily}
                            onChange={(e) => editor?.changeFontFamily(e.target.value)}
                            className="appearance-none h-8 pl-2 pr-7 border border-gray-200 rounded text-sm font-medium text-gray-800 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
                            style={{ fontFamily }}
                        >
                            {FONT_FAMILIES.map((f) => (
                                <option key={f} value={f} style={{ fontFamily: f }}>
                                    {f}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-500 pointer-events-none" />
                    </div>

                    <Sep />

                    {/* Bold */}
                    <TBtn
                        title="Đậm (Ctrl+B)"
                        active={isBold}
                        onClick={() => editor?.changeFontWeight(isBold ? 400 : 700)}
                    >
                        <FaBold />
                    </TBtn>

                    {/* Italic */}
                    <TBtn
                        title="Nghiêng (Ctrl+I)"
                        active={isItalic}
                        onClick={() => editor?.changeFontStyle(isItalic ? "normal" : "italic")}
                    >
                        <FaItalic />
                    </TBtn>

                    {/* Underline */}
                    <TBtn
                        title="Gạch dưới (Ctrl+U)"
                        active={isUnderline}
                        onClick={() => editor?.changeUnderline(!isUnderline)}
                    >
                        <FaUnderline />
                    </TBtn>

                    {/* Strikethrough */}
                    <TBtn
                        title="Gạch ngang"
                        active={isStrike}
                        onClick={() => editor?.changeStrikethrough(!isStrike)}
                    >
                        <FaStrikethrough />
                    </TBtn>

                    <Sep />

                    {/* Align left */}
                    <TBtn
                        title="Căn trái"
                        active={textAlign === "left"}
                        onClick={() => editor?.changeTextAlign("left")}
                    >
                        <AlignLeft className="size-4" />
                    </TBtn>

                    {/* Align center */}
                    <TBtn
                        title="Căn giữa"
                        active={textAlign === "center"}
                        onClick={() => editor?.changeTextAlign("center")}
                    >
                        <AlignCenter className="size-4" />
                    </TBtn>

                    {/* Align right */}
                    <TBtn
                        title="Căn phải"
                        active={textAlign === "right"}
                        onClick={() => editor?.changeTextAlign("right")}
                    >
                        <AlignRight className="size-4" />
                    </TBtn>

                    <Sep />

                    {/* Font size */}
                    <TBtn
                        title="Giảm cỡ chữ"
                        onClick={() => editor?.changeFontSize(Math.max(8, fontSize - 1))}
                    >
                        <Minus className="size-3.5" />
                    </TBtn>

                    <input
                        type="number"
                        min={8}
                        max={400}
                        value={fontSize}
                        onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v >= 8 && v <= 400) editor?.changeFontSize(v);
                        }}
                        className="w-1 h-8 text-center border border-gray-200 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 shrink-0"
                    />

                    <TBtn
                        title="Tăng cỡ chữ"
                        onClick={() => editor?.changeFontSize(Math.min(400, fontSize + 1))}
                    >
                        <Plus className="size-3.5" />
                    </TBtn>
                </>
            )}

            {/* ── Shape stroke ── */}
            {isShape && (
                <>
                    <Sep />
                    <label
                        title="Màu viền"
                        className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer overflow-hidden shrink-0"
                        style={{ background: (selectedObject?.stroke as string) || "#000000" }}
                    >
                        <input
                            type="color"
                            value={(selectedObject?.stroke as string) || "#000000"}
                            onChange={(e) => editor?.changeStrokeColor(e.target.value)}
                            className="opacity-0 w-0 h-0"
                        />
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={20}
                        value={(selectedObject as any)?.strokeWidth || 0}
                        onChange={(e) => editor?.changeStrokeWidth(Number(e.target.value))}
                        className="w-11 h-8 text-center border border-gray-200 rounded text-sm focus:outline-none shrink-0"
                        title="Độ dày viền"
                    />
                </>
            )}

            {/* ── Image filters ── */}
            {isImage && (
                <>
                    <Sep />
                    <select
                        onChange={(e) => { if (e.target.value) editor?.changeFilter(e.target.value as any); }}
                        className="h-8 px-2 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none shrink-0"
                    >
                        <option value="">Bộ lọc...</option>
                        <option value="sepia">Sepia</option>
                        <option value="invert">Invert</option>
                        <option value="brightness">Brightness</option>
                        <option value="contrast">Contrast</option>
                        <option value="saturation">Saturation</option>
                        <option value="blur">Blur</option>
                        <option value="pixelate">Pixelate</option>
                    </select>
                </>
            )}

            <Sep />

            {/* ── Layer up / down ── */}
            <TBtn title="Lên trên" onClick={() => editor?.bringForward()}>
                <ArrowUp className="size-4" />
            </TBtn>
            <TBtn title="Xuống dưới" onClick={() => editor?.sendBackwards()}>
                <ArrowDown className="size-4" />
            </TBtn>

            {/* ── Opacity ── */}
            <TBtn
                title={`Độ mờ: ${Math.round(opacity * 100)}%`}
                onClick={() => onChangeActiveTool("opacity" as ActiveTool)}
                active={activeTool === ("opacity" as ActiveTool)}
            >
                <RxTransparencyGrid className="size-4" />
            </TBtn>

            {/* ── Duplicate ── */}
            <TBtn title="Nhân bản (Ctrl+D)" onClick={() => editor?.duplicate()}>
                <Copy className="size-4" />
            </TBtn>

            {/* ── Delete ── */}
            <TBtn title="Xóa (Delete)" danger onClick={() => editor?.delete()}>
                <Trash2 className="size-4" />
            </TBtn>
        </div>
    );
};