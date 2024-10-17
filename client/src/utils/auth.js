import { jwtDecode } from "jwt-decode";

class AuthService {
  getProfile() {
    try {
      const token = this.getToken();
      if (!token) return null;
      const profile = jwtDecode(token);
      return profile;
    } catch (error) {
      console.log("Error in getProfile:", error);
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    return Boolean(token) && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(token) {
    localStorage.setItem("id_token", token);
    return null;
  }

  getToken() {
    try {
      const tokenString = localStorage.getItem("id_token");
      if (!tokenString) return null;
      const parsed = JSON.parse(tokenString);
      return parsed?.token || null;
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  }

  async smsLinkLogin(userData) {
    const URL = "/api/users";
    try {
      if (userData.mobile) {
        const response = await fetch(URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData, linkRequest: true }),
        });
        let res;
        if (response.headers.get("content-type").match(/json/)) {
          res = await response.json();
        } else {
          throw new Error(
            `Response could not be parsed to json : url${URL} status:${res.status}`
          );
        }
        if (res.linkSent) return true;
      }
    } catch (error) {}
  }

  async signUpUser(userData) {
    const URL = "/api/users";
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      let res;
      if (!response.errorCode == "MOBILE_INVALID") {
        throw new Error("mobile was invalid");
      }
      if (response.headers.get("content-type").match(/json/)) {
        res = await response.json();
      } else {
        throw new Error(
          `Response could not be parsed to json : url${URL} status:${res.status}`
        );
      }

      if (res?.token) {
        localStorage.setItem("id_token", res.token);
        localStorage.setItem("user_signed_up", "true");
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(userData) {
    const URL = "/api/users";
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      if (!response) {
        throw new Error("Failed to fetch");
      }

      const res = await response.json();
      if (res.error) {
        throw new Error(res.message);
      }
      if (res.error) {
        throw new Error("Something went Wrong");
      }
      if (res?.token) {
        localStorage.setItem("id_token", res.token);
        localStorage.setItem("user_signed_up", "true");
        return res;
      }
      return false;
    } catch (error) {
      console.log("error in client side auth", error);
      return { message: error.message };
    }
  }

  async verifySmsCode(code) {
    const URL = "/api/users";
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authLinkNumber: code }),
      });
      let res;

      if (response.headers.get("content-type").match(/json/)) {
        res = await response.json();
      } else {
        throw new Error(
          `Response could not be parsed to json : url${URL} status:${res.status}`
        );
      }
      if (res?.token) {
        localStorage.setItem("id_token", res.token);
        localStorage.setItem("user_signed_up", "true");
        return res;
      } else throw new Error("looks like there's no token", res.error);
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    localStorage.removeItem("id_token");
  }
}

export default new AuthService();
