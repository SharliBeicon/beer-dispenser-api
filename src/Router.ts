import express from "express";
import DispenserHandler from "./controller/DispenserHandler";
import UserHandler from "./controller/UserHandler";
import Authentication from "./util/Authentication";

const router = express.Router();
const dispenserHandler = new DispenserHandler();
const userHandler = new UserHandler();
const authentication = new Authentication();

router.post('/dispenser', [authentication.authenticateToken, authentication.authenticateAdmin], dispenserHandler.createDispenser);
router.put('/dispenser/:id/status', authentication.authenticateToken, dispenserHandler.changeStatus);
router.get('/dispenser/:id', authentication.authenticateToken, dispenserHandler.getDispenser);
router.delete('/dispenser/:id',[authentication.authenticateToken, authentication.authenticateAdmin], dispenserHandler.deleteDispenser);

router.post('/register', userHandler.register);
router.post('/login', userHandler.login);

export default router;


