import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomePageNotFoundComponent } from './custome-page-not-found.component';

describe('CustomePageNotFoundComponent', () => {
  let component: CustomePageNotFoundComponent;
  let fixture: ComponentFixture<CustomePageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomePageNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomePageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
