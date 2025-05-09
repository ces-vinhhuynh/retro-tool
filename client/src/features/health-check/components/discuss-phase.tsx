'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TopChallenges from '@/features/health-check/components/challenges';
import HealthCheckQuestions from '@/features/health-check/components/health-check-questions';
import TeamHealthChart from '@/features/health-check/components/team-health-chart';
import {
  HealthCheckWithTemplate,
  Question,
  Response,
} from '@/features/health-check/types/health-check';

interface DiscussPhaseProps {
  healthCheck: HealthCheckWithTemplate;
  questions: Question[];
  responses: Response[];
}

export default function DiscussPhase({
  healthCheck,
  questions,
  responses,
}: DiscussPhaseProps) {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-screen-2xl flex-grow px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative min-w-0 flex-1">
          <Card>
            <CardContent className="p-6">
              <TeamHealthChart
                responses={responses}
                averageScores={healthCheck?.average_score}
                questions={questions}
              />
              <div className="rounded-lg bg-white p-6">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      Discussion Topics
                    </h2>
                    <p className="text-gray-500">
                      Review feedback and comments from the team
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 flex h-10 items-center gap-2 self-start px-4"
                    onClick={() => setAllOpen((open) => !open)}
                  >
                    {allOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Collapse all
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Expand all
                      </>
                    )}
                  </Button>
                </div>
                <HealthCheckQuestions
                  responses={responses}
                  questions={questions}
                  allOpen={allOpen}
                />
                <TopChallenges questions={questions} responses={responses} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
