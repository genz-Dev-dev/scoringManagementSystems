import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
interface Department
{
  title: string;
  school: string;
  head: string;
  courses: number;
  avatar: string;
  icon: string;
  color: string;
}
interface Course
{
  id: string;
  name: string;
  level: string;
  department: string;
  credits: number;
  activeClasses: number;
  facultyLead: string;
  facultyAvatar: string;
}
@Component( {
  selector: 'app-class-semester-page',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './class-semester-page.component.html',
  styleUrl: './class-semester-page.component.scss',
} )

export class ClassSemesterPageComponent implements OnInit
{
  activeTab = signal( 'DEPARTMENT' );
  tabs = [ 'DEPARTMENT', 'CLASS', 'SEMESTER', 'COURSES', 'RESULTS' ];
  modalCreateClass = signal( false );
  formCreateClass!: FormGroup;
  formCreateDepartment!: FormGroup;
  formCreateSemester!: FormGroup;
  modalCreateDepartment: Boolean = false;
  imagePreview: String | ArrayBuffer | null = null;
  selectedFile!: File;
  getAllDepartment: any[] = [];
  getAllClass: any[] = [];
  getAllSemester: any[] = [];
  countSemester: number = 0;
  countClass: number = 0;
  countDepartment: Number = 0;
  showActiveOnly: boolean = false;
  currentUserRole: string = '';
  selectedDepartment: string = 'All';
  departments: Department[] = [
    {
      title: 'Computer Science',
      school: 'Engineering',
      head: 'Dr. Alice Smith',
      courses: 12,
      avatar: 'https://imgs.search.brave.com/c4wuuWaeZW5Q_ucX-hUSfoh492ttSjxmhnyIF_MeJxM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/YWR2ZXJ0aXNpbmcv/cGhvdG8tdmlkZW8u/d2VicA',
      icon: 'cpu',
      color: 'bg-blue-100'
    },
    {
      title: 'Business Admin',
      school: 'Business',
      head: 'Dr. John Doe',
      courses: 8,
      avatar: 'https://imgs.search.brave.com/UFN91E77kzkZQuIIPh9XEM0xZmdP8tRIjn-c2UENj4Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I2L0lt/YWdlX2NyZWF0ZWRf/d2l0aF9hX21vYmls/ZV9waG9uZS5wbmcv/MTI4MHB4LUltYWdl/X2NyZWF0ZWRfd2l0/aF9hX21vYmlsZV9w/aG9uZS5wbmc',
      icon: 'briefcase',
      color: 'bg-green-100'
    },
    // Add more departments as needed
  ];
  courses: Course[] = [
    {
      id: 'CS-302',
      name: 'Neural Networks',
      level: 'Level 300 Core',
      department: 'Computer Science',
      credits: 4.0,
      activeClasses: 12,
      facultyLead: 'Dr. Elena Volkov',
      facultyAvatar: 'https://ui-avatars.com/api/?name=Elena+Volkov',
    },
    {
      id: 'MA-101',
      name: 'Calculus I',
      level: 'Level 100 Core',
      department: 'Mathematics',
      credits: 3.0,
      activeClasses: 20,
      facultyLead: 'Dr. John Smith',
      facultyAvatar: 'https://ui-avatars.com/api/?name=John+Smith',
    },
  ];
  // constructor 
  constructor( private fb: FormBuilder, private router: Router, private departmentClassService: DepartmentClassServiceService )
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
      image: [ '', Validators.required ],
    } )

    this.formCreateSemester = this.fb.group( {
      name: [ '', Validators.required ],
      description: [ '', Validators.required ],
      startDate: [ '', Validators.required ],
      endDate: [ '', Validators.required ],
    } )
  }
  ngOnInit (): void
  {
    this.handleGetAllDepartment();
    this.handleGetAllClass();
    this.handleGetAllSemester();
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUserRole = user.role;
  }
  // Computed property to replace the pipe
  get filteredCourses (): Course[]
  {
    return this.courses.filter( ( course ) =>
    {
      const matchesActive = this.showActiveOnly ? course.activeClasses > 0 : true;
      const matchesDepartment =
        this.selectedDepartment === 'All' || course.department === this.selectedDepartment;
      return matchesActive && matchesDepartment;
    } );
  }
  // handle create department
  private handleCreateDepartment ()
  {
    if ( this.formCreateDepartment.invalid )
    {
      return;
    }
    const formData = new FormData();
    formData.append( 'name', this.formCreateDepartment.get( 'name' )?.value );
    formData.append( 'description', this.formCreateDepartment.get( 'description' )?.value );
    if ( this.selectedFile ) formData.append( 'image', this.selectedFile, this.selectedFile.name );
  }
  // handle file for upload  department
  private handleOnFileChange ( event: Event )
  {
    const file = ( event.target as HTMLInputElement ).files?.[ 0 ];
    if ( file )
    {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () =>
      {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL( file );
    }
  }
  //department creation handler
  openDepartmentModal ()
  {
    this.modalCreateDepartment = true;
  }
  // handle get all department
  private handleGetAllDepartment ()
  {
    this.departmentClassService.getAllDepartment().subscribe( {
      next: ( res ) =>
      {
        this.getAllDepartment = res.data;
        this.countDepartment = res.data.length;
      },
      error: ( err ) =>
      {
        console.log( err );
      }
    } );
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
  // handle get all class
  private handleGetAllClass (): void
  {
    this.departmentClassService.getAllClass().subscribe( {
      next: ( res ) =>
      {
        this.getAllClass = res.content;
        this.countClass = res.content.length;
        console.log( "count", this.countClass )
        console.log( "Class", this.getAllClass );
      },
      error: ( err ) =>
      {
        console.log( "ERROR:", err );
      }
    } );
  }
  // create department
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
        this.handleGetAllClass();
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
  // get all semester
  private handleGetAllSemester (): void
  {
    this.departmentClassService.getAllSemster().subscribe( {
      next: ( res ) =>
      {
        this.getAllSemester = res.data;
        this.countSemester = res.data.length;
        console.log( "count", this.countSemester )
        console.log( "Semester", this.getAllSemester );
      },
      error: ( err ) =>
      {
        console.log( "ERROR:", err );
      }
    } );
  }
  private handleCreateCourse ()
  {

  }
  // Actions
  setActiveTab ( tab: string ): void
  {
    this.activeTab.set( tab );
  }
}
