import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepartmentService } from 'src/app/core/services/department/department.service';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { SignupAdminPageService } from 'src/app/core/services/signup/signup-admin-page.service';
import { ClassTabComponent } from './components/class-tab/class-tab.component';
import { SemesterTabComponent } from './components/semester-tab/semester-tab.component';
import { environments } from '../../../environments/environments.dev';

@Component({
  selector: 'app-class-semester-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CourseFormComponent, ClassTabComponent, SemesterTabComponent],
  templateUrl: './class-semester.component.html',
  styleUrl: './class-semester.component.scss',
})

export class ClassSemesterComponent implements OnInit {
  activeTab = signal('DEPARTMENTS');
  tabs = ['DEPARTMENTS', 'CLASSES', 'SEMESTERS', 'SUBJECTS', 'COURSES'];
  modalCreateCourse: Boolean = false;
  formCreateDepartment!: FormGroup;
  formCreateSubject !: FormGroup;
  modalCreateDepartment: Boolean = false;
  modalCreateSubject: Boolean = false;
  imagePreview: String | ArrayBuffer | null = null;
  selectedFile!: File;
  getAllDepartment: any[] = [];
  getAllUser: any[] = [];
  getAllCourse: any[] = [];
  getAllSubject: any = [];
  countCourse: number = 0;
  countDepartment: Number = 0;
  currentUserRole: string = '';
  errorResponse: any[] = [];
  // constructor
  constructor(private fb: FormBuilder, private router: Router, private departmentClassService: DepartmentService, private signupAdminPageService: SignupAdminPageService) {
    this.formCreateDepartment = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
    })

    this.formCreateSubject = this.fb.group({
      departmentId: ['', Validators.required],
      image: [],
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.handleGetAllDepartment();
    this.handleGetAllCourse();
    this.handleGellAllSubject();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserRole = user.role;
  }
  // get all course
  private handleGetAllCourse() {
    this.departmentClassService.getAllCourse().subscribe({
      next: (Response) => {
        this.getAllCourse = Response.content;
        this.countCourse = Response.content.length;
        // console.log( this.getAllCourse )
      },
      error: (err) => {
        this.errorResponse = err.message;
        console.log("errorResponse", this.errorResponse);
      }
    })
  }
  // handle get all department
  private handleGetAllDepartment() {
    this.departmentClassService.getAllDepartment().subscribe({
      next: (res) => {
        this.getAllDepartment = res.data;
        this.countDepartment = res.data.length;
        console.log(res.data);
      },
      error: (err) => {
        this.errorResponse = err.message;
        console.log("errorResponse", this.errorResponse);
      }
    });
  }

  // handle get all subject
  countSubect: number = 0;
  private handleGellAllSubject() {
    this.departmentClassService.getAllSubject().subscribe({
      next: (Response) => {
        this.getAllSubject = Response.data;
        this.countSubect = Response.data.length;
        // console.log( "response subject", this.getAllSubject );
        // console.log( "count Response", this.countSubect )
      },
      error: (errorResponse) => {
        this.errorResponse = errorResponse.message;
        console.log("Error Response", this.errorResponse);
      }
    })
  }
  // handle create department
  private handleCreateDepartment() {
    if (this.formCreateDepartment.invalid) return;

    const formData = new FormData();

    formData.append('name', this.formCreateDepartment.get('name')?.value);
    formData.append('description', this.formCreateDepartment.get('description')?.value);

    const imageFile = this.formCreateDepartment.get('image')?.value;
    if (imageFile) {
      formData.append('file', imageFile);
    }

    this.departmentClassService.createDepartment(formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;"><span style="font-weight: bold;color: #10b981;">${res.message}</span></p>`,
          showConfirmButton: false,
        });

        this.handleGetAllDepartment();
        this.formCreateDepartment.reset();
        this.closeDepartmentModal();
      },

      error: (err) => {
        Swal.fire({
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showConfirmButton: false,
        });
      }
    });
  }

  // handle create subject
  private handleCreatesubjects() {
    console.log("formCreateDepartment", this.formCreateSubject.value);
    if (this.formCreateSubject.invalid) return;

    const formData = new FormData();

    formData.append('name', this.formCreateSubject.get('name')?.value);
    formData.append('description', this.formCreateSubject.get('description')?.value);
    formData.append('departmentId', this.formCreateSubject.get('departmentId')?.value);
    const imageFile = this.formCreateSubject.get('image')?.value;
    if (imageFile) {
      formData.append('thumbnail', imageFile);
    }

    this.departmentClassService.createSubjects(formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;"><span style="font-weight: bold;color: #10b981;">${res.message}</span></p>`,
          showConfirmButton: false,
        });

        this.handleGellAllSubject();
        this.formCreateSubject.reset();
        this.handleCloseSubjectModal();
      },

      error: (err) => {
        this.errorResponse = err.message
        Swal.fire({
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">${(this.errorResponse)}</span></p>`,
          showConfirmButton: false,
        });
      }
    });
  }
  // handle file for upload  department
  private handleOnFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formCreateDepartment.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // handle file for upload  subject
  private handleOnFileChangeSubject(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.formCreateSubject.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  //department creation handler
  openDepartmentModal() {
    this.modalCreateDepartment = true;
  }

  closeDepartmentModal() {
    this.modalCreateDepartment = false;
  }

  handleCloseSubjectModal() {
    this.modalCreateSubject = false;
  }

  handleSubjectModal() {
    this.modalCreateSubject = true;
  }

  handleCreateCourseModal() {
    this.modalCreateCourse = true;
  }

  hnadleCreateCourseModalClose() {
    this.modalCreateCourse = false;
  }
  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  protected readonly environments = environments;
}
