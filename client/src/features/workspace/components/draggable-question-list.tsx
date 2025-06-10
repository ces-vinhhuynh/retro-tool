'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { UseFieldArrayMove, UseFieldArrayRemove } from 'react-hook-form';

import { Button } from '@/components/ui/button';

type SortableItemProps = {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
};

export const SortableItem = ({ id, children, onRemove }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2"
    >
      <div className="flex flex-1 items-center gap-2 rounded-md border bg-white p-4 pl-3">
        <div
          className="cursor-move text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="size-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500"
        onClick={onRemove}
      >
        <Trash2 size={20} />
      </Button>
    </div>
  );
};

type DraggableQuestionListProps = {
  questions: {
    id: string;
    description: string;
    title: string;
    section: string;
  }[];
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  renderQuestionItem: (index: number) => React.ReactNode;
};

const DraggableQuestionList = ({
  questions,
  move,
  remove,
  renderQuestionItem,
}: DraggableQuestionListProps) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map((field, idx) => (
          <SortableItem
            key={field.id}
            id={field.id}
            onRemove={() => remove(idx)}
          >
            {renderQuestionItem(idx)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DraggableQuestionList;
