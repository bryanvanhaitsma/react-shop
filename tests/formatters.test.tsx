import { describe, it, expect } from 'vitest';
import { formatPrice, truncateText, formatRating, getSourceBadgeColor } from '@/utils/formatters';


describe('formatPrice', () => {
  it('formats whole numbers correctly', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });
  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
  it('formats decimal numbers correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });
  it('formats large numbers with commas', () => {
    expect(formatPrice(12345678)).toBe('$12,345,678.00');
  });
});


describe('truncateText', () => {
  it('truncates text correctly at 8 characters', () => {
    expect(truncateText('Hello, World!', 8)).toBe('Hello, W...');
  });
  it('returns original text if within limit', () => {
    expect(truncateText('Short text', 20)).toBe('Short text');
  });
});


describe('formatRating', () => {
  it('formats rating with one decimal place', () => {
    expect(formatRating(4.256)).toBe('4.3');
  });
  it('formats whole number ratings correctly', () => {
    expect(formatRating(5)).toBe('5.0');
  });
  it('formats zero rating correctly', () => {
    expect(formatRating(0)).toBe('0.0');
  });
});


describe('getSourceBadgeColor', () => {
  it('returns correct color for fakestore', () => {
    expect(getSourceBadgeColor('fakestore')).toBe('bg-blue-100 text-blue-800');
  });
  it('returns correct color for platzi', () => {
    expect(getSourceBadgeColor('platzi')).toBe('bg-purple-100 text-purple-800');
  });
  it('returns correct color for dummyjson', () => {
    expect(getSourceBadgeColor('dummyjson')).toBe('bg-green-100 text-green-800');
  });
  it('returns default color for any other string', () => {
    expect(getSourceBadgeColor('foobar')).toBe('bg-gray-100 text-gray-800');
  });
});