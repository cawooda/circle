// use this to decode a token and get the user's information out of it
import { jwtDecode } from "jwt-decode";

// create a new class to instantiate for a user
class AuthService {
  constructor() {
    if (this.isTokenExpired(this.getProfile())) this.logout();
  }
  // get user data
  getProfile() {
    try {
      const profile = jwtDecode(this.getToken());
      return profile;
    } catch (error) {}
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

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }
  async smsLinkLogin(userData) {
    if (userData.mobile) {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, link: true }),
      });
      if (response.ok) {
        const res = await response.json();
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
      if (response.ok) {
        const res = await response.json();
        localStorage.setItem("id_token", res.user.token);
        return res;
      }
      return response;
    } catch (error) {
      //alert error message
    }
  }

  async loginUser(userData, authLink) {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData, authLink: true }),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem("id_token", res.user.token);
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

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem("id_token", res.user.token);
      return res;
    }
    return response;
  }
  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
  }
}

export default new AuthService();
