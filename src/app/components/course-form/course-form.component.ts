import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SignupAdminPageService } from 'src/app/api/signup-admin-page/signup-admin-page.service';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
import { CourseServiceService } from 'src/app/api/course-service/course-service.service';
@Component( {
  selector: 'app-course-form',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
} )
export class CourseFormComponent implements OnInit
{
  days = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
  formCreateCourse: FormGroup;
  getAllUser: any[] = [];
  getAllSubject: any[] = [];
  getAllSemesters: any[] = [];
  constructor( private fb: FormBuilder, private signupAdminPageService: SignupAdminPageService, private departmentClassService: DepartmentClassServiceService, private courseService: CourseServiceService )
  {
    this.formCreateCourse = this.fb.group( {
      subjectId: [ '', Validators.required ],
      semesterId: [ '', Validators.required ],
      instructorId: [ '', Validators.required ],
      name: [ '', Validators.required ],
      description: [ '', Validators.required ],
      schedule: [ '', Validators.required ],
      startAt: [ '', Validators.required ],
      endAt: [ '', Validators.required ],
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
        console.error( err.message );
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
  // handle create course
  responseMessage: any = [];
  errorResponse: any = [];
  handleCreateCourse ()
  {
    if ( this.formCreateCourse.get( 'startAt' )?.value > this.formCreateCourse.get( 'endAt' )?.value || this.formCreateCourse.invalid ) return Swal.fire( {
      icon: 'warning',
      title: 'Error',
      text: 'Start time must be less than end time'
    } );
    this.courseService.createCourse( this.formCreateCourse.value ).subscribe( {
      next: ( Response ) =>
      {
        this.responseMessage = Response.message;
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">${ ( this.responseMessage ) } }</span></p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
        this.formCreateCourse.reset();
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">${ ( this.errorResponse ) }</span></p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      }
    } )
  }
  get schedules (): FormArray
  {
    return this.formCreateCourse.get( 'schedules' ) as FormArray;
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

}
