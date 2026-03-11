import { RouterModule, Routes } from '@angular/router';
import { ScoringManagementSystemAdminPageComponent } from './components/scoring-management-system-admin-page/scoring-management-system-admin-page.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { SignUpPageComponent } from './components/sign-up-page/sign-up-page.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
export const routes: Routes = [
    { path: '', component: ScoringManagementSystemAdminPageComponent },
    { path: 'signin', component: SigninPageComponent },
    { path: 'signup', component: SignUpPageComponent },
    { path: 'students', component: StudentsListComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'studentManagement', component: StudentManagementComponent }
];
