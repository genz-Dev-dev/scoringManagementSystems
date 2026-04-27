import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { TokenServiceService } from 'src/app/core/services/token/token.service.service';
import Swal from 'sweetalert2';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { TokenStoragesService } from 'src/app/core/services/token-storage/token-storages.service';

interface NavItem {
  icon: string;
  label: string;
  route?: string;
  active?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-scoring-management-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './bunkry-university-management-system.component.html',
  styleUrls: ['./bunkry-university-management-system.component.scss'],
})
export class BunkryUniversityManagementSystemComponent implements OnInit {
  isLoading = true;
  User: User | null = null;
  sidebarOpen = signal(true);
  selectedClass = signal('Class 9');
  activeTab = signal('Results');
  @ViewChild('myModal') myModal!: ElementRef<HTMLDialogElement>;
  constructor(private router: Router, private authService: TokenServiceService, private tokenStorage: TokenStoragesService) { }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.User = user;
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    });
  }
  // Navigation sections
  navSections: NavSection[] = [
    {
      title: 'MAIN DASHBOARD',
      items: [{ icon: 'fa-solid fa-chart-bar', label: 'Dashboard', route: '/admin', active: true }],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { icon: 'fa-solid fa-user-shield', label: 'Permissions Roles', route: '/permissions' },
        { icon: 'fa-solid fa-user-plus', label: 'Create Accounts', route: '/signup' },
        { icon: 'fa-solid fa-people-roof', label: 'Academic Programs', route: '/academic/programs' },
        { icon: 'fa-solid fa-list-check', label: 'Student Reports', route: '/student-management' },
        { icon: 'fa-solid fa-cloud-arrow-up', label: 'Upload Scores', route: '/upload-score' },
        { icon: 'fas fa-chart-bar', label: 'Score Overview', route: '/list-score' },
        { icon: 'fa-solid fa-list-check', label: 'Attendance', route: '/students' },
        { icon: 'fa-solid fa-clock-rotate-left', label: 'System Logs', route: '/system-log' },
      ],
    }
  ];
  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
  private handlelogoutAdminPage(): void {
    this.myModal.nativeElement.close();
    Swal.fire({
      icon: 'question',
      iconColor: '#b91c1c',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'ទេ',
      confirmButtonText: 'យល់ព្រម',
      html: `
          <div class="text-lg">
            <p class="text-lg">តើអ្នកពិតជាចង់ចាកចេញពីកម្មវិធីនេះ?</p>
          </div>`,
      color: '#b91c1c',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.tokenStorage.removeToken();
          this.router.navigate(['/signin']).then(() => {
            window.location.reload();
          });
        }
      });
  }
  onClickRouter(router: string) {
    this.router.navigate([router]);
  }
  openModal() {
    this.myModal.nativeElement.showModal();
  }
  closeModal() {
    this.myModal.nativeElement.close();
  }
}
