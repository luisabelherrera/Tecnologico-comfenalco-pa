import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionEducativaComponent } from './informacion-educativa.component';

describe('InformacionEducativaComponent', () => {
  let component: InformacionEducativaComponent;
  let fixture: ComponentFixture<InformacionEducativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacionEducativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionEducativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
