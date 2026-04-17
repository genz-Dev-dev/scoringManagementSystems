import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from "@cloudinary/url-gen/actions/resize";
@Component( {
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CloudinaryModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit
{
  title = 'Angular Quick Start';
  img!: CloudinaryImage;

  ngOnInit ()
  {

    // Create a Cloudinary instance and set your cloud name.
    const cld = new Cloudinary( {
      cloud: {
        cloudName: 'demo'
      }
    } );
  }
}