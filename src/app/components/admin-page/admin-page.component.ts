import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
interface StatCard
{
  icon: string;
  label: string;
  value: number;
  bg: string;
}

interface PerformanceBar
{
  label: string;
  passed: number;
  failed: number;
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
export class AdminPageComponent
{
  // Filters and tabs
  selectedClass = signal( 'Class 9' );
  activeTab = signal( 'Results' );

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
  tabs = [ 'Admissions', 'Fees', 'Syllabus', 'Results', 'Transport', 'Finance' ];

  // Stat cards
  stats: StatCard[] = [
    { icon: 'fa-solid fa-person-dress', label: 'Students', value: 2000, bg: 'bg-blue-50' },
    { icon: 'fa-solid fa-person-pregnant', label: 'Teachers', value: 120, bg: 'bg-pink-50' },
    { icon: 'fa-solid fa-users', label: 'Parents', value: 2115, bg: 'bg-orange-50' },
    { icon: 'fa-solid fa-users', label: 'Staff', value: 82, bg: 'bg-teal-50' },
  ];

  // Performance chart data
  performance: PerformanceBar[] = [
    { label: 'Class A', passed: 80, failed: 20 },
    { label: 'Class B', passed: 88, failed: 12 },
    { label: 'Class C', passed: 70, failed: 30 },
    { label: 'Class D', passed: 82, failed: 18 },
    { label: 'Class E', passed: 90, failed: 10 },
    { label: 'Class F', passed: 98, failed: 2 },
    { label: 'Class G', passed: 98, failed: 2 },
    { label: 'Class H', passed: 98, failed: 2 },
    { label: 'Class I', passed: 98, failed: 2 },
    { label: 'Class J', passed: 98, failed: 2 },

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

}
