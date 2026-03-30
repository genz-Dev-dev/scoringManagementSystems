import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Department {
  title: string;
  school: string;
  head: string;
  courses: number;
  avatar: string;
  icon: string;
  color: string;
}
interface Course {
  id: string;
  name: string;
  level: string;
  department: string;
  credits: number;
  activeClasses: number;
  facultyLead: string;
  facultyAvatar: string;
}
@Component({
  selector: 'app-class-semester-page',
  imports: [CommonModule],
  templateUrl: './class-semester-page.component.html',
  styleUrl: './class-semester-page.component.scss',
})

export class ClassSemesterPageComponent {
  activeTab = signal('DEPARTMENT');
  tabs = ['DEPARTMENT', 'CLASS', 'SEMESTER', 'COURSES', 'RESULTS'];
  modalCreateClass = signal(false);
  formCreateClass!: FormGroup;

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
    // Add more courses as needed
  ];

  // Filters bound to template
  showActiveOnly: boolean = false;
  selectedDepartment: string = 'All';

  // Computed property to replace the pipe
  get filteredCourses(): Course[] {
    return this.courses.filter((course) => {
      const matchesActive = this.showActiveOnly ? course.activeClasses > 0 : true;
      const matchesDepartment =
        this.selectedDepartment === 'All' || course.department === this.selectedDepartment;
      return matchesActive && matchesDepartment;
    });
  }

  // Optional: department creation handler
  createDepartment() {
    console.log('Create New Department clicked');
  }

  addNewCourse() {
    console.log('Add New Course clicked');
  }
  // constructor 
  constructor(private fb: FormBuilder, private router: Router) {
    this.formCreateClass = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
    })
  }
  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
  toggleModalCreateClass() {
    this.modalCreateClass.set(!this.modalCreateClass());
  }
}
