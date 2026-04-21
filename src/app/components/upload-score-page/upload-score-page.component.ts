import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
interface StudentScore
{
  id: string;
  name: string;
  score: number | null;
  grade: string | null;
}
@Component( {
  selector: 'app-upload-score-page',
  imports: [],
  templateUrl: './upload-score-page.component.html',
  styleUrl: './upload-score-page.component.scss',
} )
export class UploadScorePageComponent implements OnInit
{

  classes: any[] = [];
  courses: any[] = [];
  semesters: any[] = [];
  department: any = [];
  constructor( private router: Router, private departmentClassService: DepartmentClassServiceService, private studentService: StudentsServiceService )
  {

  }

  ngOnInit (): void
  {

    this.handleGetClass();
    this.handleGetAllSemester();
    this.handleGetAllCourse();
    this.handleGellDepartment();
    this.handleGetAllStudent();
  }

  filters = {
    department: 'Architecture & Design',
    class: 'Sophomore Studio A',
    course: 'DSGN-204 Theory',
    semester: 'Fall 2024',
  };

  students: StudentScore[] = [
    { id: 'AA-2024-001', name: 'Julianne Sterling', score: 94, grade: 'A' },
    { id: 'AA-2024-042', name: 'Marcus Thorne', score: 82, grade: 'B' },
    { id: 'AA-2024-069', name: 'Elena Vasquez', score: 75, grade: 'C' },
    { id: 'AA-2024-112', name: 'Simon Croft', score: null, grade: null },
    { id: 'AA-2024-145', name: 'Beatrice Cho', score: 98, grade: 'A+' },

  ];
  // handleGetAllClass
  private handleGetClass ()
  {
    this.departmentClassService.getAllClass().subscribe( {
      next: ( reponse ) =>
      {
        this.classes = reponse.content;
      },
      error: ( error ) =>
      {
        console.log( "errorResponse", error );
      }
    } )
  }
  // hanldegetAllSemester
  private handleGetAllSemester ()
  {
    this.departmentClassService.getAllSemster().subscribe( {
      next: ( reponse ) =>
      {
        this.semesters = reponse.data;
      },
      error: ( error ) =>
      {
        console.log( "errorResponse", error );
      }
    } )
  }
  // handleGetAllCourse
  private handleGetAllCourse ()
  {
    this.departmentClassService.getAllCourse().subscribe( {
      next: ( Response ) =>
      {
        this.courses = Response.content;
      },
      error: ( errorResponse ) =>
      {
        console.log( "errorResponse", errorResponse );
      }
    } )
  }
  // handleAllDepartment
  private handleGellDepartment ()
  {
    this.departmentClassService.getAllDepartment().subscribe( {
      next: ( Response ) =>
      {
        this.department = Response.data;
      },
      error ( errorResponse )
      {
        console.log( "errorResponse", errorResponse );
      }
    } )
  }
  // handle get all student 
  getAllStudent: any[] = [];
  errorResponse: any[] = [];
  private handleGetAllStudent ()
  {
    this.studentService.getAllStudents().subscribe( {
      next: ( Response ) =>
      {
        this.getAllStudent = Response.content;
        console.log( "Response", this.getAllStudent );
      }, error: ( erorr ) =>
      {
        this.errorResponse = erorr.message;
        console.log( "Error Response", this.errorResponse );
      }
    } )

  }
  get validatedCount () { return this.students.filter( s => s.grade ).length; }
  get pendingCount () { return this.students.filter( s => !s.grade ).length; }

  addEntry ()
  {
    this.students.push( { id: '', name: '', score: null, grade: null } );
  }

  gradeClass ( grade: string | null ): string
  {
    const map: Record<string, string> = {
      'A': 'badge badge-success', 'A+': 'badge badge-success',
      'B': 'badge badge-info', 'C': 'badge badge-warning',
    };
    return grade ? ( map[ grade ] ?? 'badge' ) : '';
  }

  onFileDropped ( event: DragEvent ) { /* handle CSV/XLSX parsing */ }
  saveDraft () { /* save to API */ }
  submitScores () { /* validate + submit */ }
}