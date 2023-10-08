import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementAnalysisComponent } from './income-statement-analysis.component';

describe('IncomeStatementAnalysisComponent', () => {
  let component: IncomeStatementAnalysisComponent;
  let fixture: ComponentFixture<IncomeStatementAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeStatementAnalysisComponent]
    });
    fixture = TestBed.createComponent(IncomeStatementAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
