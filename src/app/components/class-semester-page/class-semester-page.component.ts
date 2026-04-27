import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
import { CourseFormComponent } from '../course-form/course-form.component';
import { SignupAdminPageService } from 'src/app/api/signup-admin-page/signup-admin-page.service';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import { environments } from 'src/environments/environments.dev';
import { SystemLogPageComponent } from '../system-log-page/system-log-page.component';
import { ApiResponse, Department, ClassResponse } from 'src/app/models/Department.models';
import { PageResponse } from 'src/app/models/PageResponse.model';
@Component( {
  selector: 'app-class-semester-page',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, CourseFormComponent ],
  templateUrl: './class-semester-page.component.html',
  styleUrl: './class-semester-page.component.scss',
} )

export class ClassSemesterPageComponent implements OnInit
{
  activeTab = signal( 'DEPARTMENTS' );
  tabs = [ 'DEPARTMENTS', 'CLASSES', 'SEMESTERS', 'SUBJECTS', 'COURSES' ];
  modalCreateClass = signal( false );
  modalCreateCourse: Boolean = false;
  formCreateClass!: FormGroup;
  formCreateDepartment!: FormGroup;
  formCreateSubject !: FormGroup;
  formCreateSemester!: FormGroup;
  modalCreateDepartment: Boolean = false;
  modalCreateSubject: Boolean = false;
  imagePreview: String | ArrayBuffer | null = null;
  selectedFile!: File;
  getAllDepartment: Department[] = [];
  getAllUser: any[] = [];
  getAllClass: ClassResponse[] = [];
  pageResponse !: PageResponse<ClassResponse[]>;
  getAllCourse: any[] = [];
  getAllSubject: any = [];
  getAllSemester: any[] = [];
  countSemester: number = 0;
  countClass: number = 0;
  countCourse: number = 0;
  countDepartment: Number = 0;
  currentUserRole: string = '';
  errorResponse: any[] = [];
  // constructor 
  constructor( private fb: FormBuilder, private router: Router, private departmentClassService: DepartmentClassServiceService, private signupAdminPageService: SignupAdminPageService )
  {
    this.formCreateClass = this.fb.group( {
      name: [ '', Validators.required ],
      departmentId: [ '', Validators.required ],
      academicYear: [ '', Validators.required ],
      generation: [ '', Validators.required ]
    } )
    this.formCreateDepartment = this.fb.group( {
      name: [ '', Validators.required ],
      description: [ '', Validators.required ],
      image: [ null, Validators.required ],
    } )

    this.formCreateSemester = this.fb.group( {
      name: [ '', Validators.required ],
      description: [ '', Validators.required ],
      startDate: [ '', Validators.required ],
      endDate: [ '', Validators.required ],
    } )

    this.formCreateSubject = this.fb.group( {
      departmentId: [ '', Validators.required ],
      image: [],
      name: [ '', Validators.required ],
      description: [ '', Validators.required ]
    } )
  }
  ngOnInit (): void
  {
    this.handleGetAllDepartment();
    this.handleGetAllClass();
    this.handleGetAllSemester();
    this.handleGetAllCourse();
    this.handleGellAllSubject();
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUserRole = user.role;
  }
  // get all course
  private handleGetAllCourse ()
  {
    this.departmentClassService.getAllCourse().subscribe( {
      next: ( Response ) =>
      {
        this.getAllCourse = Response.content;
        this.countCourse = Response.content.length;
        // console.log( this.getAllCourse )
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        console.log( "errorResponse", this.errorResponse );
      }
    } )
  }
  // handle get all department
  private handleGetAllDepartment ()
  {
    this.departmentClassService.getAllDepartment().subscribe( {
      next: ( res: ApiResponse<Department[]> ) =>
      {
        this.getAllDepartment = res.data;
        this.countDepartment = res.data.length;
        // console.log( "department", this.getAllDepartment );
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        console.log( "errorResponse", this.errorResponse );
      }
    } );
  }
  // handle get all class
  currentPage: number = 0;
  pageSize: number = 10;
  private handleGetAllClass (): void
  {
    this.departmentClassService.getAllClassPagegination( this.currentPage, this.pageSize ).subscribe( {
      next: ( res: PageResponse<ClassResponse[]> ) =>
      {
        this.pageResponse = res;
        this.getAllClass = res.content;
        // console.log( "count", this.pageResponse )
        // console.log( "Class", this.getAllClass );
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        console.log( "ERROR:", this.errorResponse );
      }
    } );
  }
  // get all semester
  private handleGetAllSemester (): void
  {
    this.departmentClassService.getAllSemster().subscribe( {
      next: ( res ) =>
      {
        this.getAllSemester = res.data;
        this.countSemester = res.data.length;
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        console.log( "ERROR:", err );
      }
    } );
  }
  // handle get all subject 
  countSubect: number = 0;
  private handleGellAllSubject ()
  {
    this.departmentClassService.getAllSubject().subscribe( {
      next: ( Response ) =>
      {
        this.getAllSubject = Response.data;
        this.countSubect = Response.data.length;
        // console.log( "response subject", this.getAllSubject );
        // console.log( "count Response", this.countSubect )
      },
      error: ( errorResponse ) =>
      {
        this.errorResponse = errorResponse.message;
        console.log( "Error Response", this.errorResponse );
      }
    } )
  }
  // handle create department
  private handleCreateDepartment ()
  {
    if ( this.formCreateDepartment.invalid ) return;

    const formData = new FormData();

    formData.append( 'name', this.formCreateDepartment.get( 'name' )?.value );
    formData.append( 'description', this.formCreateDepartment.get( 'description' )?.value );

    const imageFile = this.formCreateDepartment.get( 'image' )?.value;
    if ( imageFile )
    {
      formData.append( 'image', imageFile );
    }

    this.departmentClassService.createDepartment( formData ).subscribe( {
      next: ( res ) =>
      {
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;"><span style="font-weight: bold;color: #10b981;">${ res.message }</span></p>`,
          showConfirmButton: false,
        } );

        this.handleGetAllDepartment();
        this.formCreateDepartment.reset();
        this.closeDepartmentModal();
      },

      error: ( err ) =>
      {
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showConfirmButton: false,
        } );
      }
    } );
  }

  // handle create subject
  private handleCreatesubjects ()
  {
    console.log( "formCreateDepartment", this.formCreateSubject.value );
    if ( this.formCreateSubject.invalid ) return;

    const formData = new FormData();

    formData.append( 'name', this.formCreateSubject.get( 'name' )?.value );
    formData.append( 'description', this.formCreateSubject.get( 'description' )?.value );
    formData.append( 'departmentId', this.formCreateSubject.get( 'departmentId' )?.value );
    const imageFile = this.formCreateSubject.get( 'image' )?.value;
    if ( imageFile )
    {
      formData.append( 'image', imageFile );
    }

    this.departmentClassService.createSubjects( formData ).subscribe( {
      next: ( res ) =>
      {
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;"><span style="font-weight: bold;color: #10b981;">${ res.message }</span></p>`,
          showConfirmButton: false,
        } );

        this.handleGellAllSubject();
        this.formCreateSubject.reset();
        this.handleCloseSubjectModal();
      },

      error: ( err ) =>
      {
        this.errorResponse = err.message
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">${ ( this.errorResponse ) }</span></p>`,
          showConfirmButton: false,
        } );
      }
    } );
  }
  // handle file for upload  department
  private handleOnFileChange ( event: Event )
  {
    const file = ( event.target as HTMLInputElement ).files?.[ 0 ];
    if ( file )
    {
      this.formCreateDepartment.get( 'image' )?.setValue( file );
      const reader = new FileReader();
      reader.onload = () =>
      {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL( file );
    }
  }

  // handle file for upload  subject
  private handleOnFileChangeSubject ( event: Event )
  {
    const file = ( event.target as HTMLInputElement ).files?.[ 0 ];
    if ( file )
    {
      this.formCreateSubject.get( 'image' )?.setValue( file );
      const reader = new FileReader();
      reader.onload = () =>
      {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL( file );
    }
  }

  // handle create classes
  private handleCreateClasses ()
  {
    if ( this.formCreateClass.invalid )
    {
      return;
    }
    this.departmentClassService.createClass( this.formCreateClass.value ).subscribe( {
      next: ( res ) =>
      {
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
        this.handleGetAllClass();
        this.formCreateClass.reset();
      },
      error: ( err ) =>
      {
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      }
    } )
  }
  // create semester
  private handleCreateSemester ()
  {
    if ( this.formCreateSemester.invalid )
    {
      return;
    }
    this.departmentClassService.createSemester( this.formCreateSemester.value ).subscribe( {
      next: ( res ) =>
      {
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
        this.handleGetAllSemester();
      },
      error: ( err ) =>
      {
        console.log( "ERROR:", err );
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      }
    } )
  }
  changePage ( page: number ): void
  {
    if ( page < 0 || page >= ( this.pageResponse?.totalPage ?? 0 ) )
    {
      return;
    }

    this.currentPage = page;
    this.handleGetAllClass();
  }
  get totalPagesArray (): number[]
  {
    if ( !this.pageResponse ) return [];
    return Array.from(
      { length: this.pageResponse.totalPage },
      ( _, i ) => i + 1
    );
  }

  get visiblePages (): ( number | '...' )[]
  {
    const total = this.pageResponse?.totalPage ?? 0;
    const current = this.pageResponse?.number ?? 0; // 0-based
    const pages: ( number | '...' )[] = [];

    if ( total <= 5 )
    {
      // Show all pages if 5 or fewer
      return Array.from( { length: total }, ( _, i ) => i + 1 );
    }
    pages.push( 1 ); // Always show first page

    if ( current > 2 )
    {
      pages.push( '...' );
    }
    // Show current and neighbors
    for ( let i = current - 1; i <= current + 1; i++ )
    {
      if ( i > 1 && i < total )
      {
        pages.push( i + 1 ); // convert 0-based to display
      }
    }

    if ( current < total - 3 )
    {
      pages.push( '...' );
    }
    pages.push( total ); // Always show last page
    return pages;
  }

  //department creation handler
  openDepartmentModal ()
  {
    this.modalCreateDepartment = true;
  }
  closeDepartmentModal ()
  {
    this.modalCreateDepartment = false;
  }
  handleCloseSubjectModal ()
  {
    this.modalCreateSubject = false;
  }
  handleSubjectModal ()
  {
    this.modalCreateSubject = true;
  }
  handleCreateCourseModal ()
  {
    this.modalCreateCourse = true;
  }
  hnadleCreateCourseModalClose ()
  {
    this.modalCreateCourse = false;
  }
  // Actions
  setActiveTab ( tab: string ): void
  {
    this.activeTab.set( tab );
  }
}
