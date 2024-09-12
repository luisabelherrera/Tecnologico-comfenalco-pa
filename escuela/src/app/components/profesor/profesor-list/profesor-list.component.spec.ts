import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorListComponent } from './profesor-list.component';

describe('ProfesorListComponent', () => {
  let component: ProfesorListComponent;
  let fixture: ComponentFixture<ProfesorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfesorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
