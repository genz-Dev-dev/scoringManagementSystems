import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/Users';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import Swal from 'sweetalert2';
import { FooterAdminPageComponent } from 'src/app/shared/components/footer-admin-page/footer-admin-page.component';
import { TokenStoragesService } from 'src/app/api/tokens/token-storages.service';

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

interface PerformanceBar {
  label: string;
  passed: number;
  failed: number;
}

interface Event {
  day: string;
  date: number;
  month: string;
  badge: string;
  badgeClass: string;
  title: string;
  time: string;
}

interface Achiever {
  name: string;
  avatar: string;
  medal: string;
}

@Component({
  selector: 'app-scoring-management-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterAdminPageComponent],
  templateUrl: './scoring-management-system-admin-page.component.html',
  styleUrls: ['./scoring-management-system-admin-page.component.scss'],
})
export class ScoringManagementSystemAdminPageComponent implements OnInit {
  isLoading = true;
  User: User | null = null;
  @ViewChild('myModal') myModal!: ElementRef<HTMLDialogElement>;
  constructor(private router: Router, private authService: AuthServiceService, private tokenStorage: TokenStoragesService) {

  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.User = user;
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    });
  }
  // Sidebar state
  sidebarOpen = signal(true);

  // Filters and tabs
  selectedClass = signal('Class 9');
  activeTab = signal('Results');

  // Dropdown options
  classes = [
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
  ];
  tabs = ['Admissions', 'Fees', 'Syllabus', 'Results', 'Transport', 'Finance'];

  // Navigation sections
  navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [{ icon: 'fa-solid fa-gauge-high', label: 'Dashboard', route: '/admin', active: true }],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { icon: 'fa-solid fa-user-shield', label: 'Permissions Roles', route: '/permissions' },
        { icon: 'fa-solid fa-user-plus', label: 'Create Account', route: '/signup' },
        { icon: 'fa-solid fa-people-roof', label: 'Class Semester', route: '/class-semester' },
        { icon: 'fa-solid fa-user', label: 'Student Management', route: '/student-management' },
        { icon: 'fa-solid fa-cloud-arrow-up', label: 'Upload Score', route: '/upload-score' },
      ],
    },
    {
      title: 'STUDENT',
      items: [
        { icon: 'fa-solid fa-list-check', label: 'Attendance', route: '/students' },
        { icon: 'credit-card', label: 'Student Fees' },
        { icon: 'clipboard', label: 'Homework' },
        { icon: 'truck', label: 'Transport' },
        { icon: 'book', label: 'Library' },
      ],
    },
    {
      title: 'EXAMS',
      items: [
        { icon: 'calendar', label: 'Date Sheet' },
        { icon: 'list', label: 'Syllabus' },
      ],
    },
  ];

  // Performance chart data
  performance: PerformanceBar[] = [
    { label: 'Class A', passed: 95, failed: 5 },
    { label: 'Class B', passed: 88, failed: 12 },
    { label: 'Class C', passed: 70, failed: 30 },
    { label: 'Class D', passed: 82, failed: 18 },
    { label: 'Class E', passed: 98, failed: 2 },
  ];

  // Upcoming events
  upcomingEvents: Event[] = [
    {
      day: 'Tuesday',
      date: 6,
      month: 'Feb',
      badge: 'Today',
      badgeClass: 'badge-error text-white',
      title: 'School President Elections',
      time: '11:00 Am – 12:30 Pm',
    },
    {
      day: 'Tuesday',
      date: 9,
      month: 'Feb',
      badge: 'In 3 days',
      badgeClass: 'badge-warning text-white',
      title: 'Special Guest Lecture',
      time: '11:00 Am – 12:30 Pm',
    },
    {
      day: 'Tuesday',
      date: 9,
      month: 'Feb',
      badge: 'In 3 days',
      badgeClass: 'badge-warning text-white',
      title: 'Webinar on Career Trends for Class 11',
      time: '01:00 Am – 02:30 Pm',
    },
  ];

  // Top achievers and players
  topAchievers: Achiever[] = [
    { name: 'Madhiha Sharma', avatar: 'MS', medal: '🥇' },
    { name: 'Rahul Gupta', avatar: 'RG', medal: '🥈' },
    { name: 'Aisha Khan', avatar: 'AK', medal: '🥉' },
  ];

  topPlayers: Achiever[] = [
    { name: 'Madhiha Sharma', avatar: 'MS', medal: '🥇' },
    { name: 'Rahul Gupta', avatar: 'RG', medal: '🥈' },
    { name: 'Priya Singh', avatar: 'PS', medal: '🥉' },
  ];

  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  // Helper for nav icons
  // getNavIcon(icon: string): string {
  //   const icons: Record<string, string> = {
  //     grid: '⊞',
  //     shield: '🛡',
  //     'book-open': '📖',
  //     layers: '📚',
  //     'file-text': '📄',
  //     printer: '🖨',
  //     user: '👤',
  //     'credit-card': '💳',
  //     clipboard: '📋',
  //     truck: '🚌',
  //     book: '📗',
  //     calendar: '📅',
  //     list: '📝',
  //   };
  //   return icons[icon] ?? '•';
  // }

  logoutAdminPage(): void {
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
          </div>
      `,
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
