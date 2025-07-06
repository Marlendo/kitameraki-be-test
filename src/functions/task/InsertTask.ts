import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { verifyFirebaseToken } from "../auth/auth";
import { v4 as uuidv4 } from 'uuid';

const fixedFieldIds = ['title', 'status', 'due'];

export async function InsertTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
        const db = client.database("TaskApp");
        const container = db.container("Tasks");

        const authHeader = request.headers.get("authorization");
        const user = await verifyFirebaseToken(authHeader);
        const uid = user.uid;

        const body: any = await request.json();

        if (typeof body !== "object" || Array.isArray(body)) {
            return {
                status: 400,
                jsonBody: { error: "Invalid task format" },
            };
        }

        const missingFields = fixedFieldIds.filter((field) => !(field in body));
        if (missingFields.length > 0) {
            return {
                status: 400,
                jsonBody: {
                    error: `Missing required field(s): ${missingFields.join(', ')}`,
                },
            };
        }

        const task = {
            ...body,
            id: uuidv4(),
            uid,
            createdAt: new Date().toISOString(),
        };

        await container.items.create(task);

        return {
            status: 201,
            jsonBody: {
                message: "Field inserted successfully",
                data: task,
            },
        };
    } catch (error) {
        context.error('Error:', error);
        return { status: 500, jsonBody: { error: error.message || 'Internal Server Error' } };
    }
};
