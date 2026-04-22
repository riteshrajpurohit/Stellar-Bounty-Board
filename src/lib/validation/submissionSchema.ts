import * as z from 'zod';

export const submissionSchema = z.object({
  notes: z.string().min(10, "Provide some notes explaining your submission (min 10 chars).").max(1000, "Notes are too long."),
  submission_link: z.string().url("Must be a valid URL (e.g. GitHub link)").optional().or(z.literal('')),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
