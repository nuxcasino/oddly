import { fetchSportsData, fetchTopSportsList, getSportsByCountry } from '@/services/sportService';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';


const langIdValidator = z.string().refine(value => ['en', 'bn', 'hi'].includes(value), {
    message: 'langId must be one of: en, bn, hi'
});
const app = new Hono()
    .get("/sports",
        zValidator("query", z.object({
            live: z.string().optional().default("true"),
            langId: langIdValidator.optional().default("en"),
            partnerId: z.string().optional(),
            countryCode: z.string().optional().default("19")
        })),
        async (c) => {
            try {
                const dto = await fetchSportsData(c);
                return c.json({ data: dto });
            } catch (error: any) {
                return c.json({ error: error.message }, 500);
            }
        })
    .get("/gettopsportslist",
        zValidator("query", z.object({
            live: z.string().optional().default("true"),
            startDate: z.date().optional().default(new Date()),
            endDate: z.date().optional().default(new Date()),
            langId: langIdValidator.optional().default("en"),
            partnerId: z.string().optional(),
            countryCode: z.string().optional().default("19")
        })),
        async (c) => {
            try {
                const dto = await fetchTopSportsList(c);
                return c.json({ data: dto });
            } catch (error: any) {
                return c.json({ error: error.message }, 500);
            }
        })
    .get("/get-sport-by-country",
        zValidator("query", z.object({
            live: z.string().optional().default("true"),
            langId: langIdValidator.optional().default("en"),
            partnerId: z.string().optional(),
            countryCode: z.string().optional().default("19")
        })),
        async (c) => {
            try {
                const dto = await getSportsByCountry(c);
                return c.json({ data: dto });
            } catch (error: any) {
                return c.json({ error: error.message }, 500);
            }
        }
    )
export default app;