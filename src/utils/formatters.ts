
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getSourceBadgeColor = (source: string): string => {
  const colors: Record<string, string> = {
    fakestore: 'bg-blue-100 text-blue-800',
    dummyjson: 'bg-green-100 text-green-800',
    platzi: 'bg-purple-100 text-purple-800',
  };
  return colors[source] || 'bg-gray-100 text-gray-800';
};