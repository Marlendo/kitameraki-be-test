import { CosmosClient } from '@azure/cosmos';
import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { verifyFirebaseToken } from '../auth/auth';
import { IDynamicField } from '../../interface/form';

const defaultSchema: IDynamicField[][] = [
  [
    { id: 'title', label: 'Title', type: 'text', required: true },
    { id: 'status', label: 'Status', type: 'status', required: true },
  ],
  [{ id: 'description', label: 'Description', type: 'text', required: false }],
  [{ id: 'due', label: 'Due Date', type: 'datetime', required: true }],
];

export async function GetSchema(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const db = client.database('TaskApp');
    const container = db.container('FormSchemas');

    const authHeader = request.headers.get('authorization');
    const user = await verifyFirebaseToken(authHeader);
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log(user)
    const uid = user.uid;

    const result = await container.items
      .query({
        query: 'SELECT * FROM c WHERE c.uid = @uid',
        parameters: [{ name: '@uid', value: uid }],
      })
      .fetchNext();

    if (result.resources.length === 0) {
      return { status: 200, jsonBody: { schema: defaultSchema, fromDefault: true } };
    }

    return {
      status: 200,
      jsonBody: {
        schema: result.resources[0].schema,
        updatedAt: result.resources[0].updatedAt,
        fromDefault: false,
      },
    };
  } catch (err: any) {
    context.error('Error:', err);
    return { status: 500, jsonBody: { error: err.message || 'Internal Server Error' } };
  }
}
