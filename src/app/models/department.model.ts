export interface DepartmentModel {
    id: number;
    name: string;
    school: string;
    headName: string;
    headImage: string;
    coursesCount: number;
    icon: string; // DaisyUI or Lucide icon name
    status: boolean;
}

export interface Department {
  id: string;
  name: string;
  thumbnail: string;
  code: string;
  description: string;
  subjects: Array<any>;
}
