import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowAnalysisComponent } from './cash-flow-analysis.component';

describe('CashFlowAnalysisComponent', () => {
  let component: CashFlowAnalysisComponent;
  let fixture: ComponentFixture<CashFlowAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashFlowAnalysisComponent]
    });
    fixture = TestBed.createComponent(CashFlowAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
