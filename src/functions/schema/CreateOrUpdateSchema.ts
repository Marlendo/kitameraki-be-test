import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";


export async function CreateOrUpdateSchema(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = await request.json() as object;
    const taskId = request.query.get('id');
    const organizationId = request.query.get('organizationId');

    let patchRequests = [];

    for (let key in body) {
        patchRequests.push({
            "op": "replace",
            "path": `/${key}`,
            "value": body[key]
        });
    }

    const client = new CosmosClient(process.env["COSMOS_CONNECTION_STRING"]!);

    const createdTask = await client.database("TaskApp")
        .container("Tasks")
        .item(taskId, organizationId)
        .patch(patchRequests);

    return { jsonBody: createdTask.resource, status: 200 };
};