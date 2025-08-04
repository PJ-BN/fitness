export interface ApiResponse {
  success: boolean;
  message: string;
  errors: string[];
}

export interface ApiResponseWithData<T> extends ApiResponse {
  data: T;
}

export interface Set {
  id: number;
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: number;
  duration: number;
  notes: string;
}

export interface WorkoutExercise {
  id: number;
  workoutId: number;
  exerciseId: number;
  exercise: unknown;
  notes: string;
  sets: Set[];
}

export interface WorkoutLog {
  id: number;
  userId: string;
  user: unknown;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  workoutExercises: WorkoutExercise[];
}
