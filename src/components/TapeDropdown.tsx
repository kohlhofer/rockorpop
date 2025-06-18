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

const TapeDropdown: React.FC<TapeDropdownProps> = ({ options, value, onSelect, label = 'Select...' }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node) && 
          !buttonRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onSelect(option.value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-black/50 hover:bg-black/60 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-200"
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
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 w-56 rounded-lg bg-black/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ring-1 ring-white/20 z-50"
          role="listbox"
        >
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-bold text-white/80 uppercase tracking-wider">
              Example tapes
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/15 transition-colors duration-150
                  ${option.value === value ? 'text-white font-bold' : 'text-white'}`}
                onClick={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TapeDropdown; 