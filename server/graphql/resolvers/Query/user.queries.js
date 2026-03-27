module.exports = {
  me: async (_parent, _args, context) => {
    return context.user;
  },
  user: async (_parent, args, context) => {},
};
