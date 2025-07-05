import { CosmosClient } from '@azure/cosmos';
import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { verifyFirebaseToken } from '../auth/auth'; // ini harus udah kamu buat
import { IDynamicField } from '../../interface/form';

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
const db = client.database('TaskApp');
const container = db.container('FormSchemas');

export async function CreateOrUpdateSchema(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const authHeader = request.headers.get('authorization');
        const user = await verifyFirebaseToken(authHeader);
        const uid = user.uid;

        const body: any = await request.json();
        const schema = body.schema as IDynamicField[][];

        if (!Array.isArray(schema)) {
            return { status: 400, jsonBody: { error: 'Invalid schema format' } };
        }

        const updatedAt = new Date().toISOString();

        // cek apakah schema sudah ada
        const existing = await container.items
            .query({
                query: 'SELECT * FROM c WHERE c.uid = @uid',
                parameters: [{ name: '@uid', value: uid }],
            })
            .fetchNext();

        if (existing.resources.length > 0) {
            // update
            const item = existing.resources[0];
            item.schema = schema;
            item.updatedAt = updatedAt;

            await container.item(item.id, item.id).replace(item);

            return { status: 200, jsonBody: { message: 'Schema updated', updatedAt } };
        } else {
            const newDoc = {
                id: uid,
                uid,
                schema,
                updatedAt,
            };

            await container.items.create(newDoc);

            return { status: 201, jsonBody: { message: 'Schema created', updatedAt } };
        }
    } catch (err: any) {
        context.error('Error:', err);
        return { status: 500, jsonBody: { error: err.message || 'Internal Server Error' } };
    }
}
