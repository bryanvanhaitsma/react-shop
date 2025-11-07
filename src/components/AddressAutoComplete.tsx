import { useState, useEffect, useRef } from 'react';
import styles from './AddressAutocomplete.module.css';

export interface AddressComponent {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  formatted?: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (addressData: {
    fullAddress: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => void;
  apiKey: string;
  placeholder?: string;
  initialValue?: string;
}

const AddressAutocomplete = ({ 
  onAddressSelect, 
  apiKey, 
  placeholder = 'Enter your address',
  initialValue = ''
}: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const fetchSuggestions = async (text: string) => {
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&format=json&limit=5&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }
      
      const data = await response.json();
      // console.log(data.results);
      setSuggestions(data.results || []);
      setShowSuggestions(data.results && data.results.length > 0);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce API calls to avoid excessive requests
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };
  
  const handleSelectSuggestion = (suggestion: any) => {
    const formattedAddress = suggestion.formatted;
    setQuery(suggestion.address_line1 || formattedAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Extract address components
    const street = suggestion.address_line1 || '';
    const city = suggestion.city || suggestion.county || '';
    const state = suggestion.state || '';
    const zipCode = suggestion.postcode || '';
    const country = suggestion.country_code || '';
    
    // Notify parent component
    onAddressSelect({
      fullAddress: formattedAddress,
      street,
      city,
      state,
      zipCode,
      country
    });
  };
  
  return (
    <div className={styles.autocompleteContainer}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={styles.autocompleteInput}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
      />
      
      {loading && <div className={styles.loader} />}
      
      {showSuggestions && (
        <ul className={styles.suggestionsList} ref={suggestionsRef}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id || suggestion.properties.place_id}
              className={styles.suggestionItem}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;