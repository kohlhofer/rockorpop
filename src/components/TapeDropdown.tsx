import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface TapeDropdownProps {
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
  label?: string;
}

const TapeDropdown: React.FC<TapeDropdownProps> = ({ options, value, onSelect, label = 'Tapes...' }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const selected = options.find(opt => opt.value === value);

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setOpen(false);
  };

  return (
    <div className="tape-dropdown" style={{ display: 'inline-block', position: 'relative' }}>
      <button
        ref={buttonRef}
        className="action-btn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected ? selected.label : label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      {open && (
        <ul
          ref={menuRef}
          className="tape-dropdown-menu"
          role="listbox"
          tabIndex={-1}
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 8px)',
            background: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: '200px',
            zIndex: 2001,
            padding: '6px 0',
            margin: 0,
            listStyle: 'none',
            overflow: 'hidden',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          }}
        >
          <li
            style={{
              padding: '8px 16px 6px',
              background: 'none',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 11,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              letterSpacing: '0.08em',
              userSelect: 'none',
              textTransform: 'uppercase',
              textAlign: 'left',
            }}
            tabIndex={-1}
            aria-disabled="true"
          >
            Example tapes
          </li>
          {options.map((option, i) => (
            <li
              key={i}
              role="option"
              aria-selected={selected?.value === option.value}
              tabIndex={0}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: selected?.value === option.value ? 'rgba(255, 255, 255, 0.1)' : 'none',
                transition: 'all 0.2s ease',
                fontSize: 14,
                textAlign: 'left',
                color: selected?.value === option.value ? '#fff' : 'rgba(255, 255, 255, 0.8)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                if (selected?.value !== option.value) {
                  e.currentTarget.style.background = 'none';
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TapeDropdown; 