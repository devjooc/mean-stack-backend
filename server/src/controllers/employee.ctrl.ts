import {collections} from "../db/db-manager";
import * as mongodb from "mongodb";
import {NextFunction, Request, Response} from "express";
import {Employee} from "../models/Employee";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get employee from request body
        const employee: Employee = req.body;
        const result = await collections.employees?.insertOne(employee);

        if (result!.acknowledged) {
            res.status(201).send(`employee created successfully with ID: ${result!.insertedId}`);
        } else {
            res.status(500).send(`error creating new employee`);
        }

    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await collections.employees?.find({}).toArray();
        res.status(200).send(employees);
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get id from request params
        const id = req?.params?.id;
        // create query for the search
        const query = {'_id': new mongodb.ObjectId(id)};
        // find
        const employee = await collections.employees?.findOne(query);
        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee with ID: ${id}`);
        }

    } catch (error: any) {
        console.error(error);
        res.status(404).send(`Failed to find an employee with ID: ${req?.params?.id}. error message: ${error.message}`);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get id from request params
        const id = req?.params?.id;
        const employee = req?.body;
        // create query for the search
        const query = {'_id': new mongodb.ObjectId(id)};
        // find
        const result = await collections.employees?.updateOne(query, {$set: employee});
        // check result
        if (result && result.matchedCount) {
            res.status(200).send(`employee update successfully`);
        } else if (!result!.matchedCount) {
            res.status(404).send(`Failed to update an employee with ID: ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee with ID: ${id}`);
        }

    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get id from request params
        const id = req?.params?.id;
        // create query for the search
        const query = {'_id':  new mongodb.ObjectId(id)};
        // find
        const result = await collections.employees?.deleteOne(query)
        // check result
        if (result && result.deletedCount) {
            res.status(200).send(`employee deleted successfully`);
        } else if (!result) {
            res.status(400).send(`Failed to delete an employee with ID: ${id}`);
        } else {
            res.status(404).send(`employee with ID: ${id} does not exist. result: ${result.deletedCount}`);
        }

    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
};