// model
export interface Department
{
    departmentId: string;
    name: string;
    thumbnail: string;
    code: string;
    description: string;
}

// response
export interface ApiResponse<T>
{
    success: boolean;
    status: number;
    message: string;
    data: T;
    timestamp: string;
}

export interface ClassResponse
{
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
    academicYear: string;
    generation: number;
    creationAt: string;
    updatedAt: string;
}

export interface ErrorRespone
{
    success: boolean;
    status: number;
    message: string;
    timestamp: string;
    error: string;
}
export interface PerformanceBar
{
    label: string;
    passed: number;
    failed: number;
}