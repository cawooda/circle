require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3002;

const express = require("express");
const app = express();

const { authMiddleware } = require("./utils/auth");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

//import schemas and typeDefs
const { typeDefs, resolvers } = require("./schemas");
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//require the connection to Mongoose for MongoDb database
const db = require("./config/connection");

const apiRoutes = require("./controllers/API");

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  //if any user gets a token, they can query any grapghql query and any data. How can we set what users can query and what restrictions
  // are in place based on token? role? etc.

  app.use("/api", apiRoutes);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
};

db.once("open", () => {
  app.listen(
    PORT,
    console.log(`server running on port ${PORT} 
      http://localhost:${PORT}
      http://localhost:${PORT}/api
      http://localhost:${PORT}/graphql
      `)
  );
});

startApolloServer();
