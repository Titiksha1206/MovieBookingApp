import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminmanage } from './adminmanage';

describe('Adminmanage', () => {
  let component: Adminmanage;
  let fixture: ComponentFixture<Adminmanage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminmanage],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminmanage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
