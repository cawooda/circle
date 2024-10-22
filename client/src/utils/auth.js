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
    localStorage.setItem("id_token", JSON.stringify(userToken));
    return null;
  }

  getToken() {
    try {
      const tokenString = localStorage.getItem("id_token");
      const userToken = JSON.parse(tokenString);
      if (!userToken) return null;
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
            `Response could not be parsed to json : url${URL} status:${res?.status}`
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
          `Response could not be parsed to json : url${URL} status:${res?.status}`
        );
      }

      if (res?.token) {
        localStorage.setItem("id_token", JSON.stringify(res.token));
        localStorage.setItem("user_signed_up", "true");
        return res;
      }
    } catch (error) {
      console.log(error.message);
      return { message: error.message };
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
      let res;
      if (response.headers.get("content-type").match(/json/)) {
        res = await response.json();
        if (res?.token) {
          localStorage.setItem("id_token", JSON.stringify(res.token));
          localStorage.setItem("user_signed_up", "true");
          return res;
        } else {
          if (res.notFound) return { ...res, message: "We couldnt find you" };
          if (res.message.match(/^PASSWORD: Seems that password didnt work/))
            return { ...res, message: res.message };
        }
      } else {
        throw new Error(
          `Response could not be parsed to json : url${URL} status:${res?.status}`
        );
      }
    } catch (error) {
      console.log("error in client side auth", error);
      return { error: true, message: error.message };
    }
  }

  async verifySmsCode(code) {
    const URL = "/api/users";
    let response = { statusCode: 500, message: "" };
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authLinkNumber: code }),
      });
      let res;
      if (!response)
        throw new Error(
          `NO_RESPONSE: We coulndt get a response from the server`
        );
      if (response.headers.get("content-type").match(/json/)) {
        res = await response.json();
        if (res?.token) {
          localStorage.setItem("id_token", JSON.stringify(res.token));
          localStorage.setItem("user_signed_up", "true");
          return res;
        } else {
          if (res?.notFound)
            throw new Error(
              "NOT_FOUND: looks like there's no user with that phone number",
              res.error
            );
          throw new Error("NO_TOKEN: looks like there's no token", res.error);
        }
      } else {
        throw new Error(
          `JSON_ERROR: Response could not be parsed to json : url${URL} status:${res?.status}`
        );
      }
    } catch (error) {
      console.log("error in index.js ", error);
      if (error.message.match(/^NO_TOKEN:/))
        return {
          error: true,
          message: "We coulnd't verify you. Have you registered with us?",
        };
      if (error.message.match(/^NOT_FOUND:/))
        return {
          error: true,
          message: "We didnt find a user with that mobile. Have you signed up?",
        };
      if (error.message.match(/^JSON_ERROR:/))
        return {
          error: true,
          message: "We had a problem with the server response. Sorry.",
        };
      if (error.message.match(/^NO_RESPONSE:/))
        return {
          error: true,
          message: error.message,
        };

      return {
        message: error.message,
      };

      return { message: error.message };
    }
  }

  logout() {
    localStorage.removeItem("id_token");
  }
}

export default new AuthService();
