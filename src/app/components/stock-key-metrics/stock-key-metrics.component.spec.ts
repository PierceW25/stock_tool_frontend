import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockKeyMetricsComponent } from './stock-key-metrics.component';

describe('StockKeyMetricsComponent', () => {
  let component: StockKeyMetricsComponent;
  let fixture: ComponentFixture<StockKeyMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockKeyMetricsComponent]
    });
    fixture = TestBed.createComponent(StockKeyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
