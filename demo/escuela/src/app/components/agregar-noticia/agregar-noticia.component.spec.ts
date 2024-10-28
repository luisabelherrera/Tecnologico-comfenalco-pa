import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarNoticiaComponent } from './agregar-noticia.component';

describe('AgregarNoticiaComponent', () => {
  let component: AgregarNoticiaComponent;
  let fixture: ComponentFixture<AgregarNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarNoticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
