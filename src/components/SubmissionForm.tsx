import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '../hooks/useWallet';
import { useCreateSubmission } from '../hooks/useSubmissionActions';
import { useToast } from './ui/toast';
import { submissionSchema, type SubmissionFormValues } from '../lib/validation/submissionSchema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const SubmissionForm = ({ bountyId }: { bountyId: string }) => {
  const { address } = useWallet();
  const createSubmission = useCreateSubmission();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema) as any,
    defaultValues: {
      notes: "",
      submission_link: "",
    }
  });

  const onSubmit = async (values: SubmissionFormValues) => {
    if (!address) return;
    
    try {
      await createSubmission.mutateAsync({
        bounty_id: bountyId,
        submitter_wallet: address,
        notes: values.notes,
        submission_link: values.submission_link,
      });
      reset();
      toast('Submission received! The creator will review your work shortly.', 'success');
    } catch (error: any) {
      console.error('Failed to submit', error);
      toast(error?.message || 'Failed to save submission. Please ensure you are connected.', 'error');
    }
  };

  if (createSubmission.isSuccess) {
    return (
      <Card className="glass-shadow border-emerald-500/20 bg-emerald-50/50">
        <CardContent className="pt-6 text-center text-emerald-600">
          <h3 className="font-semibold mb-1">Submission Received!</h3>
          <p className="text-sm">The creator will review your work shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-shadow">
       <CardHeader>
        <CardTitle className="text-lg">Submit Your Work</CardTitle>
       </CardHeader>
       <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supporting Link (Github, Figma, etc)</label>
              <Input type="url" {...register('submission_link')} placeholder="https://..." />
              {errors.submission_link && <p className="text-xs text-red-500">{errors.submission_link.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Submission Notes *</label>
              <Textarea {...register('notes')} placeholder="Explain what you built..." className="min-h-[100px]" />
              {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {createSubmission.isError && <p className="text-xs text-red-500">Failed to save submission. Ensure you are connected.</p>}
              <Button type="submit" className="w-full" disabled={createSubmission.isPending || !address}>
                {createSubmission.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting</> : "Submit Solution"}
              </Button>
            </div>
          </form>
       </CardContent>
    </Card>
  );
};
