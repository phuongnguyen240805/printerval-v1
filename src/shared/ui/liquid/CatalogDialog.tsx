import * as Dialog from '@radix-ui/react-dialog';
import { useRef, type ReactNode } from 'react';
import theme from './CatalogTheme.module.css';
import styles from './CatalogDialog.module.css';

/** Shared modal: Escape, focus trapping, scroll lock and focus restoration. */
export function CatalogDialog({
  open,
  onClose,
  title,
  className = '',
  size = 'default',
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  size?: 'default' | 'purchase' | 'payment' | 'card';
  children: ReactNode;
}) {
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={value => {
        if (!value) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          data-liquid-surface=""
          data-size={size}
          className={`${theme.scope} ${styles.content} ${className}`}
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            opener.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={event => {
            if (opener.current?.isConnected) {
              event.preventDefault();
              opener.current.focus();
            }
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
