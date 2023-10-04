import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialStatementsComponent } from './financial-statements.component';

describe('FinancialStatementsComponent', () => {
  let component: FinancialStatementsComponent;
  let fixture: ComponentFixture<FinancialStatementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialStatementsComponent]
    });
    fixture = TestBed.createComponent(FinancialStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
