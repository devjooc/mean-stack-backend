import * as mongodb from 'mongodb';
import {Employee} from "../models/Employee";

// define collections
export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};

export const connectToDB = async (uri: string) => {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackProject");
    await applySchemaValidation(db);

    collections.employees = db.collection<Employee>("employees");

}

const applySchemaValidation = async (db: mongodb.Db) => {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is a string",
                    enum: ["junior", "mid", "senior"]
                }
            }
        }
    };

    await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName == "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema})
        }
    });

};

