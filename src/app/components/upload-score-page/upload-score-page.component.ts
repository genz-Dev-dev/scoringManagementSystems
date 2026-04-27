import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { ScoreUploadServiceService } from 'src/app/api/score-upload-service/score-upload-service.service';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
import { GetAllStudentResponse } from 'src/app/models/Students.models';
import { ClassResponse, ApiResponse } from 'src/app/models/Department.models';
@Component( {
  selector: 'app-upload-score-page',
  imports: [ ReactiveFormsModule ],
  templateUrl: './upload-score-page.component.html',
  styleUrl: './upload-score-page.component.scss',
} )
export class UploadScorePageComponent implements OnInit
{
  classes: ClassResponse[] = [];
  getAllsubject: any[] = [];
  getAllStudent: GetAllStudentResponse[] = [];
  semesters: any[] = [];
  department: any = [];
  formInputClassId: FormGroup;
  errorResponse: any;
  currentUser: any = [];
  constructor( private router: Router, private departmentClassService: DepartmentClassServiceService, private studentService: StudentsServiceService, private fb: FormBuilder, private scoreUploadService: ScoreUploadServiceService )
  {
    this.formInputClassId = this.fb.group( {
      classId: [ '', Validators.required ],
      departmentId: [ '', ],
      semesterId: [ '', ],
      subjectId: [ '', ],
    } )
  }

  ngOnInit (): void
  {

    this.handleGetClass();
    this.handleGetAllSemester();
    this.handleGetAllSubject();
    this.handleGellDepartment();
    this.handleGetAllStudent();
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUser = user.userId;
  }

  public handlefilterStudentbyClassId ()
  {
    if ( this.formInputClassId.invalid ) return;
    this.studentService.filterStudentByClassId( this.formInputClassId.value ).subscribe( {
      next: ( reponse: any ) =>
      {
        this.getAllStudent = reponse.data;
        // console.log( this.getAllStudent )
      }, error: ( erorr: any ) =>
      {
        this.errorResponse = erorr.message;
      }
    } )
  }
  // handleGetAllClass
  private handleGetClass ()
  {
    this.departmentClassService.getAllClass().subscribe( {
      next: ( reponse: ApiResponse<ClassResponse[]> ) =>
      {
        this.classes = reponse.data;
        // console.log( this.classes, 'classes' )
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
  private handleGetAllStudent ()
  {
    this.studentService.getAllStudents().subscribe( {
      next: ( Response ) =>
      {
        this.getAllStudent = Response.content;
        // console.log( this.getAllStudent )
      }, error: ( erorr ) =>
      {
        this.errorResponse = erorr.message;
      }
    } )

  }
  @ViewChildren( 'cellInput' ) inputs!: QueryList<ElementRef<HTMLInputElement>>;

  handleKey ( event: KeyboardEvent, rowIndex: number )
  {
    const inputsArray = this.inputs.toArray();
    const lastIndex = inputsArray.length - 1;

    switch ( event.key )
    {
      case 'ArrowDown':
      case 'Enter':
        event.preventDefault();
        if ( inputsArray[ rowIndex + 1 ] )
        {
          inputsArray[ rowIndex + 1 ].nativeElement.focus();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if ( inputsArray[ rowIndex - 1 ] )
        {
          inputsArray[ rowIndex - 1 ].nativeElement.focus();
        }
        break;

      case 'PageDown': {
        event.preventDefault();
        const nextIndex = Math.min( rowIndex + 10, lastIndex );
        inputsArray[ nextIndex ].nativeElement.focus();
        break;
      }
      case 'PageUp': {
        event.preventDefault();
        const prevIndex = Math.max( rowIndex - 10, 0 );
        inputsArray[ prevIndex ].nativeElement.focus();
        break;
      }
    }
  }
  limitValue ( event: Event ): void
  {
    const input = event.target as HTMLInputElement;
    let value = parseInt( input.value, 10 );

    if ( isNaN( value ) )
    {
      value = 0;
    }

    if ( value < 0 )
    {
      value = 0;
    }
    if ( value > 100 )
    {
      value = 100;
    }
    input.value = value.toString();
  }
  gradeClass ( grade: string | null ): string
  {
    const map: Record<string, string> = {
      'A': 'badge badge-success', 'A+': 'badge badge-success',
      'B': 'badge badge-info', 'C': 'badge badge-warning',
    };
    return grade ? ( map[ grade ] ?? 'badge' ) : '';
  }
  studentScores: any[] = [];

  // In component
  onScoreChange ( event: Event, studentId: string ): void
  {
    const input = event.target as HTMLInputElement;
    let value = parseInt( input.value, 10 );

    if ( isNaN( value ) || value < 0 ) value = 0;
    if ( value > 100 ) value = 100;
    input.value = value.toString(); // clamp in place

    const existing = this.studentScores.find( s => s.studentId === studentId );
    if ( existing )
    {
      existing.score = value;
    } else
    {
      this.studentScores.push( { studentId, score: value } );
    }
  }

  handleSubmit ()
  {
    const form = this.formInputClassId.value;
    const payload = this.studentScores.map( s => ( {
      semesterId: form.semesterId,
      subjectId: form.subjectId,
      studentId: s.studentId,
      userId: this.currentUser,
      score: s.score,
      version: 1,
      status: true
    } ) );

    this.scoreUploadService.createScore( payload ).subscribe( {
      next: ( Response ) =>
      {
        Swal.fire( {
          icon: 'success',
          title: 'Score uploaded successfully',
          showConfirmButton: true,
          confirmButtonText: 'OK',
        } ).then( ( result ) =>
        {
          if ( result.isConfirmed )
          {
            this.router.navigate( [ "/list-score" ] );
          }
        } )
      }, error: ( error ) =>
      {
        Swal.fire( {
          icon: 'error',
          title: 'Score upload failed',
          showConfirmButton: false,
          timer: 1500
        } )
      }
    } )

  }
  onFileDropped ( event: DragEvent ) { /* handle CSV/XLSX parsing */ }
  saveDraft () { /* save to API */ }
  submitScores () { /* validate + submit */ }

  handleNavigation ( url: string )
  {
    this.router.navigate( [ url ] );
  }
}