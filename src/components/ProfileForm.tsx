import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160, "Bio max 160 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    }
  });

  useEffect(() => {
    // Attempt to load existing profile if present
    const loadProfile = async () => {
      if (!address) return;
      setIsLoading(true);
      const { data, error }: any = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();
      
      if (error) {
        console.warn("Profile not found or error loading:", error.message);
      }
      
      if (data) {
        reset({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
        });
        // If they already have a full profile, trigger success
        if (data.name && data.email) {
            onSuccess();
        }
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [address, reset, onSuccess]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!address) {
      setError("Wallet address not found. Please reconnect.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { error: upsertError } = await (supabase
      .from('profiles') as any)
      .upsert({
        wallet_address: address,
        name: values.name,
        email: values.email,
        bio: values.bio,
        last_seen: new Date().toISOString(),
      }, { onConflict: 'wallet_address' });

    setIsLoading(false);

    if (upsertError) {
      setError(upsertError.message || "Failed to save profile");
    } else {
      onSuccess();
    }
  };

  if (!address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-shadow border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Profile</CardTitle>
        <CardDescription>
          Your wallet is connected, but we need a few more details to set up your Bounty Board identity.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Name</label>
            <Input 
              {...register('name')} 
              placeholder="Alice Satoshi" 
              disabled={isLoading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <Input 
              {...register('email')} 
              placeholder="alice@example.com" 
              type="email" 
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Bio (Optional)</label>
            <Input 
              {...register('bio')} 
              placeholder="Frontend Developer & Web3 Enthusiast" 
              disabled={isLoading}
              className={errors.bio ? "border-red-500" : ""}
            />
            {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
          </div>

          {error && <p className="text-sm text-red-500 font-medium p-2 bg-red-50 rounded-md">{error}</p>}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
