require("dotenv").config();

class SMSService {
  constructor() {
    this.apiUrl = process.env.CLICK_SEND_URL_SEND_ENDPOINT;
    this.headers = new Headers();

    const clickToken =
      Buffer.from(process.env.CLICKTOKEN).toString("base64") || "";
    if (clickToken) {
      this.tokenPresent = true;
      this.headers.append("Content-Type", "application/json");
      this.headers.append("Authorization", `Basic ${clickToken}`);
    }
  }

  async sendText(to, body, endpoint) {
    try {
      if (!this.tokenPresent) {
        throw new Error("No token present");
      }
      const host = process.env.HOST || `http://localhost:${process.env.PORT}`; // Get the host (hostname:port)
      // Define your endpoint path

      const fullUrl = `${host}${endpoint ? endpoint : ""}`;
      const fetch = (await import("node-fetch")).default;

      const raw = JSON.stringify({
        messages: [
          {
            body: `${body} ${fullUrl ? fullUrl : ``}`,
            to,
            from: "Circle",
          },
        ],
      });
      const requestOptions = {
        method: "POST",
        headers: this.headers,
        body: raw,
        redirect: "follow",
      };

      if (!process.env.TESTING_AVOID_SMS) {
        fetch(process.env.CLICK_SEND_URL_SEND_ENDPOINT, requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      } else {
        console.log(requestOptions);
      }
    } catch (error) {
      console.log(error);
      return { error, success: false, message: error.message };
    }
  }
}
module.exports = { SMSService };
