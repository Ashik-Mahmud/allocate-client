"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectableItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface MultiSelectorProps {
  placeholder?: string;
  onSearch: (searchValue: string) => Promise<SelectableItem[]>;
  onSelectionChange: (selected: SelectableItem[]) => void;
  selectedItems?: SelectableItem[];
  label?: string;
  error?: string;
  disabled?: boolean;
  debounceMs?: number;
}

const MultiSelector = ({
  placeholder = "Search and select items...",
  onSearch,
  onSelectionChange,
  selectedItems = [],
  label,
  error,
  disabled = false,
  debounceMs = 300
}: MultiSelectorProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SelectableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectableItem[]>(selectedItems);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchValue.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await onSearch(searchValue);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, onSearch, debounceMs]);

  // Sync external selectedItems
  useEffect(() => {
    setSelected(selectedItems);
  }, [selectedItems]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = (item: SelectableItem) => {
    const isAlreadySelected = selected.some(s => s.id === item.id);
    
    let updatedSelection: SelectableItem[];
    if (isAlreadySelected) {
      updatedSelection = selected.filter(s => s.id !== item.id);
    } else {
      updatedSelection = [...selected, item];
    }

    setSelected(updatedSelection);
    onSelectionChange(updatedSelection);
    // setSearchValue('');
    // setSearchResults([]);
  };

  const handleRemoveChip = (itemId: string) => {
    const updatedSelection = selected.filter(s => s.id !== itemId);
    setSelected(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  const isItemSelected = (itemId: string) => {
    return selected.some(s => s.id === itemId);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Input Container */}
        <div
          className={cn(
            "w-full p-2 rounded-xl border transition-all flex flex-wrap gap-2 items-center",
            "min-h-11",
            error
              ? "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
              : "border-slate-200 bg-white dark:bg-slate-700 dark:border-slate-600",
            !disabled && "focus-within:ring-2 focus-within:ring-blue-500"
          )}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {/* Selected Chips */}
          {selected.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm font-medium"
            >
              <span>{item.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveChip(item.id);
                }}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 transition-colors"
                disabled={disabled}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Search Input */}
          <div className="flex items-center gap-2 flex-1 min-w-50">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setIsOpen(true);
              }}
              placeholder={selected.length === 0 ? placeholder : ""}
              autoComplete="webauthn"

              disabled={disabled}
              className="flex-1 outline-none bg-transparent text-sm dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {isLoading && <Loader size={16} className="animate-spin text-blue-500" />}
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
            {searchValue.trim() === '' ? (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Start typing to search...
              </div>
            ) : isLoading ? (
              <div className="p-4 text-center">
                <Loader size={18} className="animate-spin text-blue-500 mx-auto" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No results found
              </div>
            ) : (
              <ul className="py-1">
                {searchResults.map((item) => {
                  const isSelected = isItemSelected(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectItem(item)}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                        />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        {selected.length} item(s) selected
      </p>
    </div>
  );
};

export default MultiSelector;
