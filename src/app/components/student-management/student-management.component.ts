import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { User } from 'src/app/models/Users';
interface StatCard
{
  icon: string;
  label: string;
  value: number;
  bg: string;
}

export interface Student
{
  id: string;
  studentCode: string;
  classId: string;
  khFirstName: string;
  khLastName: string;
  enFirstName: string;
  enLastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: {
    houseNumber: string | null;
    street: string;
    sangkat: string;
    khan: string;
    province: string;
    country: string;
  };
  status: boolean;
}

export interface ApiResponse
{
  content: Student[];
  number: number;
  size: number;
  totalPage: number;
  totalElement: number;
  hastPrevious: boolean;
  hastNext: boolean;
}
@Component( {
  selector: 'app-student-management',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
} )
export class StudentManagementComponent implements OnInit
{
  currentPage: number = 0;
  students: any[] = [];
  classess: any[] = [];
  maleCount: number = 0;
  totalCount: number = 0;
  feamleCount: number = 0;
  showStep: boolean = false;
  currentUserRole: string = '';
  currentStep = 1;
  selectedClass: any = '';
  studentForm!: FormGroup;
  searchQuery: string = '';
  filtterStudents: any[] = [];
  number: number = 1;
  size: number = 10;
  totalPage: number = 0;
  totalElement: number = 0;
  hastPrevious: boolean;
  hastNext: boolean;
  errorResponse: any[] = [];
  countStudentActive: number = 0;
  stats: StatCard[] = [
    { icon: 'fa-solid fa-users', label: 'Students Total', value: 0, bg: 'bg-blue-50' },
    { icon: 'fa-solid fa-venus', label: 'Students Female', value: 0, bg: 'bg-pink-50' },
    { icon: 'fa-solid fa-mars', label: 'Students Male', value: 0, bg: 'bg-orange-50' },
    { icon: 'fa-solid fa-users', label: 'Students Active', value: 0, bg: 'bg-green-50' },
  ];
  provinces: string[] = [ 'Kampong Thom', 'Kampong Cham', 'Kampot', 'Phnom Penh', 'Banteay Meanchey', 'Battambang', 'Kratie', ' Mondulkiri', 'Preah Sihanouk', 'Siem Reap', 'Tboung Khmum', 'Prey Veng', 'Svay Rieng', 'Takeo', 'Ratanak Kiri', 'Stung Treng', 'Preah Vihear', 'Kandal', 'Kompong Speu', 'Kep', 'Koh Kong', 'Kampong Chhnang', 'Oddar Meanchey', 'Pailin', 'Sihanoukville', 'Mondulkiri' ];

  constructor( private fb: FormBuilder, private router: Router, private studentsService: StudentsServiceService, private authService: AuthServiceService, private meta: Meta, private title: Title )
  {
    this.getAllStudents();
    this.studentForm = this.fb.group( {
      khFirstName: [ '' ],
      khLastName: [ '' ],
      enFirstName: [ '' ],
      enLastName: [ '' ],
      classId: [ '' ],
      gender: [ '' ],
      email: [ '' ],
      phoneNumber: [ '' ],
      dateOfBirth: [ '' ],
      enrollmentDate: [ '' ],
      status: [ true ],
      address: this.fb.group( {
        houseNumber: [ '' ],
        street: [ '' ],
        sangkat: [ '' ],
        khan: [ '' ],
        province: [ '' ],
        country: [ '' ]
      } )
    } );
  }
  ngOnInit (): void
  {
    this.meta.addTag( { name: 'description', content: 'Student Management' } );
    this.title.setTitle( 'Student Management' );
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUserRole = user.role;
    this.handleGetAllClassess();
  }
  pages: number[] = [];
  private getAllStudents ()
  {
    this.studentsService.getAllStudents( this.currentPage, this.size ).subscribe( {
      next: ( res: ApiResponse ) =>
      {
        this.students = res.content || [];
        this.filtterStudents = res.content || [];
        this.number = res.number;
        this.size = res.size;
        this.totalPage = res.totalPage;
        this.totalElement = res.totalElement;
        this.hastPrevious = res.hastPrevious;
        this.hastNext = res.hastNext;
        this.maleCount = 0;
        this.feamleCount = 0;

        this.pages = Array.from( { length: this.totalPage }, ( _, i ) => i );

        this.countStudentActive = this.students.filter( student => student.status === true ).length;

        this.students.forEach( student =>
        {
          if ( student.gender === 'M' ) this.maleCount++;
          else if ( student.gender === 'F' ) this.feamleCount++;
        } );
        this.stats = [
          { ...this.stats[ 0 ], value: this.students.length },
          { ...this.stats[ 1 ], value: this.feamleCount },
          { ...this.stats[ 2 ], value: this.maleCount },
          { ...this.stats[ 3 ], value: this.countStudentActive }
        ];
        // this.totalCount = this.students.length;
        // console.log( "Acitve", this.countStudentActive )
        // console.log( res )
      },
      error: ( err ) =>
      {
        this.errorResponse = err.message;
        console.log( "Error Response", this.errorResponse )
      }
    } );
  }
  // create students
  handleCreateStudent ()
  {
    if ( this.studentForm.invalid )
    {
      this.studentForm.markAllAsTouched();
      return;
    }
    // Prepare payload
    const payload = {
      ...this.studentForm.value,
      status: true,
    };
    // console.log("layload", payload);
    this.studentsService.createStudent( payload ).subscribe( {
      next: ( res: any ) =>
      {
        localStorage.removeItem( 'studentsCache' );
        localStorage.removeItem( 'studentsCache_expiry' );
        this.showStep = false;
        this.currentStep = 1;
        this.getAllStudents();
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">create student successfully</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      },
      error: ( err ) =>
      {
        Swal.fire( {
          icon: 'error',
          timer: 2500,
          iconColor: '#ef4444',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #ef4444;">មិនអាចបង្កើតបាន</span>ទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
        console.error( 'Create student error', err );
      }
    } );
  }

  handleGetAllClassess ()
  {
    this.studentsService.getAllClass( true, true ).subscribe( res =>
    {
      this.classess = res.content;
    } );
  }

  filterStudents ()
  {
    const keyword = this.searchQuery.toLowerCase();
    this.filtterStudents = this.students.filter( student =>
      student.khFirstName?.toLowerCase().includes( keyword ) ||
      student.khLastName?.toLowerCase().includes( keyword ) ||
      student.enFirstName?.toLowerCase().includes( keyword ) ||
      student.enLastName?.toLowerCase().includes( keyword ) ||
      student.studentCode?.toLowerCase().includes( keyword ) ||
      student.phoneNumber?.toLowerCase().includes( keyword ) ||
      student.address?.province?.toLowerCase().includes( keyword ) ||
      student.address?.country?.toLowerCase().includes( keyword )
    );
  }
  handlePreviousPage ()
  {
    if ( this.currentPage > 0 )
    {
      this.currentPage--;
      this.getAllStudents();
    }
  }

  handleNextPage ()
  {
    if ( this.currentPage < this.totalPage - 1 )
    {
      this.currentPage++;
      this.getAllStudents();
    }
  }
  handleToggleStep ()
  {
    this.showStep = !this.showStep;
  }
  nextStep ()
  {
    if ( this.currentStep < 2 )
      this.currentStep++;
  }
  prevStep ()
  {
    if ( this.currentStep > 1 )
      this.currentStep--;
  }
  setPage ( page: number )
  {
    this.currentPage = page;
    this.getAllStudents();
  }
}
