import { jwtDecode } from "jwt-decode";
import { print } from "@apollo/client/utilities";

import { LOGIN_USER, ADD_USER, LOGOUT_USER } from "./mutations";

const URL = "/graphql";

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
    const { mobile, email } = contact;
    if (!mobile && !email) throw new Error("addUser needs an email or mobile");
    const reqBody = JSON.stringify({
      query: print(ADD_USER),
      operationName: "AddUser",
      variables: { input: userData },
    });
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const res = await response.json();
    return res;
  },
  loginUser: async (contact, password) => {
    if (!password)
      throw new Error("loginUser in client auth needs a password to proceed");
    const { mobile, email } = contact;
    if (!mobile && !email) throw new Error("addUser needs an email or mobile");
    const reqBody = {
      query: print(LOGIN_USER),
      variables: {
        contact: { mobile, email },
        password: password,
      },
    };
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const res = await response.json();
    return res;
  },
  verifySmsCode: async (code) => {
    let response = { statusCode: 500, message: "" };
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authLinkNumber: code }),
      });

      if (!response)
        throw new Error(
          `NO_RESPONSE: We coulndt get a response from the server`
        );
      if (response.headers.get("content-type").match(/json/)) {
        const res = await response.json();
        if (res?.token) {
          localStorage.setItem("id_token", res.token);
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
  },
  logout: async () => {
    localStorage.removeItem("id_token");

    const reqBody = {
      query: print(LOGOUT_USER),
      operationName: "logoutUser",
    };
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const res = await response.json();
    console.log(res.logoutUser);
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
