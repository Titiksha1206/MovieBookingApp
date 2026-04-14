import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminviewmovie } from './adminviewmovie';

describe('Adminviewmovie', () => {
  let component: Adminviewmovie;
  let fixture: ComponentFixture<Adminviewmovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminviewmovie],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminviewmovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
