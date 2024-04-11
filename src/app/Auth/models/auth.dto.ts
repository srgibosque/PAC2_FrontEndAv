export class AuthDTO {
  user_id: string | null;
  access_token: string | null;
  email: string;
  password: string;

  constructor(
    user_id: string | null,
    access_token: string | null,
    email: string,
    password: string
  ) {
    this.user_id = user_id;
    this.access_token = access_token;
    this.email = email;
    this.password = password;
  }
}
