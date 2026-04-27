import { Component, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolePermissionService } from 'src/app/core/services/role-permission/role-permission.service';
import { StatsCardComponent } from "../../shared/components/stats-card/stats-card.component";
import {Permission} from '../../models/permission.model';
import {StatsCard} from '../../models/stats-card.model';

interface Perms {
  label: string;
  enabled: boolean;
}

interface Role {
  name: string;
  badge: string;
  badgeClass: string;
  desc: string;
  avatars: string[];
  modules: Module[];
}

interface Module {
  icon: string;
  title: string;
  perms: Perms[];
}


@Component({
  selector: 'app-permission-admin-page',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, StatsCardComponent],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss',
})
export class PermissionComponent implements OnInit {

  activeTab = signal('Results');
  tabs = ['PERMISSION', 'ROLE'];
  permissionForm!: FormGroup;
  permissionList: Permission[] = [];
  ModalPermission = signal(false);
  currentUserRole: string = '';
  roles: Role[] = [
    {
      name: 'Admin',
      badge: 'Universal',
      badgeClass: 'bg-[#1a2a4a] text-[#4f9ef7]',
      desc: 'Complete system override.',
      avatars: ['JK', 'ML', '+4'],
      modules: this.makeModules({
        auth: [true, true, true],
        user: [true, false, true],
        score: [true, true, true],
        student: [true, false, true]
      })
    },
    {
      name: 'Teacher',
      badge: 'Module-Based',
      badgeClass: 'bg-[#1a2e1a] text-[#4db06a]',
      desc: 'Classroom management.',
      avatars: ['SR', 'TC'],
      modules: this.makeModules({
        auth: [false, false, false],
        user: [false, false, true],
        score: [true, true, false],
        student: [true, false, false]
      })
    }
  ];
  viewMode: 'grid' | 'json' = 'grid';
  getAllRoles: any[] = [];
  errorResponse: string = '';
  selectedRole: Role = this.roles[0];

  constructor(private fb: FormBuilder, private router: Router, private rolePermissionService: RolePermissionService) {
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
    this.handleGetAllRoles();

  }

  public setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  public showModalPermission() {
    this.ModalPermission.set(true);
  }

  public hideModalPermission() {
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

  private handleGetAllRoles() {
    this.rolePermissionService.getAllRoles().subscribe({
      next: (Response) => {
        this.getAllRoles = Response.data;
        // console.log( "Response data", this.getAllRoles )
      },
      error: (error) => {
        this.errorResponse = error.message;
      }
    })
  }

  public selectRole(role: Role) {
    this.selectedRole = role;
  }

  public makeModules(opts: any): Module[] {
    return [
      {
        icon: '🔒',
        title: 'Auth Module',
        perms: [
          { label: 'Grant SSH Access', enabled: opts.auth[0] },
          { label: 'Token Revocation', enabled: opts.auth[1] },
          { label: 'API Key Generation', enabled: opts.auth[2] }
        ]
      },
      {
        icon: '👤',
        title: 'User Module',
        perms: [
          { label: 'Delete Profiles', enabled: opts.user[0] },
          { label: 'Impersonate Session', enabled: opts.user[1] },
          { label: 'Modify Tier Status', enabled: opts.user[2] }
        ]
      }
    ];
  }

  public getJson(): string {
    const out: any = {
      role: this.selectedRole.name,
      permissions: {}
    };

    this.selectedRole.modules.forEach(mod => {
      const key = mod.title.replace(' Module', '').toLowerCase();
      out.permissions[key] = {};

      mod.perms.forEach(p => {
        out.permissions[key][p.label.replace(/ /g, '_').toLowerCase()] = p.enabled;
      });
    });

    return JSON.stringify(out, null, 2);
  }

  public handleRetrieveStatsInfo(): Array<StatsCard> {
    return [
      {
        id: 1,
        icon: "fa-solid fa-key",
        primary: "text-amber-500",
        secondary: "bg-amber-100",
        total: this.permissionList.length,
        title: "All Permission"
      },
      {
        id: 2,
        icon: "fa-solid fa-check",
        primary: "text-emerald-500",
        secondary: "bg-emerald-100",
        total: this.handleFilterCountPermStatus(true),
        title: "Active Permission"
      },
      {
        id: 3,
        icon: "fa-solid fa-ban",
        primary: "text-rose-500",
        secondary: "bg-rose-100",
        total: this.handleFilterCountPermStatus(false),
        title: "In-Active"
      },
      {
        id: 4,
        icon: "fa-solid fa-layer-group",
        primary: "text-sky-500",
        secondary: "bg-sky-100",
        total: this.handleCountPermissionModule(),
        title: "Module"
      },

    ]
  }

  private handleFilterCountPermStatus(property: boolean): number {
    return this.permissionList?.filter((perm , i) => perm.status === property).length;
  }

  private handleCountPermissionModule(): number {
    return new Set(this.permissionList.map((perm, _) => perm.module))
      .size;
  }

}
