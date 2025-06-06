import { Trash2 } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import EntryForm from './entry-form';

interface EntryListProps {
  items: { id: string; title: string }[];
  emptyItemMessage?: string;
  handleAddItem?: (title: string) => void;
  handleDeleteItem?: (id: string) => void;
  Icon: React.ComponentType<{ size: number; className?: string }>;
  isLoading?: boolean;
}

const EntryList = ({
  items,
  handleAddItem,
  handleDeleteItem,
  emptyItemMessage,
  Icon,
  isLoading,
}: EntryListProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ title: string }>({
    defaultValues: { title: '' },
  });

  const onSubmit = handleSubmit((data) => {
    if (!data.title.trim()) return;

    handleAddItem?.(data.title.trim());
    reset();
  });

  return (
    <div>
      <EntryForm
        register={register}
        onSubmit={onSubmit}
        isDisabled={isSubmitting}
        Icon={Icon}
      />

      <div>
        {items.length === 0 ? (
          <div className="primary-text border py-4 text-center text-sm text-gray-400">
            {emptyItemMessage ?? 'no items yet'}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-gray-100 py-4"
            >
              <span className="text-justify text-base">{item.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDeleteItem?.(item.id)}
                disabled={isLoading}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EntryList;
