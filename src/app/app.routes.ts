// import { Routes } from '@angular/router';
// import { LoginGuard } from './api/guard/login.guard';
// import { ScoringManagementSystemAdminPageComponent } from './components/scoring-management-system-admin-page/scoring-management-system-admin-page.component';
// import { SigninPageComponent } from './components/signin-page/signin-page.component';
// import { SignUpPageComponent } from './components/sign-up-page/sign-up-page.component';
// import { StudentsListComponent } from './components/students-list/students-list.component';
// import { AdminPageComponent } from './components/admin-page/admin-page.component';
// import { StudentManagementComponent } from './components/student-management/student-management.component';
// import { OtpPageComponent } from './components/otp-page/otp-page.component';
// import { PermissionAdminPageComponent } from './components/permission-admin-page/permission-admin-page.component';
// export const routes: Routes = [
//     { path: 'signin', component: SigninPageComponent },
//     { path: 'signup', component: SignUpPageComponent },
//     { path: 'otp', component: OtpPageComponent },

//     {
//         path: '',
//         component: ScoringManagementSystemAdminPageComponent,
//         canActivate: [LoginGuard],
//         canActivateChild: [LoginGuard],
//         children: [
//             { path: '', redirectTo: 'admin', pathMatch: 'full' },
//             { path: 'admin', component: AdminPageComponent },
//             { path: 'studentManagement', component: StudentManagementComponent },
//             { path: 'students', component: StudentsListComponent },
//             { path: 'permissions', component: PermissionAdminPageComponent },
//             { path: 'adminPage', redirectTo: 'admin', pathMatch: 'full' }
//         ]
//     }
// ];
import { Routes } from '@angular/router';
import { LoginGuard } from './api/guard/login.guard';
import { CustomePageNotFoundComponent } from './shared/components/custome-page-not-found/custome-page-not-found.component';
export const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () =>
            import('./components/signin-page/signin-page.component')
                .then(m => m.SigninPageComponent)
    },
    {
        path: 'otp',
        loadComponent: () =>
            import('./components/otp-page/otp-page.component')
                .then(m => m.OtpPageComponent)
    }, {
        path: 'forgot-password',
        loadComponent: () =>
            import('./components/forgot-password-page/forgot-password-page.component')
                .then(m => m.ForgotPasswordPageComponent)
    },
    {
        path: 'change-password',
        loadComponent: () =>
            import('./components/change-password-page/change-password-page.component')
                .then(m => m.ChangePasswordPageComponent)
    },
    {
        path: '',
        loadComponent: () =>
            import('./components/scoring-management-system-admin-page/scoring-management-system-admin-page.component')
                .then(m => m.ScoringManagementSystemAdminPageComponent),

        canActivate: [LoginGuard],
        canActivateChild: [LoginGuard],

        children: [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },

            {
                path: 'admin',
                loadComponent: () =>
                    import('./components/admin-page/admin-page.component')
                        .then(m => m.AdminPageComponent)
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./components/sign-up-page/sign-up-page.component')
                        .then(m => m.SignUpPageComponent)
            },

            {
                path: 'students',
                loadComponent: () =>
                    import('./components/students-list/students-list.component')
                        .then(m => m.StudentsListComponent)
            },

            {
                path: 'student-management',
                loadComponent: () =>
                    import('./components/student-management/student-management.component')
                        .then(m => m.StudentManagementComponent)
            },

            {
                path: 'permissions',
                loadComponent: () =>
                    import('./components/permission-admin-page/permission-admin-page.component')
                        .then(m => m.PermissionAdminPageComponent)
            },
            {
                path: 'upload-score',
                loadComponent: () =>
                    import('./components/upload-score-page/upload-score-page.component')
                        .then(m => m.UploadScorePageComponent)
            }, {
                path: 'class-semester',
                loadComponent: () =>
                    import('./components/class-semester-page/class-semester-page.component')
                        .then(m => m.ClassSemesterPageComponent)
            }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () =>
            import('./shared/components/custome-page-not-found/custome-page-not-found.component')
                .then(m => m.CustomePageNotFoundComponent)
    },
    { path: '**', component: CustomePageNotFoundComponent }
];