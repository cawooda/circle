// use this to decode a token and get the user's information out of it
import { jwtDecode } from "jwt-decode";

// create a new class to instantiate for a user
class AuthService {
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

  async loginOrCreateUser(userData) {
    // Saves user token to localStorage

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      const { user, userExists, userCreated } = await response.json();
      console.log(user);
      localStorage.setItem("id_token", user.token);
      return { user, userExists, userCreated };
    }
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
  }
}

export default new AuthService();
