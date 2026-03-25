import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciosNiveleducativoComponent } from './precios-niveleducativo.component';

describe('PreciosNiveleducativoComponent', () => {
  let component: PreciosNiveleducativoComponent;
  let fixture: ComponentFixture<PreciosNiveleducativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreciosNiveleducativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciosNiveleducativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
