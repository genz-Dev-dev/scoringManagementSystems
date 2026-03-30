import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScorePageComponent } from './upload-score-page.component';

describe('UploadScorePageComponent', () => {
  let component: UploadScorePageComponent;
  let fixture: ComponentFixture<UploadScorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadScorePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadScorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
