'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
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
import {
  useCreateTemplate,
  useUpdateTemplate,
} from '@/features/health-check/hooks/use-health-check-templates';
import { Question, Section } from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';
import {
  customTemplateSchema,
  CustomTemplateSchemaType,
} from '@/features/workspace/schema/custom-template.schema';

import DraggableQuestionList from './draggable-question-list';
import { FormField } from './form-field';

const DEFAULT_MAX_VALUE = {
  value: 10,
  context: 'Always / Excellent performance',
};
const DEFAULT_MIN_VALUE = {
  value: 1,
  context: 'Never / Poor performance',
};

interface ManageCustomTemplateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  teamId: string;
  template?: Template | null;
  setTemplate: (template: Template | null) => void;
}

const ManageCustomTemplateModal = ({
  open,
  setOpen,
  teamId,
  template,
  setTemplate,
}: ManageCustomTemplateModalProps) => {
  const isEdit = !!template;

  const methods = useForm<CustomTemplateSchemaType>({
    resolver: zodResolver(customTemplateSchema),
    mode: 'onChange',
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

  useEffect(() => {
    if (template) {
      reset({
        description: template.description || '',
        questions: template.questions as Question[] | [],
        templateName: template.name || '',
      });
    } else {
      reset({
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
      });
    }
  }, [reset, template, open]);

  const { mutate: createTemplate, isPending: isTemplateCreating } =
    useCreateTemplate();

  const { mutate: updateTemplate, isPending: isTemplateUpdating } =
    useUpdateTemplate();

  const handleSubmitForm = (data: CustomTemplateSchemaType) => {
    if (isEdit) {
      return updateTemplate(
        {
          templateId: template?.id,
          template: {
            name: data.templateName,
            description: data.description,
            questions: data.questions,
          },
        },
        {
          onSuccess: () => {
            setOpen(false);
            setTemplate(null);
          },
        },
      );
    }

    return createTemplate(
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
        reset();
        setOpen(open);
      }}
    >
      <DialogContent className="min-w-0 rounded-lg bg-white sm:min-w-md lg:min-w-3xl">
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl font-semibold">
            {isEdit ? 'Edit' : 'Create'} custom template
          </DialogTitle>
          <DialogDescription>
            Customize your template and questions
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
                  <DraggableQuestionList
                    questions={questions}
                    move={move}
                    remove={remove}
                    renderQuestionItem={(idx) => (
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
                                {Object.values(Section).map((section, idx) => (
                                  <SelectItem key={idx} value={section}>
                                    {section}
                                  </SelectItem>
                                ))}
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
                    )}
                  />
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

            {isEdit ? (
              <Button
                className="bg-ces-orange-500 hover:bg-ces-orange-600"
                type="submit"
                disabled={isTemplateUpdating || !isValid}
              >
                {isTemplateUpdating ? 'Updating...' : 'Update Template'}
              </Button>
            ) : (
              <Button
                className="bg-ces-orange-500 hover:bg-ces-orange-600"
                type="submit"
                disabled={isTemplateCreating || !isValid}
              >
                {isTemplateCreating ? 'Creating...' : 'Create Template'}
              </Button>
            )}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCustomTemplateModal;
