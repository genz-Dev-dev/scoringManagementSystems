import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { User } from 'src/app/models/Users';
interface StatCard {
  icon: string;
  label: string;
  value: number;
  bg: string;
}

export interface Student {
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

export interface ApiResponse {
  content: Student[];
  number: number;
  size: number;
  totalPage: number;
  totalElement: number;
}
@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent implements OnInit {
  students: any[] = [];
  classess: any[] = [];
  showStep: boolean = false;
  currentUserRole: string = '';
  currentStep = 1;
  selectedClass: any = '';
  studentForm!: FormGroup;
  stats: StatCard[] = [
    { icon: 'fa-solid fa-users', label: 'Students', value: 2000, bg: 'bg-blue-50' },
    { icon: 'fa-solid fa-venus', label: 'Female', value: 120, bg: 'bg-pink-50' },
    { icon: 'fa-solid fa-mars', label: 'Male', value: 2115, bg: 'bg-orange-50' },
    { icon: 'fa-solid fa-users', label: 'Staff', value: 82, bg: 'bg-teal-50' },
  ];

  constructor(private fb: FormBuilder, private router: Router, private studentsService: StudentsServiceService, private authService: AuthServiceService, private meta: Meta, private title: Title) {
    this.getAllStudents();
    // this.handleGetAllClassess();
    this.studentForm = this.fb.group({
      khFirstName: [''],
      khLastName: [''],
      enFirstName: [''],
      enLastName: [''],
      studentCode: [''],
      classId: [''],
      gender: [''],
      email: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      status: [true],
      address: this.fb.group({
        houseNumber: [''],
        street: [''],
        sangkat: [''],
        khan: [''],
        province: [''],
        country: ['']
      })
    });
  }
  ngOnInit() {
    this.meta.addTag({ name: 'description', content: 'Student Management' });
    this.title.setTitle('Student Management');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserRole = user.role;
    this.getAllStudents();
    this.handleGetAllClassess();
  }
  getAllStudents() {
    this.studentsService.getAllStudents().subscribe({
      next: (res: ApiResponse) => {
        this.students = res.content;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // create students
  handleCreateStudent() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    // Prepare payload
    const payload = {
      ...this.studentForm.value,
      status: true,
    };

    // console.log("layload", payload);

    this.studentsService.createStudent(payload).subscribe({
      next: (res: any) => {
        localStorage.removeItem('studentsCache');
        localStorage.removeItem('studentsCache_expiry');
        this.showStep = false;
        this.currentStep = 1;
        this.getAllStudents();

        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">create student successfully</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          timer: 2500,
          iconColor: '#ef4444',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #ef4444;">មិនអាចបង្កើតបាន</span>ទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
        console.error('Create student error', err);
      }
    });
  }

  handleGetAllClassess() {
    this.studentsService.getAllClass(true, true).subscribe(res => {
      this.classess = res.data;
    });
  }

  handleToggleStep() {
    this.showStep = !this.showStep;
  }
  nextStep() {
    if (this.currentStep < 2)
      this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1)
      this.currentStep--;
  }
}
