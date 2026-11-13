import { ClimaActualDTO } from './ClimaActualDTO';

export class ClimaDTO {
  latitude: number = 0;
  longitude: number = 0;
  timezone: string = '';
  current: ClimaActualDTO = new ClimaActualDTO();
}
