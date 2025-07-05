import { app } from '@azure/functions';

import { GetSchema } from './schema/GetSchema';
import { CreateOrUpdateSchema } from './schema/CreateOrUpdateSchema';

app.http('GetSchema', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetSchema,
});

app.http('CreateOrUpdateSchema', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateOrUpdateSchema,
});