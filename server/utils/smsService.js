require("dotenv").config();

class SMSService {
  constructor() {
    this.apiUrl = process.env.CLICK_SEND_URL_SEND_ENDPOINT;
    this.headers = new Headers();
    const clickToken = Buffer.from(process.env.CLICKTOKEN).toString("base64");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", `Basic ${clickToken}`);
  }

  async sendText(to, body, endpoint) {
    const protocol = "http"; // Get the request protocol (http or https)
    const host = process.env.HOST || "localhost"; // Get the host (hostname:port)
    // Define your endpoint path

    const fullUrl = `${protocol}://${host}${endpoint}`;
    const fetch = (await import("node-fetch")).default;
    console.log(fullUrl);
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

    fetch(process.env.CLICK_SEND_URL_SEND_ENDPOINT, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
}
module.exports = { SMSService };
