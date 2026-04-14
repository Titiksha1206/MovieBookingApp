import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userviewmovie } from './userviewmovie';

describe('Userviewmovie', () => {
  let component: Userviewmovie;
  let fixture: ComponentFixture<Userviewmovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Userviewmovie],
    }).compileComponents();

    fixture = TestBed.createComponent(Userviewmovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
