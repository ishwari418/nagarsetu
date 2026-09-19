// Local mock location data. No external APIs in Phase 1.
export const LOCATIONS = {
  India: {
    Maharashtra: {
      "Ahilyanagar": {
        Kopargaon: ["Ward 1 - Station Road", "Ward 2 - Shirdi Road", "Ward 3 - Market Yard", "Ward 4 - Sanjivani Nagar"],
        Shirdi: ["Ward 1 - Temple Area", "Ward 2 - Pimpalwadi Road"],
      },
      Pune: {
        Pune: ["Kothrud", "Hadapsar", "Shivajinagar", "Baner", "Viman Nagar"],
        "Pimpri-Chinchwad": ["Nigdi", "Akurdi", "Chinchwad"],
      },
      "Mumbai Suburban": {
        Mumbai: ["Andheri West", "Bandra East", "Borivali", "Powai"],
      },
      Nashik: {
        Nashik: ["Panchavati", "Gangapur Road", "Satpur", "Indira Nagar"],
      },
    },
    Karnataka: {
      "Bengaluru Urban": {
        Bengaluru: ["Koramangala", "Indiranagar", "Jayanagar", "Whitefield"],
      },
    },
    "Uttar Pradesh": {
      Lucknow: {
        Lucknow: ["Gomti Nagar", "Hazratganj", "Aliganj"],
      },
    },
    Delhi: {
      "New Delhi": {
        "New Delhi": ["Karol Bagh", "Dwarka", "Rohini", "Saket"],
      },
    },
  },
} as const;

export type Country = keyof typeof LOCATIONS;

export const COUNTRIES = Object.keys(LOCATIONS);

export function statesOf(country: string): string[] {
  return Object.keys((LOCATIONS as any)[country] ?? {});
}
export function districtsOf(country: string, state: string): string[] {
  return Object.keys((LOCATIONS as any)[country]?.[state] ?? {});
}
export function citiesOf(country: string, state: string, district: string): string[] {
  return Object.keys((LOCATIONS as any)[country]?.[state]?.[district] ?? {});
}
export function wardsOf(country: string, state: string, district: string, city: string): string[] {
  return ((LOCATIONS as any)[country]?.[state]?.[district]?.[city] ?? []) as string[];
}

export const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];
