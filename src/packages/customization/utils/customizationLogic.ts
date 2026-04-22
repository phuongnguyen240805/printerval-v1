'use client';

import {
  CustomizationOption,
  OptionValue,
  Condition,
  CanvasElement,
  CustomizationTemplate,
} from '../types';

/**
 * Vòng lặp cốt lõi 1: Kiểm tra Option có nên hiển thị không
 * Logic:
 * - Không có conditions → luôn hiển thị
 * - action='hide': mặc định hiển thị, chỉ ẩn khi điều kiện khớp
 * - action='show': mặc định ẩn, chỉ hiển thị khi điều kiện khớp
 */
export function isShowOption(
  option: CustomizationOption,
  watchingOptions: CustomizationOption[]
): boolean {
  if (!option.conditions || option.conditions.length === 0) {
    return true; // Không có điều kiện = luôn hiển thị
  }

  // Phân tách điều kiện 'show' và 'hide'
  const hideConditions = option.conditions.filter(c => c.action === 'hide');
  const showConditions = option.conditions.filter(c => c.action === 'show');

  // Điều kiện 'hide': nếu bất kỳ điều kiện nào khớp thì ẩn
  const shouldHide = hideConditions.length > 0 && hideConditions.some(
    (cond) => evaluateCondition(cond, watchingOptions)
  );

  // Điều kiện 'show': cần tất cả điều kiện khớp mới hiển thị
  const shouldShow = showConditions.length === 0 || showConditions.every(
    (cond) => evaluateCondition(cond, watchingOptions)
  );

  return !shouldHide && shouldShow;
}

/**
 * Đánh giá từng điều kiện
 */
function evaluateConditions(
  conditions: Condition[],
  watchingOptions: CustomizationOption[]
): boolean[] {
  return conditions.map((cond) => evaluateCondition(cond, watchingOptions));
}

/**
 * Đánh giá một điều kiện đơn lẻ
 * Condition: "Nếu option X được chọn với value Y, thì..."
 */
function evaluateCondition(
  condition: Condition,
  watchingOptions: CustomizationOption[]
): boolean {
  const sourceOption = watchingOptions.find((o) => o.id === condition.option_id);
  if (!sourceOption || !sourceOption.selectedValue) {
    return false;
  }

  const isMatch = sourceOption.selectedValue.id === condition.value_id;
  // Nếu action='show', cần khớp; nếu action='hide', không cần khớp
  return condition.action === 'show' ? isMatch : !isMatch;
}

/**
 * Vòng lặp cốt lõi 2: Thay đổi giá trị Option
 */
export function changeOptionValue(
  option: CustomizationOption,
  newValue: OptionValue,
  allOptions: CustomizationOption[],
  elements: CanvasElement[],
  template: any
): void {
  console.log('[changeOptionValue] START:', { optionId: option.id, newValue: newValue.value || newValue.name });
  
  // 1. Cập nhật selectedValue của option
  option.selectedValue = newValue;

  // 2. Xử lý function_items (ảnh hưởng đến canvas)
  if (option.function_items && option.function_items.length > 0) {
    console.log('[changeOptionValue] Calling applyFunctionItems with', option.function_items.length, 'items');
    applyFunctionItems(option.function_items, elements, newValue);
  } else {
    console.log('[changeOptionValue] No function_items to apply');
  }

  // 3. Tính lại khả năng hiển thị của tất cả options
  allOptions.forEach((opt) => {
    opt.isShow = isShowOption(opt, allOptions);
  });

  // 4. Cập nhật khả năng hiển thị của canvas elements
  updateVisibleElements(elements, allOptions);
}

/**
 * Áp dụng thay đổi function_items vào canvas elements
 */
function applyFunctionItems(
  functionItems: any[],
  elements: CanvasElement[],
  value: OptionValue
): void {
  console.log('[applyFunctionItems] START:', { functionItemsCount: functionItems.length, valueObject: value });
  
  functionItems.forEach((item) => {
    if (!item.element_id) {
      console.log('[applyFunctionItems] Skipping item - no element_id');
      return;
    }

    const element = elements.find((el) => el.element_id === item.element_id);
    console.log('[applyFunctionItems] Looking for element:', { itemElementId: item.element_id, found: !!element });
    
    if (!element) {
      console.log('[applyFunctionItems] Element not found for id:', item.element_id);
      return;
    }

    switch (item.type) {
      case 'color':
        // Thay đổi màu sắc element (ví dụ: thay đổi màu da)
        if (value.color) {
          console.log('[applyFunctionItems] Applying color:', { elementId: element.element_id, color: value.color });
          element.config.fill = value.color;
        }
        break;

      case 'text':
        // Thay đổi text của element
        const newText = value.value || value.name;
        console.log('[applyFunctionItems] Applying text:', { elementId: element.element_id, oldText: element.config.text, newText });
        element.config.text = newText;
        break;

      case 'dynamic-image':
        // Thay đổi hình ảnh của element (ví dụ: các kiểu tóc khác nhau)
        if (value.image_url) {
          console.log('[applyFunctionItems] Applying image:', { elementId: element.element_id, imageUrl: value.image_url });
          element.config.src = value.image_url;
        }
        break;

      case 'opacity':
        console.log('[applyFunctionItems] Applying opacity:', { elementId: element.element_id, opacity: value.extra_price || 1 });
        element.config.opacity = value.extra_price || 1;
        break;

      case 'visibility':
        const isVisible = !!value.value;
        console.log('[applyFunctionItems] Applying visibility:', { elementId: element.element_id, isVisible });
        element.isVisible = isVisible;
        break;

      case 'change-template':
        // Xử lý trong store
        break;
    }
  });
}

export function updateVisibleElements(
  elements: CanvasElement[],
  options: CustomizationOption[]
): void {
  // Elements mặc định được hiển thị (ngoài trừ những cái có linkedOptionId hoặc trong function_items)
  const elementsToShow = new Set<string>();

  // Duyệt qua tất cả options
  options.forEach((option) => {
    if (!option.isShow || !option.selectedValue) {
      if (option.id === 'custom-text') {
      }
      return;
    }

    // Nếu option được chọn, đánh dấu các elements liên quan là hiển thị
    if (option.function_items) {
      option.function_items.forEach((func) => {
        if (func.element_id) {
          elementsToShow.add(func.element_id);
          if (option.id === 'custom-text') {
          }
        }
      });
    }
  });

  console.log('[updateVisibleElements] Elements to show:', Array.from(elementsToShow));

  // Áp dụng khả năng hiển thị:
  // - Elements với linkedOptionId: visible nếu option được chọn
  // - Elements khác (background, static text): giữ nguyên visible = true từ template
  elements.forEach((element) => {
    if (element.config?.linkedOptionId) {
      const wasVisible = element.isVisible;
      element.isVisible = elementsToShow.has(element.element_id);
      if (element.element_id === 'custom-text-element') {
        console.log('[updateVisibleElements] custom-text-element visibility:', { wasVisible, isNow: element.isVisible, inSet: elementsToShow.has(element.element_id) });
      }
    }
    // Elements không có linkedOptionId (static) mặc định visible từ template
  });
}

/**
 * Hệ thống Variant key (để xử lý tổ hợp nhiều tùy chọn)
 */
export function buildVariantKey(
  selectedOptions: Record<string, string> // option_id -> value_id
): string {
  return Object.entries(selectedOptions)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, valueId]) => valueId)
    .join('-');
}

/**
 * Lấy cấu hình tùy chọn đã chọn (để sử dụng khi add to cart)
 */
export function getSelectedConfiguration(
  options: CustomizationOption[]
): Record<string, any> {
  return options.reduce((acc, option) => {
    if (option.selectedValue) {
      acc[option.id] = {
        label: option.label,
        value_id: option.selectedValue.id,
        value_name: option.selectedValue.name,
        extra_price: option.selectedValue.extra_price || 0,
      };
    }
    return acc;
  }, {} as Record<string, any>);
}


