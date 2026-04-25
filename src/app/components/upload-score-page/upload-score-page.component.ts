import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
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
  imports: [ ReactiveFormsModule ],
  templateUrl: './upload-score-page.component.html',
  styleUrl: './upload-score-page.component.scss',
} )
export class UploadScorePageComponent implements OnInit
{

  classes: any[] = [];
  getAllsubject: any[] = [];
  semesters: any[] = [];
  department: any = [];
  formInputClassId: FormGroup;
  constructor( private router: Router, private departmentClassService: DepartmentClassServiceService, private studentService: StudentsServiceService, private fb: FormBuilder )
  {
    this.formInputClassId = this.fb.group( {
      classId: [ '', Validators.required ]
    } )
  }

  ngOnInit (): void
  {

    this.handleGetClass();
    this.handleGetAllSemester();
    this.handleGetAllSubject();
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

  public handlefilterStudentbyClassId ()
  {
    if ( this.formInputClassId.invalid ) return;
    this.studentService.filterStudentByClassId( this.formInputClassId.value ).subscribe( {
      next: ( reponse: any ) =>
      {
        this.getAllStudent = reponse.data;
      }, error: ( erorr ) =>
      {
        this.errorResponse = erorr.message;
      }
    } )
  }
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
        this.errorResponse = error.message;
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
        this.errorResponse = error.message;
      }
    } )
  }
  // handleGetAllCourse
  private handleGetAllSubject ()
  {
    this.departmentClassService.getAllSubject().subscribe( {
      next: ( Response ) =>
      {
        this.getAllsubject = Response.data;
      },
      error: ( errorResponse ) =>
      {
        this.errorResponse = errorResponse.message;
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
        this.errorResponse = errorResponse.message;
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
      }, error: ( erorr ) =>
      {
        this.errorResponse = erorr.message;
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