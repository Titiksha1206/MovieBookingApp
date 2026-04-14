import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminaddmovie } from './adminaddmovie';

describe('Adminaddmovie', () => {
  let component: Adminaddmovie;
  let fixture: ComponentFixture<Adminaddmovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminaddmovie],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminaddmovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
