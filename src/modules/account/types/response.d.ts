export interface CreateAccountResponse {
  id: string;
  balance: number;
  user: {
    id: string;
    username: string;
  }
}