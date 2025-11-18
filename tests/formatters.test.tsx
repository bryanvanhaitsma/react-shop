import { describe, it, expect } from 'vitest';
import { formatPrice, truncateText } from '@/utils/formatters';


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
