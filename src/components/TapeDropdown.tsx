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
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors duration-200"
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
          className="absolute left-0 mt-2 w-56 rounded-lg bg-[rgba(30,30,30,0.95)] backdrop-blur-lg backdrop-saturate-[1.2] shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          role="listbox"
        >
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
              Example tapes
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors duration-150
                  ${option.value === value ? 'text-white font-medium' : 'text-white/80'}`}
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