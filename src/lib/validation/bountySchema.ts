import * as z from 'zod';

export const bountySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(20, "Please provide more details in the description (at least 20 chars)"),
  category: z.string().min(1, "Please select a category"),
  reward_amount: z.coerce.number().positive("Reward must be a positive number"),
  reward_asset: z.string().default('XLM'),
  difficulty: z.string().optional(),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, { message: "Deadline must be in the future" }),
  external_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export type BountyFormValues = z.infer<typeof bountySchema>;
