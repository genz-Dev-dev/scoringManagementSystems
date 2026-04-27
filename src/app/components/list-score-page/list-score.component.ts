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
  meanScore: number = 0;
  meanScoreFail: number = 0;
  meanScorePass: number = 0;

  private handleStudentScoreReport ()
  {
    this.listScoreService.getAllScoreReport().subscribe( {
      next: ( Response: ApiResponse<StudentScoreResponse[]> ) =>
      {
        this.studentsList = Response.data;

        if ( this.studentsList.length > 0 )
        {

          const total = this.studentsList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );
          this.meanScore = total / this.studentsList.length;

          const failList = this.studentsList.filter( s => s.Score < 50 );
          const failTotal = failList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );

          this.meanScoreFail = failList.length ? failTotal / failList.length : 0;

          const passList = this.studentsList.filter( s => s.Score >= 50 );
          const passTotal = passList.reduce( ( sum, s ) => sum + ( s.Score || 0 ), 0 );

          this.meanScorePass = passList.length ? passTotal / passList.length : 0;
        }


        // if ( this.studentsList.length > 0 )
        // {
        //   const total = this.studentsList.reduce( ( sum, student ) =>
        //   {
        //     return sum + ( student.Score || 0 );
        //   }, 0 );

        //   const meanScoreFailTotal = this.studentsList.filter( ( studentsList ) => studentsList.Score < 50 ).length;
        //   this.meanScoreFail = meanScoreFailTotal / this.studentsList.length;
        //   this.meanScore = total / this.studentsList.length;
        //   console.log( "mean", this.meanScoreFail )

        // }
      },
      error: ( error: ErrorRespone ) =>
      {
        this.errorResponse = error;
      }
    } )
  }

}
