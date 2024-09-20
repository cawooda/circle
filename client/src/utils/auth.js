//Issues
//This code should be importing and handling functions to update user context rather than having
//it spread out in the code calling this servce

// use this to decode a token and get the user's information out of it
import { jwtDecode } from "jwt-decode";

// create a new class to instantiate for a user
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

  // check if user's logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
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
    if (localStorage.getItem("id_token")) {
      return localStorage.getItem("id_token");
    }
    return null;
  }
  async smsLinkLogin(userData) {
    if (userData.mobile) {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, linkRequest: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      if (response.ok) {
        const res = await response.json();

        this.setToken(res.token);
        return res;
      }
    } else {
      return null;
    }
  }

  async resetPassword(userData) {
    if (userData.mobile) {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, link: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      if (response.ok) {
        const res = await response.json();
        return res;
      }
    } else {
      return null;
    }
  }
  async signUpUser(userData) {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      if (response.ok) {
        const res = await response.json();
        if (res.user.token) {
          localStorage.setItem("id_token", res.token);
          localStorage.setItem("user_signed_up", res.user.mobile);
          return res;
        }
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(userData) {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    if (response.ok) {
      const res = await response.json();
      if (res.token) {
        localStorage.setItem("id_token", res.token);
        localStorage.setItem("user_signed_up", res.user.mobile);
        return res;
      }
      return res;
    }
    return response;
  }

  async verifySmsCode(code) {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authLinkNumber: code }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const res = await response.json();

    console.log("res", res);
    const token = res.token;
    console.log("token", token);
    if (token) {
      console.log(token);
      localStorage.setItem("id_token", token);
      return res;
    }
    if (!res.validCode) {
      this.logout();
      return res;
    } else {
      return res;
    }
    return res;
  }

  logout() {
    localStorage.removeItem("id_token");
  }
}

export default new AuthService();
