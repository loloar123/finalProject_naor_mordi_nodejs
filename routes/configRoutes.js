const indexR = require("./index");
const usersR = require("./users");
const ordersR = require("./orders");
const categoriesR = require("./categories");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/orders",ordersR);
  app.use("/categories",categoriesR);
}