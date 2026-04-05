import { Component, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolePermissionServiceService } from 'src/app/api/role-permission-service/role-permission-service.service';
@Component({
  selector: 'app-permission-admin-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permission-admin-page.component.html',
  styleUrl: './permission-admin-page.component.scss',
})
export class PermissionAdminPageComponent implements OnInit {
  activeTab = signal('Results');
  tabs = ['PERMISSION', 'ROLE'];
  permissionForm!: FormGroup;
  rolesList: any[] = [];
  permissionList: any[] = [];
  ModalPermission = signal(false);
  currentUserRole: string = '';
  constructor(private fb: FormBuilder, private router: Router, private rolePermissionService: RolePermissionServiceService) {
    this.permissionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      module: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.currentUserRole = user.role;
    this.getAllPermission();
  }
  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
  showModalPermission() {
    this.ModalPermission.set(true);
  }
  hideModalPermission() {
    this.ModalPermission.set(false);
  }


  public createPermission() {
    this.rolePermissionService.createPermission(this.permissionForm.value).subscribe({
      next: (res) => {
        this.permissionList = res.data;
        this.hideModalPermission();
        this.getAllPermission();
        Swal.fire({
          title: 'Success',
          text: 'Permission created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Permission creation failed',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  public getAllPermission() {
    this.rolePermissionService.getAllPermission().subscribe({
      next: (res) => {
        this.permissionList = res.data;
      },
      error: (err) => {
        console.log("err", err)
      }
    })
  }
}
