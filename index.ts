import express, { Application, NextFunction, Request, Response } from "express";
import cartRoutes from "./src/routes/cart.route";
import adminRoutes from "./src/routes/admin.routes";
import client from "./src/database";

const app: Application = express();

app.use(express.json());

app.use("/admin", adminRoutes);

app.use("/cart", cartRoutes);


app.listen(3000, () => console.log(`listening on port 3000`));
