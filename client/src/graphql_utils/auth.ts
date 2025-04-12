import { STORAGE_KEY } from "@/utils/constants";
import { jwtDecode, JwtPayload } from "jwt-decode";

type DecodedUser = {
  _id: string;
  username: string;
};

class AuthService {
  static getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  static setToken(token: string) {
    localStorage.setItem(STORAGE_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(STORAGE_KEY);
  }

  static decodeToken(token: string): DecodedUser | null {
    try {
      const payload = jwtDecode<JwtPayload & { data?: DecodedUser }>(token);
      return payload?.data ?? null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  static redirectTo(path = "/") {
    window.location.assign(path);
  }
}

export default AuthService;
