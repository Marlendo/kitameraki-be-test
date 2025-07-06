import { app } from '@azure/functions';
import './functions';

app.setup({
    enableHttpStream: true,
});

export default app;
