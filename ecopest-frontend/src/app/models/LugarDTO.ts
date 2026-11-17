import { DireccionDTO } from './DireccionDTO';

export class LugarDTO {
  display_name: string = '';
  address: DireccionDTO = new DireccionDTO();
}
