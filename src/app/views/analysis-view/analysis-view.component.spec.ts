import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisViewComponent } from './analysis-view.component';

describe('AnalysisViewComponent', () => {
  let component: AnalysisViewComponent;
  let fixture: ComponentFixture<AnalysisViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
