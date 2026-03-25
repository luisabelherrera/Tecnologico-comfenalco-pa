import { Periodo } from 'src/app/models/entity/Periodo.interface';

export interface PeriodoCreationData extends Partial<Periodo> {
  diaInicio?: number;
  mesInicio?: number;
  diaFin?: number;
  mesFin?: number;
}