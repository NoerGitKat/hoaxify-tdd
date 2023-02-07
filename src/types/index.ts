export type TUser = {
  username: string | null;
  email: string | null;
  password: string;
};

export type THTTPError = Error & {
  responseCode: number;
};
