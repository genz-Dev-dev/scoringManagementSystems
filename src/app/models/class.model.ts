import {Department} from './department.model';

export interface Class {
  id: string;
  name: string;
  department: Array<Department>;
  academicYear: string;
  generation: number;
  creationAt: Date;
  updateAt: Date;
}
