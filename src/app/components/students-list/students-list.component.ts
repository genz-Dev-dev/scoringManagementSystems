import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Student
{
  id: string;
  name: string;
  avatar: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  history: string[]; // hex colors for the dots
}
interface AttendanceRecord
{
  studentId: string;
  date: string; // ISO date string YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}
@Component( {
  selector: 'app-students-list',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
} )
export class StudentsListComponent
{
  // Static roster data based on the image
  students: Student[] = [
    { id: '220914', name: 'Aditi Sharma', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Present', history: [ '#60A5FA', '#60A5FA', '#FDBA74', '#60A5FA' ] },
    { id: '220956', name: 'Benjamin Lewis', avatar: 'https://i.pravatar.cc/150?u=2', status: 'Absent', history: [ '#60A5FA', '#F87171', '#60A5FA', '#60A5FA' ] },
    { id: '220912', name: 'Chloe Thompson', avatar: 'https://i.pravatar.cc/150?u=3', status: 'Late', history: [ '#60A5FA', '#FDBA74', '#FDBA74', '#60A5FA' ] },
    { id: '221004', name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=4', status: 'Present', history: [ '#60A5FA', '#60A5FA', '#60A5FA', '#60A5FA' ] },
  ];
  updateStatus ( student: Student, newStatus: any )
  {
    student.status = newStatus;
  }
}
