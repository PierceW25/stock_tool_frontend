import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetAnalysisComponent } from './balance-sheet-analysis.component';

describe('BalanceSheetAnalysisComponent', () => {
  let component: BalanceSheetAnalysisComponent;
  let fixture: ComponentFixture<BalanceSheetAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceSheetAnalysisComponent]
    });
    fixture = TestBed.createComponent(BalanceSheetAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
