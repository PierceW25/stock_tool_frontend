import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStockInputComponent } from './search-stock-input.component';

describe('SearchStockInputComponent', () => {
  let component: SearchStockInputComponent;
  let fixture: ComponentFixture<SearchStockInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchStockInputComponent]
    });
    fixture = TestBed.createComponent(SearchStockInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
