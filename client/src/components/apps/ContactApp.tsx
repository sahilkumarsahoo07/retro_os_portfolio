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
    <div className="p-4 h-full overflow-y-auto bg-[#c0c0c0] text-black selection:bg-[#000080] selection:text-white">
      <div className="flex items-center gap-2 mb-4 border-b border-[#808080] pb-2">
        <h1 className="text-xl font-bold">New Message</h1>
        <div className="ml-auto flex gap-1">
          <div className="w-4 h-4 bg-[#008000] rounded-full border border-black shadow-inner" />
          <span className="text-[10px] font-bold">SECURE CHANNEL</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-white win98-inset m-2">
          <CheckCircle className="w-16 h-16 text-[#008000]" />
          <div>
            <h2 className="text-lg font-bold">Mail Sent Successfully</h2>
            <p className="text-sm text-gray-600">
              The message has been dispatched to the recipient's inbox.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="win98-button font-bold mt-4"
          >
            Compose New
          </button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
          {error && (
            <div className="bg-white border-2 border-red-600 p-2 flex items-center gap-3 text-red-700 font-bold text-xs mb-4">
              <AlertTriangle className="text-red-600" size={16} />
              <span>System Error: {error.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            <label className="text-xs font-bold">From (Name):</label>
            <input
              {...form.register('name')}
              className="win98-inset w-full p-1 text-sm outline-none focus:ring-1 focus:ring-[#000080]"
              placeholder="Your name"
            />
            {form.formState.errors.name && (
              <p className="text-[10px] text-red-700 font-bold">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-xs font-bold">Reply-To (Email):</label>
            <input
              {...form.register('email')}
              type="email"
              className="win98-inset w-full p-1 text-sm outline-none focus:ring-1 focus:ring-[#000080]"
              placeholder="example@mail.com"
            />
            {form.formState.errors.email && (
              <p className="text-[10px] text-red-700 font-bold">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-xs font-bold">Message Body:</label>
            <textarea
              {...form.register('content')}
              rows={8}
              className="win98-inset w-full p-1 text-sm outline-none focus:ring-1 focus:ring-[#000080] resize-none"
              placeholder="Typing message..."
            />
            {form.formState.errors.content && (
              <p className="text-[10px] text-red-700 font-bold">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="win98-button flex items-center gap-2 px-6 py-1 font-bold disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Send Message'}
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
