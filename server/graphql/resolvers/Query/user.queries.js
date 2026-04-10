module.exports = {
  me: async (_parent, _args, context) => {
    console.log("resolver user", context.user);
    return { user: context.user };
  },
  user: async (_parent, args, context) => {},
};
