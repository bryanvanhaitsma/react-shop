'use client';
import React from 'react';

interface HeaderSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function HeaderSearch({ value, onChange, placeholder = 'Search products...' }: HeaderSearchProps) {
  return (
    <input
      id="header-search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}