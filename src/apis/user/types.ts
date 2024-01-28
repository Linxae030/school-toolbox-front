export interface LoginPayLoad {
  account: string;
  password: string;
}

export interface SignUpPayLoad {
  account: string;
  password: string;
  nickname: string;
  repeatedPassword: string;
}

export interface LoginRes {
  account: string;
  nickname: string;
  token: string;
}

export interface ProfilePayRes {
  account: string;
  nickname: string;
}
