import { useId, type FormEvent } from 'react';
import { FiFileText, FiPackage, FiSearch } from 'react-icons/fi';
import type { ContractAudience, ContractKind } from './mockData';
import styles from './ContractSearchControls.module.css';

export function ContractSearchControls({
  query,
  kind,
  audience,
  count,
  onQueryChange,
  onSubmit,
  onKindChange,
  onAudienceChange,
}: {
  query: string;
  kind: ContractKind;
  audience: 'Tất cả' | ContractAudience;
  count: number;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onKindChange: (value: ContractKind) => void;
  onAudienceChange: (value: 'Tất cả' | ContractAudience) => void;
}) {
  const id = useId();
  return (
    <div className={styles.controls}>
      <form
        role="search"
        aria-label="Tìm kiếm mẫu hợp đồng"
        onSubmit={onSubmit}
        data-liquid-surface=""
        className={styles.panel}
      >
        <label htmlFor={`${id}-search`} className="sr-only">
          Tìm kiếm mẫu hợp đồng
        </label>
        <div
          data-liquid-field=""
          data-slot="input-group"
          className={styles.searchField}
        >
          <FiSearch className={styles.searchIcon} aria-hidden="true" />
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder="Tìm kiếm mẫu hợp đồng..."
            className={styles.searchInput}
          />
          <button
            type="submit"
            data-catalog-variant="primary"
            data-liquid-shape="pill"
            className={styles.submitButton}
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      <div data-liquid-surface="" className={styles.panel}>
        <div
          className={styles.filterRow}
          role="group"
          aria-labelledby={`${id}-kind`}
        >
          <span id={`${id}-kind`} className={styles.label}>
            Lọc theo:
          </span>
          <div className={styles.options}>
            {(
              [
                { value: 'contract', label: 'Hợp đồng', icon: FiFileText },
                { value: 'bundle', label: 'Gói', icon: FiPackage },
              ] as const
            ).map(item => (
              <button
                key={item.value}
                type="button"
                aria-pressed={kind === item.value}
                data-catalog-variant={
                  kind === item.value ? 'primary' : 'secondary'
                }
                data-liquid-shape="pill"
                onClick={() => onKindChange(item.value)}
                className={styles.filterButton}
              >
                <item.icon aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div data-liquid-surface="" className={styles.panel}>
        <div
          className={styles.filterRow}
          role="group"
          aria-labelledby={`${id}-audience`}
        >
          <span id={`${id}-audience`} className={styles.label}>
            Đối tượng:
          </span>
          <div className={styles.options}>
            {(['Tất cả', 'Cá nhân', 'Doanh nghiệp'] as const).map(value => (
              <button
                key={value}
                type="button"
                aria-pressed={audience === value}
                disabled={kind === 'bundle' && value !== 'Doanh nghiệp'}
                data-catalog-variant={
                  audience === value ? 'primary' : 'secondary'
                }
                data-liquid-shape="pill"
                onClick={() => onAudienceChange(value)}
                className={styles.filterButton}
              >
                {value}
              </button>
            ))}
          </div>
          <span className={styles.resultCount} role="status">
            <strong>{count}</strong> kết quả
          </span>
        </div>
      </div>
    </div>
  );
}
