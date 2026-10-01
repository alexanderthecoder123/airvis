export interface RentalSummary {
    category: string;
    count: number;
    percentage: number;
  }
  
  export interface HistogramData {
    bin: string;
    count: number;
  }
  
  export interface ShortTermRentalData {
    summary: RentalSummary[];
    histogram: HistogramData[];
  }
  
  export const fetchShortTermRentals = async (): Promise<ShortTermRentalData> => {
    const response = await fetch("http://127.0.0.1:8000/shortTermRentals");
    if (!response.ok) {
      throw new Error("Failed to fetch short-term rentals data");
    }
    return response.json();
  };