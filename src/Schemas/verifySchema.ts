import { z } from "zod";

export const verifySchema = z.object({

    code: z.string().regex(/^\d{6}$/, {
        error: "Verification code must be exactly 6 digits",
    })

});
