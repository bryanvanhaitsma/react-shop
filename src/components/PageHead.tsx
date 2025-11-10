'use client';

import { useEffect } from 'react';

interface PageHeadProps {
  title: string;
  description?: string;
}

export default function PageHead({ title, description }: PageHeadProps) {
  const fullTitle = `${title} | E-Commerce Aggregator`;
  
  useEffect(() => {
    // Set document title
    document.title = fullTitle;
    
    // Set meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.setAttribute('content', description);
    }
  }, [fullTitle, description]);
  
  return null;
}