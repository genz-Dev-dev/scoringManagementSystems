export interface PageResponse<T>
{
	success: boolean;
	status: number;
	message: string;
	content: T;

	number: number;
	size: number;
	totalPage: number;
	totalElement: number;

	hastPrevious: boolean;
	hastNext: boolean;

	currentPage: number;
	timestamp: string;
}