import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
interface StudentRecord
{
  name: string;
  id: string;
  subject: string;
  semester: string;
  score: number | string;
  grade: string;
  status: 'PUBLISHED' | 'VALIDATED' | 'PENDING';
}
@Component( {
  selector: 'app-list-score',
  imports: [ CommonModule ],
  templateUrl: './list-score.component.html',
  styleUrl: './list-score.component.scss',
} )
export class ListScoreComponent implements OnInit
{
  student: any | null = null;
  constructor( private studentService: StudentsServiceService ) { }
  ngOnInit (): void
  {
    this.handleGetAllStudent()
  }
  records: StudentRecord[] = [
    { name: 'Julianne Holloway', id: '457-86219', subject: 'Advanced Calculus', semester: 'Fall 2024', score: 94, grade: 'A', status: 'PUBLISHED' },
    { name: 'Arthur Morgan', id: '457-86220', subject: 'Quantum Physics', semester: 'Fall 2024', score: 72, grade: 'C+', status: 'VALIDATED' },
    { name: 'Sarah Winston', id: '457-86221', subject: 'Data Structures', semester: 'Fall 2024', score: '--', grade: 'N/A', status: 'PENDING' },
    { name: 'Kevin Lehmann', id: '457-86222', subject: 'Organic Chemistry', semester: 'Fall 2024', score: 88, grade: 'B+', status: 'PUBLISHED' },
  ];

  getStatusClass ( status: string )
  {
    switch ( status )
    {
      case 'PUBLISHED': return 'badge-success text-white text-[10px] gap-1';
      case 'VALIDATED': return 'badge-info text-white text-[10px] gap-1';
      default: return 'badge-ghost bg-gray-200 text-[10px] gap-1';
    }
  }
  private handleGetAllStudent ()
  {
    this.studentService.getAllStudents().subscribe( {
      next: ( Response ) =>
      {
        this.student = Response.content;
        console.log( this.student )
      }
    } )
  }
}
