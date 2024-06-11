export interface Lots {
  id: number;
  isSelected: boolean;
}

export interface Asociation {
  id_association: number;
  association_name: string;
  association_situation: boolean;
}

export interface Roasting {
  id_roast: number;
  roasting_name: string;
}

export interface CoffeeVariety {
  id_variety: number;
  variety_name: string;
}

export interface CofeeProfiles {
  id_profile: number;
  profile_name: string;
}

export interface DataProfileCoffe {
  message: string;
  associations: Asociation[];
  roastingTypes: Roasting[];
  coffeeVariations: CoffeeVariety[];
  coffeeProfiles: CofeeProfiles[];
}

