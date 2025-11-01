// src/constants/states.ts
export interface State {
  abbreviation: string;
  name: string;
}

export const US_STATES: State[] = [
  { abbreviation: "AL", name: "Alabama" },
  { abbreviation: "AK", name: "Alaska" },
  { abbreviation: "AZ", name: "Arizona" },
  { abbreviation: "AR", name: "Arkansas" },
  { abbreviation: "CA", name: "California" },
  { abbreviation: "CO", name: "Colorado" },
  { abbreviation: "CT", name: "Connecticut" },
  { abbreviation: "DE", name: "Delaware" },
  { abbreviation: "DC", name: "District of Columbia" },
  { abbreviation: "FL", name: "Florida" },
  { abbreviation: "GA", name: "Georgia" },
  { abbreviation: "HI", name: "Hawaii" },
  { abbreviation: "ID", name: "Idaho" },
  { abbreviation: "IL", name: "Illinois" },
  { abbreviation: "IN", name: "Indiana" },
  { abbreviation: "IA", name: "Iowa" },
  { abbreviation: "KS", name: "Kansas" },
  { abbreviation: "KY", name: "Kentucky" },
  { abbreviation: "LA", name: "Louisiana" },
  { abbreviation: "ME", name: "Maine" },
  { abbreviation: "MD", name: "Maryland" },
  { abbreviation: "MA", name: "Massachusetts" },
  { abbreviation: "MI", name: "Michigan" },
  { abbreviation: "MN", name: "Minnesota" },
  { abbreviation: "MS", name: "Mississippi" },
  { abbreviation: "MO", name: "Missouri" },
  { abbreviation: "MT", name: "Montana" },
  { abbreviation: "NE", name: "Nebraska" },
  { abbreviation: "NV", name: "Nevada" },
  { abbreviation: "NH", name: "New Hampshire" },
  { abbreviation: "NJ", name: "New Jersey" },
  { abbreviation: "NM", name: "New Mexico" },
  { abbreviation: "NY", name: "New York" },
  { abbreviation: "NC", name: "North Carolina" },
  { abbreviation: "ND", name: "North Dakota" },
  { abbreviation: "OH", name: "Ohio" },
  { abbreviation: "OK", name: "Oklahoma" },
  { abbreviation: "OR", name: "Oregon" },
  { abbreviation: "PA", name: "Pennsylvania" },
  { abbreviation: "RI", name: "Rhode Island" },
  { abbreviation: "SC", name: "South Carolina" },
  { abbreviation: "SD", name: "South Dakota" },
  { abbreviation: "TN", name: "Tennessee" },
  { abbreviation: "TX", name: "Texas" },
  { abbreviation: "UT", name: "Utah" },
  { abbreviation: "VT", name: "Vermont" },
  { abbreviation: "VA", name: "Virginia" },
  { abbreviation: "WA", name: "Washington" },
  { abbreviation: "WV", name: "West Virginia" },
  { abbreviation: "WI", name: "Wisconsin" },
  { abbreviation: "WY", name: "Wyoming" },
  { abbreviation: "AS", name: "American Samoa" },
  { abbreviation: "GU", name: "Guam" },
  { abbreviation: "MP", name: "Northern Mariana Islands" },
  { abbreviation: "PR", name: "Puerto Rico" },
  { abbreviation: "VI", name: "U.S. Virgin Islands" }
];



// Utility functions
export function getStateByAbbreviation(abbreviation: string): State | undefined {

  const rawState = (abbreviation || '').trim();

  if (rawState) {
    return US_STATES.find(s => s.name.toLowerCase() === rawState.toLowerCase() || s.abbreviation.toLowerCase() === rawState.toLowerCase());
  } else {
    return undefined;
  }


}

export function getStateNameByAbbreviation(abbreviation: string): string {
  return getStateByAbbreviation(abbreviation)?.name || '';
}

export function getStateAbbreviationByName(name: string): string {
  const state = US_STATES.find(state => 
    state.name.toLowerCase() === name.toLowerCase()
  );
  return state?.abbreviation || '';
}

export function isValidStateAbbreviation(abbreviation: string): boolean {
  return US_STATES.some(state => state.abbreviation === abbreviation);
}

