import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";
import sportAPI from "./sport";
//export const runtime = 'edge'

const app = new Hono().basePath("/api");
const routes = app
  .route("/sport", sportAPI)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary);


app.get('/hello',
clerkMiddleware(),
 (c) => {
  const auth = getAuth(c)
  if(!auth?.userId){
    return c.json({message: 'unauthoriz'})
  }
  return c.json({
    message: 'Hello Next.js!',
    userId: auth.userId
  })
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;