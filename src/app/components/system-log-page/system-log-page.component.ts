import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogServiceService } from 'src/app/api/audit-log-service/audit-log-service.service';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-system-log-page',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './system-log-page.component.html',
  styleUrls: [ './system-log-page.component.scss' ],
} )
export class SystemLogPageComponent implements OnInit
{

  getAllAuditLog: any[] = [];


  constructor( private auditLogService: AuditLogServiceService, private router: Router ) { }

  ngOnInit (): void
  {
    this.handleGetAllAuditLog();
  }

  private handleGetAllAuditLog ()
  {
    this.auditLogService.getAllAuditLogs().subscribe( {
      next: ( Response ) =>
      {
        this.getAllAuditLog = Response;
        console.log( this.getAllAuditLog );
      }
    } )
  }

  formatValue ( value: any ): string
  {
    if ( value === null || value === undefined ) return 'NA';

    let str = value.toString();

    // Clean Hibernate proxy garbage
    if ( str.includes( 'HibernateProxy' ) || str.includes( ':REF' ) )
    {
      str = str.replace( 'HibernateProxy', '' ).replace( ':REF', '' );
    }

    // Hide long tokens (JWT, etc.)
    if ( str.length > 50 )
    {
      return str.substring( 0, 30 ) + '...';
    }

    return str;
  }

  handleRefreshAuditLogPage ()
  {
    window.location.reload();
    this.handleGetAllAuditLog();
  }
}