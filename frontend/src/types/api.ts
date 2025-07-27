export interface ApiResponse {
  success: boolean;
  message: string;
  errors: string[];
}

export interface ApiResponseWithData<T> extends ApiResponse {
  data: T;
}
