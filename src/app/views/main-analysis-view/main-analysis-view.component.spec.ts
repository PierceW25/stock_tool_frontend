import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAnalysisViewComponent } from './main-analysis-view.component';

describe('MainAnalysisViewComponent', () => {
  let component: MainAnalysisViewComponent;
  let fixture: ComponentFixture<MainAnalysisViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainAnalysisViewComponent]
    });
    fixture = TestBed.createComponent(MainAnalysisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
