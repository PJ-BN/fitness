// Nutrition related TypeScript interfaces (aligned with backend Food API)
export interface Food {
  id: string; // GUID
  isSystem: boolean;
  ownerUserId?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  rowVersion?: string; // may be empty string per backend response
  name: string;
  caloriesPer100g: number;
  proteinGramsPer100g: number;
  carbsGramsPer100g: number;
  fatGramsPer100g: number;
  fiberGramsPer100g?: number | null;
  sugarGramsPer100g?: number | null;
  sodiumMg?: number | null;
  tags?: string[];
}

export interface IntakeEntry {
  id: number; // or string if backend changes
  userId: string;
  foodId: string; // GUID referencing Food.id
  quantityGrams: number; // grams (backend macro basis per 100g)
  // loggedAtLocal removed (now computed server-side)
  timeZone?: string; // Olson TZ name originally used; may be omitted in responses
  notes?: string;
  food?: Food;
}

export interface DailySummaryEntry {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailySummary extends DailySummaryEntry {
  entries: IntakeEntry[];
}

// Creation / update payloads (simplified – backend may accept only subset)
export interface CreateFoodRequest {
  name: string;
  caloriesPer100g: number;
  proteinGramsPer100g: number;
  carbsGramsPer100g: number;
  fatGramsPer100g: number;
  fiberGramsPer100g?: number | null;
  sugarGramsPer100g?: number | null;
  sodiumMg?: number | null;
  tags?: string[];
}
export interface UpdateFoodRequest extends Partial<CreateFoodRequest> {}

export interface CreateIntakeRequest {
  foodId: string;
  quantityGrams: number;
  // loggedAtLocal removed; server will assign current time
  timeZone?: string; // optional now
  notes?: string;
}
export interface UpdateIntakeRequest extends Partial<CreateIntakeRequest> {}
