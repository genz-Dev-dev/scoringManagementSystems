import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogEntry
{
  timestamp: string;
  module: string;
  action: string;
  status: string;
  statusCode: string;
  requestId: string;
  statusClass: string;
  moduleClass: string;
}

@Component( {
  selector: 'app-system-log-page',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './system-log-page.component.html',
  styleUrls: [ './system-log-page.component.scss' ],
} )
export class SystemLogPageComponent 
{

  logs: LogEntry[] = [
    { timestamp: '2023-10-24 16:01:58:02', module: 'SCORE ENGINE', action: 'CALCULATE_GPA_BATCH', status: '200 OK', statusCode: 'success', requestId: 'req_0021b_calc', statusClass: 'text-success', moduleClass: 'badge-ghost' },
    { timestamp: '2023-10-24 16:00:01:12', module: 'USER MODULE', action: 'PERMISSION_DENIED_EDIT', status: '403 FORBIDDEN', statusCode: 'error', requestId: 'req_1102c_user', statusClass: 'text-error', moduleClass: 'badge-error' },
    { timestamp: '2023-10-24 15:58:12:01', module: 'CURRICULUM', action: 'SYLLABUS_UPDATE_Pushed', status: '201 CREATED', statusCode: 'success', requestId: 'req_4456d_curr', statusClass: 'text-success', moduleClass: 'badge-primary' },
    { timestamp: '2023-10-24 15:56:33:45', module: 'AUTHENTICATION', action: 'MFA_VERIFICATION_INIT', status: '102 PENDING', statusCode: 'warning', requestId: 'req_2268e_auth', statusClass: 'text-info', moduleClass: 'badge-info' },
  ];
}