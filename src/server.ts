import app from "./app";
import { env } from "./config/env";
// import "~/common/events/activity.listener";


import { AppDataSource } from './config/database';

const startServer = async () => {

    AppDataSource.initialize()
        .then(() => console.log('Database connected'))
        .catch(err => console.error('Database connection failed:', err));

    app.listen(env.port, "0.0.0.0", () => {
        console.log(` Server running on port ${env.port}`);
    });
};

startServer();
