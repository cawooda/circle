import { jwtDecode } from "jwt-decode";
import { print } from "@apollo/client/utilities";

import { LOGIN_USER, ADD_USER, LOGOUT_USER } from "./mutations";
import { GET_ME } from "./queries";
const GRAPHQLENDPOINT = "/graphql";

const AuthService = {
  setToken: async (token) => {
    localStorage.setItem("id_token", token);
    return true;
  },
  getToken: () => {
    try {
      const token = localStorage.getItem("id_token");
      if (!token) throw new Error("No token present");
      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  addUser: async (userData) => {
    const URL = "/api/signup";
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const res = await response.json();
    return res;
  },
  loginUser: async (contact, password) => {
    //loginUser should request to the api controller with a Post request to /api/login
    const URL = "/api/login";
    if (!password)
      throw new Error("loginUser in client auth needs a password to proceed");
    const { mobile, email } = contact;
    if (!mobile && !email) throw new Error("login needs contact");
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, password }),
    });
    const res = await response.json();
    return res;
  },
  getMe: async () => {
    const reqBody = {
      query: print(GET_ME),
      operationName: "getMe",
    };
    const response = await fetch(GRAPHQLENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    console.log(response);
    const res = await response.json();
    return res;
  },
  updateUserPassword: async (code, password) => {
    const URL = "/api/updateuserpassword";
    let response = { statusCode: 500, message: "" };
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authCode: code, password: password }),
      });
      if (!response)
        throw new Error(
          `NO_RESPONSE: We coulndt get a response from the server`
        );
      const { success, message } = await response.json();
      return { success, message };
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
  },
  logout: async () => {
    localStorage.removeItem("id_token");
  },
  loggedIn: () => {
    const token = localStorage.getItem("id_token");
    console.log(token);
    return token ? true : false;
  },
  getProfile: () => {
    try {
      const token = this.getToken();
      if (!token) return null;
      const profile = jwtDecode(token);
      return profile;
    } catch (error) {
      console.log("Error in getProfile:", error);
      return null;
    }
  },
  smsLinkLogin: async (userData) => {
    const APIURL = "/api/users";
    try {
      if (userData.mobile) {
        const response = await fetch(APIURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...userData, linkRequest: true }),
        });

        if (response.headers.get("content-type").match(/json/)) {
          const res = await response.json();
          console.log(res);
        } else {
          throw new Error(
            `Response could not be parsed to json : url${APIURL} status:${res?.status}`
          );
        }
        if (res.linkSent) return true;
      }
    } catch (error) {}
  },
};

export default AuthService;
