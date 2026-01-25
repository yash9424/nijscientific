"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  _id: string;
  name: string;
  mainImage: string;
}

interface InquiryContextType {
  inquiryItems: Product[];
  addToInquiry: (product: Product) => void;
  removeFromInquiry: (productId: string) => void;
  isInInquiry: (productId: string) => boolean;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [inquiryItems, setInquiryItems] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inquiryItems');
    if (savedItems) {
      try {
        setInquiryItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Failed to parse inquiry items", e);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('inquiryItems', JSON.stringify(inquiryItems));
  }, [inquiryItems]);

  const addToInquiry = (product: Product) => {
    setInquiryItems(prev => {
      if (prev.some(item => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromInquiry = (productId: string) => {
    setInquiryItems(prev => prev.filter(item => item._id !== productId));
  };

  const isInInquiry = (productId: string) => {
    return inquiryItems.some(item => item._id === productId);
  };

  return (
    <InquiryContext.Provider value={{ inquiryItems, addToInquiry, removeFromInquiry, isInInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
}
