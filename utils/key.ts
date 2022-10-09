import { createSecretKey } from "crypto";

export const secretKey = createSecretKey(process.env.JWT_SECRET!, "utf-8");
