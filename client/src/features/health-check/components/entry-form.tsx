import { UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';

interface EntryFormProps {
  register: UseFormRegister<{ title: string }>;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
  placeholder?: string;
  Icon: React.ComponentType<{ size: number; className?: string }>;
}

const EntryForm = ({
  register,
  onSubmit,
  isDisabled,
  placeholder = 'Add new...',
  Icon,
}: EntryFormProps) => {
  return (
    <form onSubmit={onSubmit} className="border-b border-gray-200">
      <div className="relative bg-gray-50">
        <div className="text-muted-foreground absolute top-4 left-2.5 h-4 w-4">
          <Icon size={20} className="text-gray-500/70" />
        </div>
        <Input
          {...register('title')}
          placeholder={placeholder}
          className="h-13 w-full flex-1 rounded-none border-none bg-transparent pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isDisabled}
        />
      </div>
    </form>
  );
};

export default EntryForm;
