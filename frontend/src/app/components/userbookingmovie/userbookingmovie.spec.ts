import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userbookingmovie } from './userbookingmovie';

describe('Userbookingmovie', () => {
  let component: Userbookingmovie;
  let fixture: ComponentFixture<Userbookingmovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Userbookingmovie],
    }).compileComponents();

    fixture = TestBed.createComponent(Userbookingmovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
