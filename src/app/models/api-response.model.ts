export interface ApiResponse<T> {
  success: boolean;
  status: number;
  description: string;
  data: T;
  timestamp: Date;
}
