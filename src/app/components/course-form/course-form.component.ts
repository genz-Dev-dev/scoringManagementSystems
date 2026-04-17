import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SignupAdminPageService } from 'src/app/api/signup-admin-page/signup-admin-page.service';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
@Component( {
  selector: 'app-course-form',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
} )
export class CourseFormComponent implements OnInit
{
  days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

  form: FormGroup;
  getAllUser: any[] = [];
  getAllSubject: any[] = [];
  getAllSemesters: any[] = [];
  constructor( private fb: FormBuilder, private signupAdminPageService: SignupAdminPageService, private departmentClassService: DepartmentClassServiceService )
  {
    this.form = this.fb.group( {
      subjectId: [ '' ],
      semesterId: [ '' ],
      instructorId: [ '' ],
      name: [ '' ],
      description: [ '' ],
      schedule: [ '' ],
      startAt: [ '' ],
      endAt: [ '' ],
      schedules: this.fb.array( [] )
    } );
  }

  ngOnInit (): void
  {

    this.getAllUsers();
    this.handleGetAllSemester();
    this.handleGetAllSubjectId();
  }
  // get all users
  private getAllUsers ()
  {
    this.signupAdminPageService.getAllUsers().subscribe( {
      next: ( Response ) =>
      {
        this.getAllUser = Response.content;
      },
      error: ( err ) =>
      {
        console.log( err );
      }
    } )
  }
  // get all semester
  private handleGetAllSemester ()
  {
    this.departmentClassService.getAllSemster().subscribe( {
      next: ( Response ) =>
      {
        this.getAllSemesters = Response.data;
      },
      error: ( err ) =>
      {
        console.log( err );
      }
    } )
  }
  // get all subject id
  private handleGetAllSubjectId ()
  {
    this.departmentClassService.getAllSubject().subscribe( {
      next: ( Response ) =>
      {
        this.getAllSubject = Response.data;
      },
      error: ( errorResponse ) =>
      {
        console.log( errorResponse );
      }

    } )
  }
  get schedules (): FormArray
  {
    return this.form.get( 'schedules' ) as FormArray;
  }
  //  addSchedule as array
  addSchedule ()
  {
    this.schedules.push(
      this.fb.group( {
        dayOfWeek: [ 'Monday' ],
        startTime: [ '08:00' ],
        endTime: [ '09:30' ],
        room: [ '' ]
      } )
    );
  }
  // removeSchedule
  removeSchedule ( index: number )
  {
    this.schedules.removeAt( index );
  }

  get count (): number
  {
    return this.schedules.length;
  }

  submit ()
  {
    console.log( this.form.value );
  }
}
