import { Hono } from 'hono';

import v1 from "./v1";

const app = new Hono()
    .route('/v1', v1);
    
export default app;