import { Component, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolePermissionServiceService } from 'src/app/api/role-permission-service/role-permission-service.service';
interface Permission
{
  label: string;
  enabled: boolean;
}

interface Module
{
  icon: string;
  title: string;
  perms: Permission[];
}

interface Role
{
  name: string;
  badge: string;
  badgeClass: string;
  desc: string;
  avatars: string[];
  modules: Module[];
}

@Component( {
  selector: 'app-permission-admin-page',
  imports: [ FormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './permission-admin-page.component.html',
  styleUrl: './permission-admin-page.component.scss',
} )
export class PermissionAdminPageComponent implements OnInit
{
  activeTab = signal( 'Results' );
  tabs = [ 'PERMISSION', 'ROLE' ];
  permissionForm!: FormGroup;
  rolesList: any[] = [];
  permissionList: any[] = [];
  ModalPermission = signal( false );
  currentUserRole: string = '';
  permission: any[] = [ "READ", "WRITE", "UPDATE", "DETELE" ]
  constructor( private fb: FormBuilder, private router: Router, private rolePermissionService: RolePermissionServiceService )
  {
    this.permissionForm = this.fb.group( {
      name: [ '', Validators.required ],
      description: [ '', Validators.required ],
      module: [ '', Validators.required ],
    } )
  }
  ngOnInit (): void
  {
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );

    this.currentUserRole = user.role;
    this.getAllPermission();
    this.handleGetAllRoles();

  }
  // Actions
  setActiveTab ( tab: string ): void
  {
    this.activeTab.set( tab );
  }
  showModalPermission ()
  {
    this.ModalPermission.set( true );
  }
  hideModalPermission ()
  {
    this.ModalPermission.set( false );
  }
  public createPermission ()
  {
    this.rolePermissionService.createPermission( this.permissionForm.value ).subscribe( {
      next: ( res ) =>
      {
        this.permissionList = res.data;
        this.hideModalPermission();
        this.getAllPermission();
        Swal.fire( {
          title: 'Success',
          text: 'Permission created successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        } )
      },
      error: ( err ) =>
      {
        Swal.fire( {
          title: 'Error',
          text: 'Permission creation failed',
          icon: 'error',
          confirmButtonText: 'OK'
        } )
      }
    } )
  }

  public getAllPermission ()
  {
    this.rolePermissionService.getAllPermission().subscribe( {
      next: ( res ) =>
      {
        this.permissionList = res.data;
      },
      error: ( err ) =>
      {
        console.log( "err", err )
      }
    } )
  }
  getAllRoles: any[] = [];
  errorResponse: string = '';
  private handleGetAllRoles ()
  {
    this.rolePermissionService.getAllRoles().subscribe( {
      next: ( Response ) =>
      {
        this.getAllRoles = Response.data;
        // console.log( "Response data", this.getAllRoles )
      },
      error: ( error ) =>
      {
        this.errorResponse = error.message;
      }
    } )
  }
  viewMode: 'grid' | 'json' = 'grid';

  roles: Role[] = [
    {
      name: 'Admin',
      badge: 'Universal',
      badgeClass: 'bg-[#1a2a4a] text-[#4f9ef7]',
      desc: 'Complete system override.',
      avatars: [ 'JK', 'ML', '+4' ],
      modules: this.makeModules( {
        auth: [ true, true, true ],
        user: [ true, false, true ],
        score: [ true, true, true ],
        student: [ true, false, true ]
      } )
    },
    {
      name: 'Teacher',
      badge: 'Module-Based',
      badgeClass: 'bg-[#1a2e1a] text-[#4db06a]',
      desc: 'Classroom management.',
      avatars: [ 'SR', 'TC' ],
      modules: this.makeModules( {
        auth: [ false, false, false ],
        user: [ false, false, true ],
        score: [ true, true, false ],
        student: [ true, false, false ]
      } )
    }
  ];

  selectedRole: Role = this.roles[ 0 ];

  selectRole ( role: Role )
  {
    this.selectedRole = role;
  }

  makeModules ( opts: any ): Module[]
  {
    return [
      {
        icon: '🔒',
        title: 'Auth Module',
        perms: [
          { label: 'Grant SSH Access', enabled: opts.auth[ 0 ] },
          { label: 'Token Revocation', enabled: opts.auth[ 1 ] },
          { label: 'API Key Generation', enabled: opts.auth[ 2 ] }
        ]
      },
      {
        icon: '👤',
        title: 'User Module',
        perms: [
          { label: 'Delete Profiles', enabled: opts.user[ 0 ] },
          { label: 'Impersonate Session', enabled: opts.user[ 1 ] },
          { label: 'Modify Tier Status', enabled: opts.user[ 2 ] }
        ]
      }
    ];
  }

  getJson (): string
  {
    const out: any = {
      role: this.selectedRole.name,
      permissions: {}
    };

    this.selectedRole.modules.forEach( mod =>
    {
      const key = mod.title.replace( ' Module', '' ).toLowerCase();
      out.permissions[ key ] = {};

      mod.perms.forEach( p =>
      {
        out.permissions[ key ][ p.label.replace( / /g, '_' ).toLowerCase() ] = p.enabled;
      } );
    } );

    return JSON.stringify( out, null, 2 );
  }
}
