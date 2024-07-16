import express from 'express';
import * as employeeCtrl from "../controllers/employee.ctrl";


// use router provided by express
export const router = express.Router();
router.use(express.json()); // to parse json requests

// define routes and link them with the controller
// post
router.post("/", employeeCtrl.createUser);

//get
router.get("/", employeeCtrl.getUsers);

// get user by id
router.get("/:id", employeeCtrl.getUser);

// put
router.put("/:id", employeeCtrl.updateUser);

// delete
router.delete("/:id", employeeCtrl.deleteUser);

