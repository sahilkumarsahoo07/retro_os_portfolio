import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, type MessageInput } from '@shared/routes';
import { useCreateMessage } from '@/hooks/use-messages';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ContactApp() {
  const { mutate, isPending, isSuccess, error, reset } = useCreateMessage();
  
  const form = useForm<MessageInput>({
    resolver: zodResolver(api.messages.create.input),
    defaultValues: {
      name: '',
      email: '',
      content: ''
    }
  });

  const onSubmit = (data: MessageInput) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-[#090014] text-white">
      <h1 className="text-3xl font-display text-primary text-shadow-neon-pink mb-6 border-b-2 border-primary pb-4">
        TRANSMIT_MESSAGE
      </h1>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center h-64 text-secondary space-y-4 text-center">
          <CheckCircle className="w-16 h-16 mb-2 text-shadow-neon-cyan" />
          <h2 className="font-display text-2xl">TRANSMISSION SUCCESSFUL</h2>
          <p className="font-body text-xl text-white/80">
            Message received in the mainframe. Expect a response soon.
          </p>
          <button 
            onClick={() => reset()}
            className="mt-6 font-display bg-primary text-white px-6 py-2 hover:bg-secondary transition-colors box-shadow-neon-pink"
          >
            SEND ANOTHER
          </button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/20 border border-destructive p-3 flex items-center gap-3 text-destructive-foreground font-body text-lg">
              <AlertTriangle className="text-destructive" />
              <span>{error.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-display text-secondary tracking-widest block">IDENTIFIER (NAME)</label>
            <input 
              {...form.register('name')}
              className="w-full bg-black/50 border-2 border-primary/50 focus:border-secondary p-3 font-body text-xl text-white transition-colors"
              placeholder="Enter alias..."
            />
            {form.formState.errors.name && (
              <p className="font-body text-destructive text-lg">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-display text-secondary tracking-widest block">ROUTING (EMAIL)</label>
            <input 
              {...form.register('email')}
              type="email"
              className="w-full bg-black/50 border-2 border-primary/50 focus:border-secondary p-3 font-body text-xl text-white transition-colors"
              placeholder="Enter frequency..."
            />
            {form.formState.errors.email && (
              <p className="font-body text-destructive text-lg">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-display text-secondary tracking-widest block">PAYLOAD (MESSAGE)</label>
            <textarea 
              {...form.register('content')}
              rows={5}
              className="w-full bg-black/50 border-2 border-primary/50 focus:border-secondary p-3 font-body text-xl text-white transition-colors resize-none"
              placeholder="Enter data..."
            />
            {form.formState.errors.content && (
              <p className="font-body text-destructive text-lg">{form.formState.errors.content.message}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 font-display bg-gradient-to-r from-primary to-secondary text-white p-4 text-xl hover:opacity-90 disabled:opacity-50 transition-opacity box-shadow-neon-pink"
          >
            {isPending ? 'ENCRYPTING...' : 'INITIALIZE UPLOAD'} 
            <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
}
