import { z } from "zod";

const serviceSchema = z.object({
  service: z.enum(["describe", "generate", "edit", "no-option"]).describe("The chosen service, must be one of the options provided."),
  output: z.string().optional().describe("Message that assists the user")
});


export default serviceSchema;