export interface HttpSuccessResponse {
  data: any;
  http_code: number;
}

export interface HttpErrorResponse {
  http_code: number;
  status: string;
  error: string;
}
