import { useState, useEffect } from 'react';

type Position = { value: string; name: string; defaultImage: string; selectImage: string };
type AdditionalPrice = { default?: number; categories?: Record<string, number> };

interface Props {
  positions: Position[];
  additionalPrice?: Record<string, AdditionalPrice>;
  categoryIds?: string[];
  defaultValue?: string;
  onChange?: (pos: { position: Position; additional_price?: number }) => void;
}

export function PrintLocationSelector({
  positions,
  additionalPrice,
  categoryIds = [],
  defaultValue,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<Position | null>(null);

  useEffect(() => {
    // init default
    let initPos = positions.find(p => p.value === defaultValue) || positions[0];
    setSelected(initPos);
  }, [positions, defaultValue]);

  const calcAdditional = (posValue: string) => {
    const priceConfig = additionalPrice?.[posValue];
    if (!priceConfig) return undefined;

    for (const catId of categoryIds) {
      if (priceConfig.categories?.[catId]) return priceConfig.categories[catId];
    }
    return priceConfig.default;
  };

  const handleSelect = (pos: Position) => {
    setSelected(pos);
    const addPrice = calcAdditional(pos.value);
    onChange?.({ position: pos, additional_price: addPrice });
  };

  if (!selected) return null;

  return (
    <div className="print-location">
      <h3 className="text-lg font-medium">Print Location: <span className="font-bold">{selected.name}</span></h3>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {positions.map(pos => (
          <button
            key={pos.value}
            onClick={() => handleSelect(pos)}
            className={`border rounded-lg p-2 transition ${selected.value === pos.value ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <img
              src={selected.value === pos.value ? pos.selectImage : pos.defaultImage}
              alt={pos.name}
              className="w-full h-32 object-contain"
            />
            <p className="mt-2 text-sm">{pos.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

