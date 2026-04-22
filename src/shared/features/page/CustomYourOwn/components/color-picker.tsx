import { colors } from "../types";

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export const ColorPicker = ({
    value,
    onChange,
}: ColorPickerProps) => {
    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-12 h-12 border rounded cursor-pointer"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    placeholder="#000000"
                />
            </div>
            <div className="grid grid-cols-8 gap-2">
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => onChange(color)}
                        className="w-6 h-6 rounded border hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};
