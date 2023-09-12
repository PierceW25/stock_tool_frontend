import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistCustomComponent } from './watchlist-custom.component';

describe('WatchlistCustomComponent', () => {
  let component: WatchlistCustomComponent;
  let fixture: ComponentFixture<WatchlistCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchlistCustomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchlistCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
