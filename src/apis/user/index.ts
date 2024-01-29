import LinRequest from "../index";
import type {
  LoginPayLoad,
  LoginRes,
  ProfilePayRes,
  SignUpPayLoad,
} from "./types";

export const getUserProfile = () => {
  return LinRequest.post<ProfilePayRes>("auth/profile");
};

export const login = (payload: LoginPayLoad) => {
  return LinRequest.post<LoginRes>("auth/login", {
    params: payload,
  });
};

export const signUp = (payload: SignUpPayLoad) => {
  return LinRequest.post("user/signup", {
    data: payload,
  });
};
