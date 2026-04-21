import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPageComponent } from './list-score.component';

describe( 'ChangePasswordPageComponent', () =>
{
  let component: ChangePasswordPageComponent;
  let fixture: ComponentFixture<ChangePasswordPageComponent>;

  beforeEach( async () =>
  {
    await TestBed.configureTestingModule( {
      imports: [ ChangePasswordPageComponent ]
    } )
      .compileComponents();

    fixture = TestBed.createComponent( ChangePasswordPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should create', () =>
  {
    expect( component ).toBeTruthy();
  } );
} );
