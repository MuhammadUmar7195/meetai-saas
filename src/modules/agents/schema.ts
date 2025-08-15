import zod from "zod";

export const agentSchema = zod.object({
  name: zod.string().min(1, {
    message: "Name is required",
  }),
  instructions: zod.string().min(1, {
    message: "Instructions are required",
  }),
});
