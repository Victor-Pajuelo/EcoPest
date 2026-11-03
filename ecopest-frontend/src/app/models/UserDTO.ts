export class UserDTO {
  idUser: number | null = null;
  name: string = '';
  email: string = '';
  password: string = '';
  roleId: number | null = null;
  businessEntityId: number | null = null;
  active: boolean = true;
}
