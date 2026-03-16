import { jwtDecode } from "jwt-decode";

const AuthService = {
  addUser: async (contact) => {
    const URL = "/graphql";
    const ADD_USER = require("./mutations");
    const { mobile, email } = contact;
    if (!mobile && !email) throw new Error("addUser needs an email or mobile");
    const reqBody = {
      query: ADD_USER,
      operationName: "addUser",
      variables: {
        contact
      },
    };
    const response = await fetch(URL,{
      method: "POST",
      headers: {
          "Content-Type": "application/json",
        },
        body: reqBody,
    })
    res = await response.json();
    console.log(res);
  }, 
  loginUser: async (contact, password) => {},
  logoutUser: async () = {}
};

export default AuthService;
