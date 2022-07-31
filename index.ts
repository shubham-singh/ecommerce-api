import express, { Application, NextFunction, Request, Response } from "express";
import cartRoutes from "./src/routes/cart.route";
import client from "./src/database";

const app: Application = express();

app.use(express.json());

app.use(function(request: Request, response: Response, next: NextFunction) {
    try {
        const databaseState = client.currentStateOfDB();
        console.log(JSON.stringify(databaseState, null, 2));
        return next();
    } catch (error: Error | any) {
        console.error(error);
        return response.status(500).json({status: false, message: error.message || 'Something went wrong' })
    }
})

app.use("/cart", cartRoutes);

app.listen(3000, () => console.log(`listening on port 3000`));
