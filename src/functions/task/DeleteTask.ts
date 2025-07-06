import { CosmosClient } from "@azure/cosmos";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { verifyFirebaseToken } from "../auth/auth";

export async function DeleteTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const db = client.database("TaskApp");
    const container = db.container("Tasks");

    const authHeader = request.headers.get("authorization");
    const user = await verifyFirebaseToken(authHeader);
    const uid = user.uid;

    const body: any = await request.json();
    const taskId = body?.id;

    if (!taskId) {
      return {
        status: 400,
        jsonBody: { error: "Task ID is required" },
      };
    }

    // Cek apakah task milik user
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

    // Hapus task
    await container.item(taskId, uid).delete();

    return {
      status: 200,
      jsonBody: {
        message: "Task deleted successfully",
        id: taskId,
      },
    };
  } catch (error) {
    context.error("Error:", error);
    return {
      status: 500,
      jsonBody: { error: error.message || "Internal Server Error" },
    };
  }
}
