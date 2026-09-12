import { z } from "zod";

export const messageSchema = z.object({

    content: z.string()
        .min(10, { message: "Message Must be at least 10 characters long" })
        .max(500, { message: "Message Must be at most 500 characters long" })

});