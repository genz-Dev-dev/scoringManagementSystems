import { Component, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentService } from 'src/app/core/services/department/department.service';

@Component({
  selector: 'app-semester-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './semester-tab.component.html',
  styleUrl: './semester-tab.component.scss'
})
export class SemesterTabComponent implements OnInit {
  @Input() currentUserRole: string = '';

  formCreateSemester!: FormGroup;
  getAllSemester: any[] = [];
  countSemester: number = 0;
  errorResponse: any;

  constructor(
    private fb: FormBuilder,
    private departmentClassService: DepartmentService
  ) {
    this.formCreateSemester = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.handleGetAllSemester();
  }

  handleGetAllSemester(): void {
    this.departmentClassService.getAllSemster().subscribe({
      next: (res) => {
        this.getAllSemester = res.data;
        this.countSemester = res.data.length;
      },
      error: (err) => {
        this.errorResponse = err.message;
        console.log("ERROR:", err);
      }
    });
  }

  handleCreateSemester() {
    if (this.formCreateSemester.invalid) {
      return;
    }
    this.departmentClassService.createSemester(this.formCreateSemester.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">បង្កើតថ្នាក់</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
        this.handleGetAllSemester();
        this.formCreateSemester.reset();
      },
      error: (err) => {
        console.log("ERROR:", err);
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

  handleResetForm() {
    this.formCreateSemester.reset();
  }
}
