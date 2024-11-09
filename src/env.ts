import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
        CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
        CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
        CLOUDFLARE_BUCKET_NAME: z.string().min(1),
    },
    client: {

    },
    runtimeEnv: {
        CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
        CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME,
    }
})