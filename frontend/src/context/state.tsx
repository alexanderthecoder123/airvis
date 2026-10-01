// state.tsx

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the type for the filters
interface Filters {
  location: string;
  minPrice: number;
  maxPrice: number;
  amenitiesFilter: string[];
  roomTypeFilter: string;
}

// Define the data interface
interface Data {
  id: number;
  location: string;
  longitude: string;
  latitude: string;
  price: number;
  roomType: string;
  amenities: string[]; // Added for amenities
}

type FilterValue = Filters[keyof Filters];
type RawListing = Record<string, unknown>;

// Create the context to hold the global state
const GlobalStateContext = createContext<{
  filters: Filters;
  setFilter: (filterName: keyof Filters, value: FilterValue) => void;
  displayData: Data[];
  listings: Data[];
  setDisplayData: React.Dispatch<React.SetStateAction<Data[]>>;
} | undefined>(undefined);

// Custom hook to access the context
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

// GlobalStateProvider component to manage state
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize filters with default values
  const [filters, setFilters] = useState<Filters>({
    location: 'all',
    minPrice: 0,
    maxPrice: 1000,
    amenitiesFilter: [],
    roomTypeFilter: 'any',
  });

  // Function to update a specific filter
  const setFilter = (filterName: keyof Filters, value: FilterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const [displayData, setDisplayData] = useState<Data[]>([]);
  const [listings, setListings] = useState<Data[]>([]);

  const toListing = (item: RawListing): Data => {
    const amenities = typeof item.amenities === 'string'
      ? item.amenities.replace(/[{}"]/g, '').split(',').map((entry) => entry.trim())
      : [];

    return {
      id: Number(item.id),
      location: String(item.neighbourhood_group_cleansed ?? ''),
      longitude: String(item.longitude ?? ''),
      latitude: String(item.latitude ?? ''),
      price: Number(item.price),
      roomType: String(item.room_type ?? ''),
      amenities,
    };
  };

  // Fetch the default listing count once for the statistics panel.
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:8000/mapData?minPrice=0&maxPrice=1000');
        const rawData: RawListing[] = await response.json();
        setListings(rawData.map(toListing));
      } catch (error) {
        console.error('Error fetching all listings:', error);
      }
    };

    fetchListings();
  }, []);

  // Fetch data from the backend whenever filters change.
  useEffect(() => {
    const fetchData = async () => {
      let url = 'http://localhost:8000/mapData';
      const params = new URLSearchParams();

      // Include filters as query parameters
      if (filters.location && filters.location !== 'all') {
        params.append('neighbourhood', filters.location);
      }
      if (filters.minPrice != null) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice != null) {
        params.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.amenitiesFilter && filters.amenitiesFilter.length > 0) {
        params.append('amenities', filters.amenitiesFilter.join(','));
      }
      if (filters.roomTypeFilter && filters.roomTypeFilter !== 'any') {
        params.append('roomType', filters.roomTypeFilter);
      }

      if (Array.from(params).length > 0) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await fetch(url);
        const rawData: RawListing[] = await response.json();
        const data = rawData.map(toListing);

        setDisplayData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filters]); // Trigger on any filter change

  return (
    <GlobalStateContext.Provider value={{ filters, setFilter, listings, displayData, setDisplayData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
