import { createRoot, type Root } from 'react-dom/client';
import * as React from 'react';
import type { act as Act } from 'react-dom/test-utils';
import { AiCheckoutDialog } from './AiCheckoutDialog';
import type { CheckoutItem } from './model';
// React 19 runtime; the repository still uses React 18 type declarations.
const act = (React as typeof React & { act: typeof Act }).act;

const item: CheckoutItem = {
  id: 'test',
  name: 'Test AI',
  title: 'Gói Test AI',
  logo: '/test.webp',
  price: 100000,
  periodMonths: 1,
  access: 'Gói tiêu chuẩn',
};
let root: Root;
let host: HTMLDivElement;
const close = jest.fn();
const button = (text: string) =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
    node => node.textContent === text,
  )!;
const click = (element: HTMLElement) => act(() => element.click());

beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  close.mockClear();
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

test('three steps keep the quote and focus, back restores chosen term', () => {
  act(() => root.render(<AiCheckoutDialog item={item} onClose={close} />));
  click(button('3 tháng'));
  click(button('Đi tới thanh toán'));
  expect(
    document.querySelector('[role="dialog"]')?.getAttribute('data-size'),
  ).toBe('payment');
  expect(document.activeElement?.textContent).toBe(
    'Chọn phương thức thanh toán',
  );
  expect(document.body.textContent).toContain('300.000');
  click(button('Thanh toán ngay'));
  expect(
    document.querySelector('[role="dialog"]')?.getAttribute('data-size'),
  ).toBe('card');
  expect(document.activeElement?.textContent).toBe('Thanh toán an toàn');
  click(document.querySelector<HTMLButtonElement>('[aria-label="Quay lại"]')!);
  click(document.querySelector<HTMLButtonElement>('[aria-label="Quay lại"]')!);
  expect(
    document.querySelector('button[aria-pressed="true"]')?.textContent,
  ).toContain('3 tháng');
  click(button('Hủy'));
  expect(close).toHaveBeenCalledTimes(1);
});

test('changing renewal resets an incompatible payment method', () => {
  act(() => root.render(<AiCheckoutDialog item={item} onClose={close} />));
  click(button('Đi tới thanh toán'));
  click(button('Thanh toán một lần'));
  const paypal = Array.from(
    document.querySelectorAll<HTMLButtonElement>('button'),
  ).find(node => node.textContent?.startsWith('PayPal'))!;
  click(paypal);
  click(button('Tự động gia hạn'));
  expect(document.body.textContent).not.toContain('PayPal');
  click(button('Thanh toán ngay'));
  expect(document.body.textContent).toContain('Số thẻ');
  act(() =>
    document
      .getElementById('preview-card-form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
  );
  expect(document.activeElement?.id).toBe('preview-card-number');
  expect(document.querySelectorAll('[role="alert"]').length).toBe(4);
});

test('Escape dismisses the shared dialog', () => {
  act(() => root.render(<AiCheckoutDialog item={item} onClose={close} />));
  act(() =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    ),
  );
  expect(close).toHaveBeenCalledTimes(1);
});

test('valid test data completes preview and removes all card fields', () => {
  act(() => root.render(<AiCheckoutDialog item={item} onClose={close} />));
  click(button('Đi tới thanh toán'));
  click(button('Thanh toán ngay'));
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  for (const [field, value] of Object.entries({ number:'4242424242424242',expiry:'12/30',cvv:'123',name:'Demo' })) {
    const input = document.getElementById(`preview-card-${field}`)!;
    act(() => { setter.call(input,value); input.dispatchEvent(new Event('input', { bubbles:true })); });
  }
  act(() => document.getElementById('preview-card-form')!.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true })));
  expect(document.body.textContent).toContain('Đã hoàn tất xem trước');
  expect(document.querySelector('input')).toBeNull();
  expect(document.body.textContent).not.toContain('4242');
});
