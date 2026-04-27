import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TokenServiceService } from 'src/app/core/services/token/token.service.service';
import { StudentService } from 'src/app/core/services/student/student.service';
import {Student} from '../../models/student.model';
import {StatsCard} from '../../models/stats-card.model';
import {StatsCardComponent} from '../../shared/components/stats-card/stats-card.component';
import {ImportStudentModalComponent} from './components/import-student-modal-dialog/import-student-modal.component';
import {ClassService} from '../../core/services/class/class.service';
import {Pagination} from '../../models/pagination.model';
import {DepartmentService} from '../../core/services/department/department.service';
import {Department} from '../../models/department.model';
import {Class} from '../../models/class.model';

@Component( {
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StatsCardComponent, ImportStudentModalComponent],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
} )
export class StudentManagementComponent implements OnInit {
  student: any[] = [];
  classes: any[] = [];
  maleCount: number = 0;
  femaleCount: number = 0;
  showStep: boolean = false;
  currentUserRole: string = '';
  currentStep = 1;
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
  isImportModalOpen: boolean = false;
  departments!: Department[];
  selectedDepartment: string;
  selectedClass: string;
  classFilter: Class[];

  stats: StatsCard[] = [
    { id: 1, icon: 'fa-solid fa-users', title: 'Students Total', total: 0, secondary: 'bg-blue-50', primary: "text-blue-500" },
    { id: 2, icon: 'fa-solid fa-venus', title: 'Students Female', total: 0, secondary: 'bg-pink-50', primary: "text-pink-500" },
    { id: 3, icon: 'fa-solid fa-mars', title: 'Students Male', total: 0, secondary: 'bg-orange-50', primary: "text-orange-500" },
    { id: 4, icon: 'fa-solid fa-users', title: 'Students Active', total: 0, secondary: 'bg-green-50', primary: "text-green-500" },
  ];

  constructor(private fb: FormBuilder,
              private router: Router,
              private studentsService: StudentService,
              private authService: TokenServiceService,
              private classService: ClassService,
              private meta: Meta,
              private title: Title,
              private departmentService: DepartmentService
  ) {
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

  ngOnInit (): void {
    this.meta.addTag( { name: 'description', content: 'Student Management' } );
    this.title.setTitle( 'Student Management' );
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUserRole = user.role;
    this.handleGetAllClasses();
    this.handleGetAllDepartments();
  }

  private getAllStudents () {
    this.studentsService.getAllStudents().subscribe({
      next: ( res: Pagination<Student[]> ) => {
        this.student = res.content || [];
        this.filtterStudents = res.content || [];
        this.number = res.number;
        this.size = res.size;
        this.totalPage = res.totalPage;
        this.totalElement = res.totalElement;
        this.hastPrevious = res.hasPrevious;
        this.hastNext = res.hasNext;
        this.maleCount = 0;
        this.femaleCount = 0;
        this.countStudentActive = this.student.filter(student => student.status === true ).length;
        this.student.forEach(student => {
          if ( student.gender === 'M' ) this.maleCount++;
          else if ( student.gender === 'F' ) this.femaleCount++;
        });

        this.stats = [
          { ...this.stats[ 0 ], total: this.student.length },
          { ...this.stats[ 1 ], total: this.femaleCount },
          { ...this.stats[ 2 ], total: this.maleCount },
          { ...this.stats[ 3 ], total: this.countStudentActive }
        ];

      },
      error: ( err ) => {
        this.errorResponse = err.message;
        console.log( "Error Response", this.errorResponse )
      }
    });
  }

  // create students
  handleCreateStudent () {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.studentForm.value,
      status: true,
    };

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

      error: ( err ) => {
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
    });
  }

  handleGetAllDepartments() {
    return this.departmentService
      .getAllDepartment().subscribe(res => res.success ? this.departments = res.data : []);
  }

  handleImportStudentFromExcel(event: any) {
    const form = new FormData();
    form.append("file" , event.file);
    form.append("classId" , event.classId);
    this.classService.importStudentFromExcel(form).subscribe((res => {
      if(res.success) {
        this.getAllStudents();
        this.isImportModalOpen = false;
      }
    }));
  }

  async handleExportStudent() {
    const { value: classId } = await Swal.fire({
      title: 'Select Class to Export',
      input: 'select',
      inputOptions: this.classes.reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
      }, {}),
      inputPlaceholder: 'Select a class',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve(null);
          } else {
            resolve('You need to select a class!');
          }
        });
      }
    });

    if (classId) {
      this.studentsService.exportStudent(classId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'students.xlsx';
          link.click();
          window.URL.revokeObjectURL(url);
          link.remove();
        },
        error: (err) => {
          console.error('Export student error', err);
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Was not able to export students.',
            timer: 2500,
            showConfirmButton: false
          });
        }
      });
    }
  }

  handleGetAllClasses () {
    this.studentsService.getAllClass( true, true ).subscribe( res => {
      this.classes = res.content;
    } );
  }

  handleFilterStudentByClassId(classId: string) {

  }

  handleFilterClassByDepartmentId(departmentId: string) {
    this.classFilter =  this.classes
      .filter((clazz) => clazz.departmentId === departmentId);
    return this.classFilter;
  }

  filterStudents () {
    const keyword = this.searchQuery.toLowerCase();
    this.filtterStudents = this.student.filter(student =>
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

  handlePreviousPage () {
    if ( this.number > 1 )
    {
      this.number--;
      this.getAllStudents();
    }
  }

  handleFilterStudentNextPage () {
    if ( this.number < this.totalPage ) {
      this.number++;
      this.getAllStudents();
    }
  }

  handleToggleStep () {
    this.showStep = !this.showStep;
  }

  nextStep () {
    if ( this.currentStep < 2 )
      this.currentStep++;
  }

  prevStep () {
    if ( this.currentStep > 1 )
      this.currentStep--;
  }

  handleCloseModal(event: Event) {
    this.isImportModalOpen = false;
  }

}
