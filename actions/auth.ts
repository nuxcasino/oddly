"use server";

import { currentUser } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from "drizzle-orm";
export async function createUser() {
  const user = await currentUser();
  if (!user) return console.log("user not found");
  
  const [data] = await db.select({
        id: accounts.id,
        name: accounts.name
    }).from(accounts)
    .where(
        and(
            eq(accounts.userId, user.id),
        )
    );
    if(!data){
        await db.insert(accounts)
        .values({  
            id: createId(),
            userId: user.id,
            name: user.username ?? ""
        })
    }
}