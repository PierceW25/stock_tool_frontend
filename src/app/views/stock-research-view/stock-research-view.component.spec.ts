import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockResearchViewComponent } from './stock-research-view.component';

describe('StockResearchViewComponent', () => {
  let component: StockResearchViewComponent;
  let fixture: ComponentFixture<StockResearchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockResearchViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockResearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
