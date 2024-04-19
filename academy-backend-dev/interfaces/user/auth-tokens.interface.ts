export interface Tokens {
  access_token: string;
  refresh_token: string;
  id_token: string;
}

export interface GoogleErrorResponse {
  error: string;
  error_description: string;
}
