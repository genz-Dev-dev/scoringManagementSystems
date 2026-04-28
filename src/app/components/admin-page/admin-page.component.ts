import { Component, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { ListScoreServiceService } from 'src/app/api/list-score-service/list-score-service.service';
import { DepartmentClassServiceService } from 'src/app/api/department-class-service/department-class-service.service';
import Swal from 'sweetalert2';
import { ApiResponse, ErrorRespone, PerformanceBar, ClassResponse } from 'src/app/models/Department.models';
import { StudentScoreResponse } from 'src/app/models/StudentScoreReport.model';

interface StatCard
{
  icon: string;
  label: string;
  value: number;
  bg: string;
}
interface Event
{
  day: string;
  date: number;
  month: string;
  badge: string;
  badgeClass: string;
  title: string;
  time: string;
}

interface Achiever
{
  name: string;
  avatar: string;
  medal: string;
}

@Component( {
  selector: 'app-admin-page',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
} )
export class AdminPageComponent implements OnInit
{
  activeTab = signal( 'Results View Bar Chart' );
  getAllStudent: any[] = [];
  countStudent: number = 0;
  errorResponse: any = [];
  meanScore: number = 0;
  meanScoreFail: number = 0;
  meanScorePass: number = 0;
  selectedClassId: string = '';
  performance: PerformanceBar[] = [];
  studentsList: StudentScoreResponse[] = [];
  class: ClassResponse[] = [];
  tabs = [ 'Admissions', 'Fees', 'Syllabus', 'Results View Bar Chart', 'Transport', 'Finance' ];
  constructor( private studentService: StudentsServiceService, private router: Router, private listScoreService: ListScoreServiceService, private departmentClassService: DepartmentClassServiceService ) { }
  ngOnInit (): void
  {
    this.handleGetAllStudent();
    this.handleStudentScoreReport();
    this.handleGetAllClass();
  }
  private handleGetAllStudent ()
  {
    this.studentService.getAllStudents().subscribe( {
      next: ( Response ) =>
      {
        this.getAllStudent = Response.content;
        this.countStudent = Response.content.length;
        this.stats = [
          { ...this.stats[ 2 ], value: this.countStudent },
          { ...this.stats[ 3 ], value: this.countClass },
          { ...this.stats[ 0 ], value: 0 },
          { ...this.stats[ 1 ], value: 0 }
        ];
      },
      error: ( error ) =>
      {
        this.errorResponse = error.message;
      }
    } )
  }

  stats: StatCard[] = [
    { icon: 'fa-solid fa-users', label: 'Staff', value: 0, bg: 'bg-teal-50' },
    { icon: 'fa-solid fa-users', label: 'Parents', value: 0, bg: 'bg-orange-50' },
    { icon: 'fa-solid fa-person-dress', label: 'Students', value: 0, bg: 'bg-blue-50' },
    { icon: 'fa-solid fa-school', label: 'Classes', value: 0, bg: 'bg-purple-50' },
  ];
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

  private handleStudentScoreReport ()
  {
    this.listScoreService.getAllScoreReport().subscribe( {
      next: ( Response: ApiResponse<StudentScoreResponse[]> ) =>
      {
        this.studentsList = Response.data;
        const grouped: { [ className: string ]: StudentScoreResponse[] } = {};
        this.studentsList.forEach( student =>
        {
          const className = student.className || 'Unknown';
          if ( !grouped[ className ] )
          {
            grouped[ className ] = [];
          }
          grouped[ className ].push( student );
        } );

        this.performance = Object.keys( grouped ).map( className =>
        {
          const students = grouped[ className ];
          const total = students.length;

          const passed = students.filter( s => s.Score >= 50 ).length;
          const failed = students.filter( s => s.Score < 50 ).length;

          return {
            label: className,
            passed: total ? Math.round( ( passed / total ) * 100 ) : 0,
            failed: total ? Math.round( ( failed / total ) * 100 ) : 0
          };
        } );

      },
      error: ( error: ErrorRespone ) =>
      {
        this.errorResponse = error;
      }
    } );
  }
  countClass: number = 0;
  private handleGetAllClass ()
  {
    this.departmentClassService.getAllClass().subscribe( {
      next: ( Response: ApiResponse<ClassResponse[]> ) =>
      {
        this.class = Response.data;
        this.countClass = Response.data.length;
      },
      error: ( error ) =>
      {
        this.errorResponse = error.message;
      }
    } )
  }
  setActiveTab ( tab: string )
  {
    this.activeTab.set( tab );
  }
}
