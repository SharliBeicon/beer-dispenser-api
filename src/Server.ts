import express from "express";
import Config from "./config/Config";
import router from './Router'
import Database from "./database/Database";

const app = express();

app.listen(Config.port, () =>{
    console.log(`\nApp listening at  http://l27.0.0.1:${Config.port}\n`);
    
    Database.getInstance();
    app.use(express.json());
    app.use('/', router);
});

export default app;