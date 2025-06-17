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

  return (
    <div className="tape-dropdown" style={{ display: 'inline-block', position: 'relative' }}>
      <button
        ref={buttonRef}
        className="tape-dropdown-btn action-btn"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{
          minWidth: 0,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 8,
          border: '2px solid #343a40',
          background: 'linear-gradient(135deg, #495057 0%, #343a40 100%)',
          color: '#f8f9fa',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          textShadow: '0 1px 0 rgba(0,0,0,0.3)',
          position: 'relative',
          width: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          marginLeft: 4,
        }}
      >
        <span style={{fontWeight: 600}}>{selected ? selected.label : label}</span>
        <svg style={{ marginLeft: 8 }} width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z"/></svg>
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
            top: '100%',
            marginTop: 4,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
            minWidth: '180px',
            zIndex: 1000,
            padding: 0,
            listStyle: 'none',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          }}
        >
          <li
            style={{
              padding: '6px 16px 4px 16px',
              background: 'none',
              fontWeight: 600,
              color: '#7a7a7a',
              fontSize: 11,
              borderBottom: '1px solid #f0f0f0',
              letterSpacing: '0.08em',
              userSelect: 'none',
              textTransform: 'uppercase',
              textAlign: 'left',
              opacity: 0.85,
            }}
            tabIndex={-1}
            aria-disabled="true"
          >
            Example tapes
          </li>
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              className="tape-dropdown-item"
              style={{
                padding: '7px 16px',
                background: opt.value === value ? '#e6f0ff' : 'transparent',
                color: '#222',
                cursor: 'pointer',
                fontWeight: opt.value === value ? 600 : 400,
                outline: 'none',
                borderBottom: '1px solid #f4f4f4',
                transition: 'background 0.12s',
                fontSize: 13,
                textAlign: 'left',
                borderRadius: 0,
              }}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(opt.value);
                  setOpen(false);
                }
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#eaf3ff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = opt.value === value ? '#e6f0ff' : 'transparent';
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TapeDropdown; 