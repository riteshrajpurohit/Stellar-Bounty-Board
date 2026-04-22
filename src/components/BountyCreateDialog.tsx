import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '../hooks/useWallet';
import { useCreateBounty } from '../hooks/useCreateBounty';
import { useToast } from './ui/toast';
import { bountySchema, type BountyFormValues } from '../lib/validation/bountySchema';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, Loader2 } from 'lucide-react';

export const BountyCreateDialog = () => {
  const [open, setOpen] = useState(false);
  const { address } = useWallet();
  const createBounty = useCreateBounty();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BountyFormValues>({
    resolver: zodResolver(bountySchema) as any,
    defaultValues: {
      title: "",
      description: "",
      reward_asset: "XLM",
      external_url: "",
    }
  });

  const categoryValue = watch("category");

  const onSubmit = async (values: BountyFormValues) => {
    if (!address) return;
    
    try {
      await createBounty.mutateAsync({
        ...values,
        reward_amount: Number(values.reward_amount),
        creator_wallet: address,
      });
      setOpen(false);
      reset();
      toast('Bounty published successfully! It is now live on the Marketplace.', 'success');
    } catch (error: any) {
      console.error('Failed to create bounty', error);
      toast(error?.message || 'Failed to create bounty. Please try again.', 'error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create Bounty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Bounty</DialogTitle>
          <DialogDescription>
            Fund a task and invite the Stellar community to build.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input {...register('title')} placeholder="e.g. Build a Soroban contract for swapping" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <Select value={categoryValue} onValueChange={(val) => setValue('category', val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Amount *</label>
              <Input type="number" step="0.01" {...register('reward_amount')} placeholder="e.g. 500" />
              {errors.reward_amount && <p className="text-xs text-red-500">{errors.reward_amount.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Asset</label>
              <Input {...register('reward_asset')} disabled defaultValue="XLM" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline *</label>
              <Input type="date" {...register('deadline')} />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
               <Select onValueChange={(val) => setValue('difficulty', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea {...register('description')} placeholder="Detail the requirements, acceptances criteria, and context..." className="min-h-[120px]" />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">External Reference URL (Optional)</label>
            <Input type="url" {...register('external_url')} placeholder="https://github.com/your-org/issue" />
            {errors.external_url && <p className="text-xs text-red-500">{errors.external_url.message}</p>}
          </div>

          <div className="pt-4 flex justify-end">
             {createBounty.isError && <p className="text-xs text-red-500 mr-4 self-center">Failed to create bounty. Try again.</p>}
            <Button type="submit" disabled={createBounty.isPending || !address}>
              {createBounty.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing</> : "Publish Bounty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
