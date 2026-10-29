export class LoginRequestDTO {
  username: string = '';
  password: string = '';
}

export class LoginResponseDTO {
  token: string = '';
  username: string = '';
}
