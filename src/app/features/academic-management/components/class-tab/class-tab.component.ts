import { Component, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentService } from 'src/app/core/services/department/department.service';

@Component({
  selector: 'app-class-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './class-tab.component.html',
  styleUrl: './class-tab.component.scss'
})
export class ClassTabComponent implements OnInit {
  @Input() currentUserRole: string = '';
  @Input() getAllDepartment: any[] = [];

  formCreateClass!: FormGroup;
  getAllClass: any[] = [];
  countClass: number = 0;
  countDepartment: number = 0;
  errorResponse: any;

  constructor(
    private fb: FormBuilder,
    private departmentClassService: DepartmentService
  ) {
    this.formCreateClass = this.fb.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      academicYear: ['', Validators.required],
      generation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.handleGetAllClass();
    this.countDepartment = this.getAllDepartment.length;
  }

  handleGetAllClass(): void {
    this.departmentClassService.getAllClass().subscribe({
      next: (res) => {
        this.getAllClass = res.content;
        this.countClass = res.content.length;
      },
      error: (err) => {
        this.errorResponse = err.message;
        console.log("ERROR:", this.errorResponse);
      }
    });
  }

  handleCreateClasses() {
    if (this.formCreateClass.invalid) {
      return;
    }
    this.departmentClassService.createClass(this.formCreateClass.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.handleGetAllClass();
        this.formCreateClass.reset();
        // We'll need a way to close the modal. Since the modal is in the template using native dialog.
        const modal = document.getElementById('my_modal_3') as any;
        if (modal) modal.close();
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
      }
    });
  }
}
