import { Routes } from '@angular/router';
import { LoginGuard } from './core/guard/login.guard';
import { PageNotFoundComponent } from './shared/404/page-not-found.component';
export const routes: Routes = [
    {
        path: 'signin',
        loadComponent: () =>
            import('./features/auth-management/signin/signin.component')
                .then(m => m.SigninComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import('./features/auth-management/forgot-password/forgot-password-page.component')
                .then(m => m.ForgotPasswordPageComponent)
    },
    {
        path: '',
        loadComponent: () =>
            import('./features/main-layout/bunkry-university-management-system.component')
                .then(m => m.BunkryUniversityManagementSystemComponent),
        canActivate: [LoginGuard],
        canActivateChild: [LoginGuard],
        children: [
            { path: '', redirectTo: 'admin', pathMatch: 'full' },

            {
                path: 'admin',
                loadComponent: () =>
                    import('./features/dashboard-management/admin-page.component')
                        .then(m => m.AdminPageComponent)
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./features/auth-management/signup/signup.component')
                        .then(m => m.SignupComponent)
            },

            {
                path: 'students',
                loadComponent: () =>
                    import('./features/student-management/components/student-list/students-list.component')
                        .then(m => m.StudentsListComponent)
            },

            {
                path: 'student-management',
                loadComponent: () =>
                    import('./features/student-management/student-management.component')
                        .then(m => m.StudentManagementComponent)
            },

            {
                path: 'permissions',
                loadComponent: () =>
                    import('./features/permission-management/permission.component')
                        .then(m => m.PermissionComponent)
            },
            {
                path: 'upload-score',
                loadComponent: () =>
                    import('./features/score-management/components/upload-score/upload-score.component')
                        .then(m => m.UploadScoreComponent)
            },
            {
                path: 'list-score',
                loadComponent: () =>
                    import('./features/score-management/list-score.component')
                        .then(m => m.ListScoreComponent)
            },
            {
                path: 'academic/programs',
                loadComponent: () => import('./features/academic-management/class-semester.component').then(m => m.ClassSemesterComponent)
            }, {
                path: 'system-log',
                loadComponent: () =>
                    import('./features/system-log-management/system-log-page.component')
                        .then(m => m.SystemLogPageComponent)
            }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () =>
            import('./shared/404/page-not-found.component')
                .then(m => m.PageNotFoundComponent)
    },
    { path: '**', component: PageNotFoundComponent }
];
