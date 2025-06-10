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
import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTemplate } from '@/features/health-check/hooks/use-health-check-templates';
import { Section } from '@/features/health-check/types/health-check';
import { FormField } from '@/features/workspace/components/form-field';
import {
  customTemplateSchema,
  CustomTemplateSchemaType,
} from '@/features/workspace/schema/custom-template.schema';

type SortableItemProps = {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
};

const SortableItem = ({ id, children, onRemove }: SortableItemProps) => {
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

const DEFAULT_MAX_VALUE = {
  value: 10,
  context: 'Always / Excellent performance',
};
const DEFAULT_MIN_VALUE = {
  value: 1,
  context: 'Never / Poor performance',
};

const CreateCustomTemplateModal = ({
  open,
  setOpen,
  teamId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamId: string;
}) => {
  const methods = useForm<CustomTemplateSchemaType>({
    resolver: zodResolver(customTemplateSchema),
    mode: 'onChange',
    defaultValues: {
      templateName: '',
      description: '',
      questions: [
        {
          id: crypto.randomUUID(),
          title: '',
          section: '',
          description: '',
        },
      ],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = methods;

  const {
    fields: questions,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const { mutate: createTemplate, isPending: isTemplateCreating } =
    useCreateTemplate();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const handleSubmitForm = (data: CustomTemplateSchemaType) => {
    createTemplate(
      {
        name: data.templateName,
        description: data.description,
        questions: data.questions,
        max_value: DEFAULT_MAX_VALUE,
        min_value: DEFAULT_MIN_VALUE,
        is_custom: true,
        team_id: teamId,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        reset();
      }}
    >
      <DialogContent className="min-w-3xl rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl font-semibold">
            Create custom template
          </DialogTitle>
          <DialogDescription>
            Customize your health model and dimensions
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleSubmitForm)}
          >
            {/* Name & Description */}
            <div className="grid max-h-[50vh] gap-4 overflow-y-auto p-1">
              <div className="grid gap-3">
                <FormField<CustomTemplateSchemaType>
                  id="templateName"
                  label="Template Name"
                  name="templateName"
                  register={register}
                  errors={errors}
                  placeholder="Enter template name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <FormField<CustomTemplateSchemaType>
                  id="description"
                  label="Template Description"
                  name="description"
                  register={register}
                  errors={errors}
                  placeholder="Enter template description"
                  required
                />
              </div>

              {/* Questions */}
              <div className="grid gap-3">
                <span className="block text-sm font-medium">Questions</span>

                <div className="flex flex-col gap-5">
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
                          <div className="grid gap-3">
                            <FormField<CustomTemplateSchemaType>
                              id={`questions.${idx}.title`}
                              name={`questions.${idx}.title`}
                              register={register}
                              errors={errors}
                              placeholder="Title"
                              required
                            />
                            <FormField<CustomTemplateSchemaType>
                              id={`questions.${idx}.description`}
                              name={`questions.${idx}.description`}
                              register={register}
                              errors={errors}
                              placeholder="Description"
                              required
                            />
                            <Controller
                              control={control}
                              name={`questions.${idx}.section`}
                              render={({ field: controllerField }) => (
                                <Select
                                  onValueChange={controllerField.onChange}
                                  value={controllerField.value}
                                  defaultValue={controllerField.value}
                                >
                                  <SelectTrigger className="data-[placeholder]:text-gray-600">
                                    <SelectValue placeholder="Select section" />
                                  </SelectTrigger>
                                  <SelectContent sideOffset={5} align="start">
                                    {Object.values(Section).map(
                                      (section, idx) => (
                                        <SelectItem key={idx} value={section}>
                                          {section}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.questions?.[idx]?.section && (
                              <span className="text-xs text-red-500">
                                {errors.questions?.[idx]?.section?.message}
                              </span>
                            )}
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-ces-orange-500 size-9 rounded-full text-2xl hover:text-white"
                onClick={() =>
                  append({
                    id: crypto.randomUUID(),
                    title: '',
                    section: '',
                    description: '',
                  })
                }
              >
                <Plus size={20} />
              </Button>
            </div>

            <Button
              className="bg-ces-orange-500 hover:bg-ces-orange-600"
              type="submit"
              disabled={isTemplateCreating || !isValid}
            >
              {isTemplateCreating ? 'Creating...' : 'Create Template'}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomTemplateModal;
