import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Importar módulo de testing para HttpClient
import { CrearNotificacionComponent } from './crear-notificacion.component';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';


describe('CrearNotificacionComponent', () => {
  let component: CrearNotificacionComponent;
  let fixture: ComponentFixture<CrearNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ Importar módulo de pruebas para HttpClient
      declarations: [CrearNotificacionComponent],
      providers: [NotificacionService], // ✅ Proveer el servicio
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
