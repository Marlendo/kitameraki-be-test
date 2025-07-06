import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { verifyFirebaseToken } from "../../firebase/auth";

export async function GetTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const db = client.database("TaskApp");
    const container = db.container("Tasks");

    const authHeader = request.headers.get("authorization");
    const user = await verifyFirebaseToken(authHeader);
    const uid = user.uid;

    const body: any = await request.json();
    const page = parseInt(body.page ?? "1", 10);
    const limit = parseInt(body.limit ?? "10", 10);
    const search = (body.search ?? "").trim();
    const filter = (body.filter ?? "").trim();

    const offset = (page - 1) * limit;

    const whereClauses = [`c.uid = @uid`];
    const parameters = [{ name: "@uid", value: uid }];

    if (filter) {
        whereClauses.push(`c.status = @filter`);
        parameters.push({ name: "@filter", value: filter });
    }

    if (search) {
        whereClauses.push(`CONTAINS(LOWER(c.title), @search)`);
        parameters.push({ name: "@search", value: search.toLowerCase() });
    }

    const where = whereClauses.join(" AND ");

    const querySpec = {
        query: `
            SELECT * FROM c
            WHERE ${where}
            ORDER BY c._ts DESC
            OFFSET @offset LIMIT @limit
        `,
        parameters: [
            ...parameters,
            { name: "@offset", value: offset },
            { name: "@limit", value: limit },
        ],
    };

    const { resources: tasks } = await container.items.query(querySpec).fetchAll();

    const countQuery = {
        query: `SELECT VALUE COUNT(1) FROM c WHERE ${where}`,
        parameters,
    };

    const { resources: totalResult } = await container.items.query(countQuery).fetchAll();
    const total = totalResult[0] || 0;

    return {
        status: 200,
        jsonBody: {
            list: tasks,
            meta: {
                page,
                limit,
                total,
            },
        },
    };
}
