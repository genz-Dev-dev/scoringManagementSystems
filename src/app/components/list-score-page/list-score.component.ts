import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsServiceService } from 'src/app/api/students-service/students-service.service';
import { Router } from '@angular/router';
import { ListScoreServiceService } from 'src/app/api/list-score-service/list-score-service.service';
import { StudentScoreResponse } from 'src/app/models/StudentScoreReport.model';
import { ApiResponse, ErrorRespone } from 'src/app/models/Department.models';
@Component( {
  selector: 'app-list-score',
  imports: [ CommonModule ],
  templateUrl: './list-score.component.html',
  styleUrl: './list-score.component.scss',
} )
export class ListScoreComponent implements OnInit
{
  studentsList: StudentScoreResponse[] = [];
  errorResponse: ErrorRespone | null = null;

  constructor( private studentService: StudentsServiceService, private router: Router, private listScoreService: ListScoreServiceService ) { }
  ngOnInit (): void
  {
    this.handleStudentScoreReport();
  }

  meanScore: number;
  meanScoreFailPercent: number;
  meanScorePassPercent: number;
  meanScoreFail: number;
  meanScorePass: number;
  failPercent: number;
  passPercent: number;

  private handleStudentScoreReport (): void
  {
    this.listScoreService.getAllScoreReport().subscribe( {
      next: ( response: ApiResponse<StudentScoreResponse[]> ) =>
      {
        this.studentsList = response.data || [];
        if ( this.studentsList.length === 0 ) return;

        const totalScore = this.studentsList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );
        this.meanScore = totalScore / this.studentsList.length;
        this.meanScoreFail = 100 - this.meanScore;

        const failList = this.studentsList.filter( s => s.Score < 50 );
        const passList = this.studentsList.filter( s => s.Score >= 50 );

        const failTotal = failList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );
        const passTotal = passList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );

        this.meanScoreFail = failList.length ? failTotal / failList.length : 0;
        this.meanScorePass = passList.length ? passTotal / passList.length : 0;

        this.failPercent = ( failList.length / this.studentsList.length ) * 100;
        this.passPercent = ( passList.length / this.studentsList.length ) * 100;
        this.meanScorePassPercent = ( passTotal / totalScore ) * 100;
        this.meanScoreFailPercent = ( failTotal / totalScore ) * 100;

      },
      error: ( error: ErrorRespone ) =>
      {
        this.errorResponse = error;
      }
    } );
  }

  navigateRouter ( url: String )
  {
    this.router.navigate( [ url ] );
  }
}
