import { Component, OnInit } from '@angular/core';

interface LogEntry
{
  date: string;
  time: string;
  module: string;
  moduleColor: string;
  action: string;
  status: string;
  statusColor: string;
  statusDot: string;
  requestId: string;
}

@Component( {
  selector: 'app-system-log-page',
  templateUrl: './system-log-page.component.html',
  styleUrl: './system-log-page.component.scss',
} )
export class SystemLogPageComponent implements OnInit
{

  // ── STATE ─────────────────────────────────────────────
  throughput = 12482;
  delta = 4.2;
  criticalCount = 2;
  latencyPct = 72;
  lastUpdated = 42;
  activePage = 1;

  bars: { height: number; active: boolean }[] = [];

  logs: LogEntry[] = [
    {
      date: '2023-10-24',
      time: '14:02:11.24',
      module: 'AUTHENTICATION',
      moduleColor: '#A28CFF',
      action: 'JWT_VALIDATION_SUCCESS',
      status: '200 OK',
      statusColor: '#00F0A0',
      statusDot: '#00F0A0',
      requestId: 'req_8812a_auth'
    },
    {
      date: '2023-10-24',
      time: '13:59:58.87',
      module: 'SCORE ENGINE',
      moduleColor: '#00D4FF',
      action: 'CALCULATE_GPA_BATCH',
      status: '200 OK',
      statusColor: '#00F0A0',
      statusDot: '#00F0A0',
      requestId: 'req_9921b_calc'
    },
    {
      date: '2023-10-24',
      time: '13:44:46.12',
      module: 'USER MODULE',
      moduleColor: '#FF3D5A',
      action: 'PERMISSION_DENIED_EDIT',
      status: '403 FORBIDDEN',
      statusColor: '#FF3D5A',
      statusDot: '#FF3D5A',
      requestId: 'req_5183c_user'
    },
    {
      date: '2023-10-24',
      time: '13:30:12.01',
      module: 'CURRICULUM',
      moduleColor: '#00F0A0',
      action: 'SYLLABUS_UPDATE_PUSHED',
      status: '201 CREATED',
      statusColor: '#00F0A0',
      statusDot: '#00F0A0',
      requestId: 'req_4456d_curr'
    },
    {
      date: '2023-10-24',
      time: '13:58:33.45',
      module: 'AUTHENTICATION',
      moduleColor: '#A28CFF',
      action: 'MFA_VERIFICATION_INIT',
      status: '102 PENDING',
      statusColor: '#FFB84D',
      statusDot: '#FFB84D',
      requestId: 'req_2288e_auth'
    },
  ];

  // ── LIFECYCLE ─────────────────────────────────────────
  ngOnInit (): void
  {
    this.bars = this.generateBars();

    setInterval( () =>
    {
      this.tick();
    }, 2000 );
  }

  // ── LOGIC ─────────────────────────────────────────────
  generateBars ()
  {
    const N = 24;
    return Array.from( { length: N }, ( _, i ) => ( {
      height: 18 + Math.floor( Math.random() * 76 ),
      active: i === N - 1,
    } ) );
  }

  tick ()
  {
    this.throughput += Math.round( ( Math.random() - 0.45 ) * 8 );

    this.delta = parseFloat(
      ( Math.random() * 1.5 + 3.5 ).toFixed( 1 )
    );

    this.latencyPct = Math.min(
      98,
      Math.max( 38, this.latencyPct + ( Math.random() * 5 - 2.5 ) )
    );

    this.lastUpdated = this.lastUpdated <= 0
      ? 60
      : this.lastUpdated - 1;

    // update bars (scroll effect)
    this.bars.shift();
    this.bars.push( {
      height: 18 + Math.floor( Math.random() * 76 ),
      active: true,
    } );

    this.bars = this.bars.map( ( b, i ) => ( {
      ...b,
      active: i === this.bars.length - 1,
    } ) );
  }

  // ── UI ACTIONS ────────────────────────────────────────
  changePage ( page: number | 'prev' | 'next' )
  {
    if ( page === 'prev' )
    {
      this.activePage = Math.max( 1, this.activePage - 1 );
    } else if ( page === 'next' )
    {
      this.activePage = Math.min( 3, this.activePage + 1 );
    } else
    {
      this.activePage = page;
    }
  }

  openDetail ( id: string )
  {
    console.log( 'Opening detail:', id );

    // simple toast (Angular-safe)
    const toast = document.createElement( 'div' );
    toast.textContent = `Opening detail: ${ id }`;

    Object.assign( toast.style, {
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      background: 'rgba(0,212,255,.12)',
      border: '1px solid rgba(0,212,255,.3)',
      color: '#00D4FF',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
      fontWeight: '600',
      padding: '11px 18px',
      borderRadius: '10px',
      zIndex: '999',
    } );

    document.body.appendChild( toast );

    setTimeout( () => toast.remove(), 2400 );
  }

  runDiagnosis ( btn: HTMLButtonElement )
  {
    btn.textContent = 'RUNNING…';
    btn.style.background = 'rgba(0,212,255,.15)';
    btn.style.color = '#00D4FF';

    setTimeout( () =>
    {
      btn.textContent = 'RUN DIAGNOSIS';
      btn.style.background = '';
      btn.style.color = '';
    }, 2800 );
  }
}