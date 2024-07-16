import * as dotenv from 'dotenv'; // this is to use .env file that stores the DB URL connection string
import cors from 'cors';
import express from 'express';
import {connectToDB} from "./db/db-manager";
import * as process from "process";
import * as employeeRouter from "./routes/employee.routes";

dotenv.config();

// get DB_URL from process.env
const {DB_URL} = process.env;
const PORT = process.env.PORT ?? 3000;

if (!DB_URL) {
    console.error('No Uri provided for the DB');
    process.exit(1);
}

// connect to DB and initiate express app
connectToDB(DB_URL).then(() => {

    const app = express();
    app.use(cors());

    // define and use employee router
    app.use("/employees", employeeRouter.router);

    app.listen(PORT, () => {
        console.log(`server running and listening on port ${PORT}`);
    });

}).catch((error) => {
    console.error(`error running express: ${error}`);
})

