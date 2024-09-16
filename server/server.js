require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");

const express = require("express");
const app = express();

const morgan = require("morgan");
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const { authMiddleware } = require("./utils/auth");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

//import schemas and typeDefs
const { typeDefs, resolvers } = require("./schemas");
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const db = require("./config/connection");

const apiRoutes = require("./controllers/API");

const startApolloServer = async () => {
  await server.start();
  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

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
