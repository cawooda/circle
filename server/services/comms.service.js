module.exports = {
  CommService: {
    sendText: async ({ actor, payload }) => {},
    resetPasswordNotification: async ({ actor, payload }) => {
      const { authCode } = payload;
      if (!authCode)
        throw new Error(
          "resetPasswordNotification needs an authCode in payload",
        );
      console.log("sending email to user with...authcode", authCode);
      return true;
    },
    sendEmail: async ({ actor, payload }) => {},
  },
};
