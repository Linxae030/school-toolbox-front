import { login, signUp } from "@/apis";
import { LoginPayLoad, SignUpPayLoad } from "@/apis/user/types";

export default class LoginStore {
  async loginOpr(payload: LoginPayLoad) {
    const data = await login(payload);
    return data;
  }

  async signUpOpr(payload: SignUpPayLoad) {
    const data = await signUp(payload);
    return data;
  }
}
