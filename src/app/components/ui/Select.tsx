'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';
import { cx } from '@/app/lib/utils';
import { IconSelector } from './icons';
import { PopoverPanel, popoverOptionClassName, usePopover } from './Popover';

interface SelectProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  labelledBy: string;
  disabled?: boolean;
  className?: string;
}

/** Select-only combobox; focus stays on the trigger while navigating its listbox. */
export function Select({ options, value, onChange, labelledBy, disabled, className }: SelectProps) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const searchRef = useRef({ text: '', time: 0 });
  const popover = usePopover({
    estimatedHeight: options.length * 32 + 14,
    matchTriggerWidth: true,
    disabled,
  });

  function showOptions(index = selectedIndex) {
    setActiveIndex(index);
    searchRef.current = { text: '', time: 0 };
    popover.openPopover();
  }

  function chooseOption(index: number) {
    if (disabled) return;
    onChange(options[index].id);
    popover.closePopover();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    if (key === 'Tab') {
      if (popover.open) chooseOption(activeIndex);
      return;
    }
    if (key === 'Escape') {
      if (popover.open) {
        event.preventDefault();
        popover.closePopover();
      }
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (popover.open) chooseOption(activeIndex);
      else showOptions();
      return;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!popover.open) showOptions();
      else
        setActiveIndex((index) =>
          Math.max(0, Math.min(options.length - 1, index + (key === 'ArrowDown' ? 1 : -1))),
        );
      return;
    }
    if (key === 'Home' || key === 'End') {
      event.preventDefault();
      const index = key === 'Home' ? 0 : options.length - 1;
      if (popover.open) setActiveIndex(index);
      else showOptions(index);
      return;
    }
    if (key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

    event.preventDefault();
    const now = Date.now();
    const search = searchRef.current;
    const text = (now - search.time < 500 ? search.text : '') + key.toLocaleLowerCase();
    const query = [...text].every((character) => character === text[0]) ? text[0] : text;
    const start = popover.open ? activeIndex : selectedIndex;
    const match = options.findIndex((_, offset) => {
      const index = (start + offset + (query.length === 1 ? 1 : 0)) % options.length;
      return options[index].label.toLocaleLowerCase().startsWith(query);
    });
    if (match !== -1) {
      const index = (start + match + (query.length === 1 ? 1 : 0)) % options.length;
      if (popover.open) setActiveIndex(index);
      else showOptions(index);
    }
    searchRef.current = { text, time: now };
  }

  return (
    <div ref={popover.rootRef} className={cx('relative w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={popover.open}
        aria-controls={popover.open ? listId : undefined}
        aria-activedescendant={popover.open ? `${listId}-${activeIndex}` : undefined}
        aria-labelledby={labelledBy}
        disabled={disabled}
        onClick={() => (popover.open ? popover.closePopover() : showOptions())}
        onKeyDown={handleKeyDown}
        onBlur={popover.closePopover}
        className="border-gold text-gold focus-visible:outline-gold disabled:cursor-inherit flex h-12 w-full cursor-pointer items-center justify-between gap-3 border px-4 text-left text-sm transition-colors focus-visible:outline-2"
      >
        <span>{options[selectedIndex].label}</span>
        <IconSelector size={14} className="shrink-0 opacity-60" />
      </button>

      <PopoverPanel popover={popover} id={listId} role="listbox" aria-labelledby={labelledBy}>
        {options.map((option, index) => (
          <button
            key={option.id}
            id={`${listId}-${index}`}
            type="button"
            role="option"
            aria-selected={option.id === value}
            tabIndex={-1}
            // Keep focus on the combobox, including when selecting with a pointer.
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => {
              chooseOption(index);
              triggerRef.current?.focus();
            }}
            className={cx(
              popoverOptionClassName(option.id === value),
              'w-full cursor-pointer text-left',
              index === activeIndex && 'bg-white/5 opacity-100',
            )}
          >
            {option.label}
          </button>
        ))}
      </PopoverPanel>
    </div>
  );
}
