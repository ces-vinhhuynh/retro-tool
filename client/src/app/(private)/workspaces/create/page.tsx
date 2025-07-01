'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TeamForm from '@/features/workspace/components/team-form';
import WorkspaceForm from '@/features/workspace/components/workspace-form';
import { useCreateWorkspaceTeam } from '@/features/workspace/hooks/use-create-workspace-team';
import {
  workspaceTeamSchema,
  type WorkspaceTeamFormValues,
} from '@/features/workspace/schema/workspace-team.schema';
type Step = 'workspace' | 'team';

const STEPS: Record<Step, { title: string; description: string }> = {
  workspace: {
    title: 'Create Your Workspace',
    description: "Let's start by setting up your workspace",
  },
  team: {
    title: 'Create Your First Team',
    description: "Now, let's create your first team within the workspace",
  },
};

const CreateWorkspacePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('workspace');
  const { mutate: createWorkspaceTeam, isPending: isCreating } =
    useCreateWorkspaceTeam();

  const methods = useForm<WorkspaceTeamFormValues>({
    resolver: zodResolver(workspaceTeamSchema),
    defaultValues: {
      workspace: { workspaceName: '' },
      team: { teamName: '' },
    },
    mode: 'onSubmit',
  });

  const handleStepChange = async (step: Step, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (step === 'team') {
      const isValid = await methods.trigger('workspace.workspaceName');
      if (!isValid) return;
    }
    setCurrentStep(step);
  };

  const handleSubmit = async (data: WorkspaceTeamFormValues) => {
    const workspaceId = uuidv4();
    const teamId = uuidv4();

    createWorkspaceTeam({
      workspaceId,
      teamId,
      workspaceName: data.workspace.workspaceName,
      teamName: data.team.teamName,
    });
    router.push(`/workspaces/${workspaceId}`);
  };

  const isWorkspaceStep = currentStep === 'workspace';
  const workspaceName = methods.watch('workspace.workspaceName');
  const teamName = methods.watch('team.teamName');

  return (
    <div className="mx-auto flex h-screen w-full max-w-md flex-col items-center justify-center px-4 sm:px-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary text-center text-2xl font-bold">
            {STEPS[currentStep].title}
          </CardTitle>
          <CardDescription className="text-center text-gray-700">
            {STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <CardContent>
              {isWorkspaceStep ? <WorkspaceForm /> : <TeamForm />}
            </CardContent>

            <CardFooter className="flex justify-between">
              {!isWorkspaceStep && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={(e) => handleStepChange('workspace', e)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}

              {isWorkspaceStep ? (
                <Button
                  className="ml-auto"
                  type="button"
                  onClick={(e) => handleStepChange('team', e)}
                  disabled={!workspaceName}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isCreating || !teamName}>
                  Create Team
                </Button>
              )}
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default CreateWorkspacePage;
