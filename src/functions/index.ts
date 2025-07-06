import { app } from '@azure/functions';

import { GetSchema } from './schema/GetSchema';
import { CreateOrUpdateSchema } from './schema/CreateOrUpdateSchema';

import { GetTasks } from './task/GetTasks';
import { InsertTask } from './task/InsertTask';
import { UpdateTask } from './task/UpdateTask';
import { DeleteTask } from './task/DeleteTask';

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

app.http('GetTasks', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: GetTasks
});

app.http('InsertTask', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: InsertTask
});

app.http('UpdateTask', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: UpdateTask,
});

app.http('DeleteTask', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: DeleteTask,
});