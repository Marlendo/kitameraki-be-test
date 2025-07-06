import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { verifyFirebaseToken } from "../auth/auth";

const fixedFieldIds = ['id', 'title', 'status', 'due'];

export async function UpdateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const taskId = body.id;

    // 🔍 Cek apakah task exist dan milik user
    const { resources } = await container.items
      .query({
        query: `SELECT * FROM c WHERE c.id = @id AND c.uid = @uid`,
        parameters: [
          { name: "@id", value: taskId },
          { name: "@uid", value: uid },
        ],
      })
      .fetchAll();

    if (resources.length === 0) {
      return {
        status: 404,
        jsonBody: { error: "Task not found or unauthorized" },
      };
    }

    const existingTask = resources[0];

    const updatedTask = {
      ...existingTask,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await container.item(taskId, uid).replace(updatedTask);

    return {
      status: 200,
      jsonBody: {
        message: "Task updated successfully",
        data: updatedTask,
      },
    };
  } catch (error) {
    context.error("Error:", error);
    return { status: 500, jsonBody: { error: error.message || "Internal Server Error" } };
  }
}
