import { CheckCircle } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';

export interface AddActionFormData {
  title: string;
}

interface ActionItemFormProps {
  register: UseFormRegister<AddActionFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
}

export default function ActionItemForm({
  register,
  onSubmit,
  isDisabled,
}: ActionItemFormProps) {
  return (
    <form onSubmit={onSubmit} className="border-b border-gray-200">
      <div className="relative bg-[#fffef7]">
        <div className="text-muted-foreground absolute top-4 left-2.5 h-4 w-4">
          <CheckCircle className="text-gray-400" size={20} />
        </div>
        <Input
          {...register('title')}
          placeholder="Add action..."
          className="h-13 w-full flex-1 rounded-none border-none bg-transparent pl-10 focus-visible:ring-0"
          disabled={isDisabled}
        />
      </div>
    </form>
  );
}
