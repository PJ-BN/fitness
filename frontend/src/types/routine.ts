export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  muscleGroups: string;
  equipment: string;
  createdAt: string;
}

// DTO interfaces matching backend
export interface DayRoutineExerciseDto {
  dayRoutineId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  duration?: number;
  weight?: number;
  notes?: string;
}

export interface DayRoutineDto {
  weeklyRoutineId: number;
  dayOfWeek: number;
  dayName: string;
  isRestDay: boolean;
}

export interface DayRoutineBodyPartDto {
  dayRoutineId: number;
  bodyPart: string;
}

export interface WeeklyRoutineDto {
  userId: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface WorkoutDto {
  userId: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExerciseDto {
  workoutId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface ApiResponseBase {
  success: boolean;
  message: string;
  errors: string[];
}

// Extended entities (with IDs) returned from API
export interface DayRoutineExercise extends DayRoutineExerciseDto {
  id: number;
  exercise?: Exercise;
}

export interface DayRoutine extends DayRoutineDto {
  id: number;
  exercises?: DayRoutineExercise[];
  bodyParts?: DayRoutineBodyPartDto[];
}

export interface WeeklyRoutine extends WeeklyRoutineDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  dayRoutines?: DayRoutine[];
}

export interface Workout extends WorkoutDto {
  id: number;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise extends WorkoutExerciseDto {
  id: number;
  exercise?: Exercise;
}

// Legacy interfaces for backward compatibility
export interface RoutineExercise {
  exerciseId: number;
  exercise: Exercise;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  notes?: string;
}

export interface LegacyDayRoutine {
  id: any;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;
  bodyParts: string[];
  exercises: RoutineExercise[];
  isRestDay: boolean;
}

export interface LegacyWeeklyRoutine {
  id?: string;
  userId?: string;
  name: string;
  description?: string;
  routines: LegacyDayRoutine[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BodyPart {
  id: string;
  name: string;
  exercises: Exercise[];
}

export const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday', shortName: 'Sun' },
  { id: 1, name: 'Monday', shortName: 'Mon' },
  { id: 2, name: 'Tuesday', shortName: 'Tue' },
  { id: 3, name: 'Wednesday', shortName: 'Wed' },
  { id: 4, name: 'Thursday', shortName: 'Thu' },
  { id: 5, name: 'Friday', shortName: 'Fri' },
  { id: 6, name: 'Saturday', shortName: 'Sat' }
];

export const BODY_PARTS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Biceps',
  'Triceps',
  'Legs',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
  'Abs',
  'Cardio',
  'Full Body'
];
