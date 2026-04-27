export interface Pagination<T> {
  success: boolean;
  status: number;
  message: string;
  content: Array<T>;
  number: number;
  size: number;
  totalPage: number;
  totalElement: number;
  hasPrevious: boolean;
  hasNext: boolean;
  timestamp: Date;
}
