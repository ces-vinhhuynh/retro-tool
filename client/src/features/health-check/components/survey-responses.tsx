'use client';

import { useState } from 'react';

import ConfirmModal from '@/components/modal/confirm-modal';
import { MESSAGE } from '@/utils/messages';

import { useIssuesMutation } from '../hooks/issues/use-issues-mutation';

import CommentItem from './comment-item';

const MAX_COMMENT_CHARS = 200;

interface SurveyResponsesProps {
  comments: string[];
  teamId: string;
  healthCheckId: string;
}

const SurveyResponses = ({
  comments,
  teamId,
  healthCheckId,
}: SurveyResponsesProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { createIssue } = useIssuesMutation();

  const [selectedComment, setSelectedComment] = useState<string | null>(null);

  const isLongComment = (text: string) => text.length > MAX_COMMENT_CHARS;

  const toggleExpand = (comment: string, isExpanded: boolean) => {
    setExpanded((prev) => ({ ...prev, [comment]: !isExpanded }));
  };

  const handleCreateIssueFromComment = (title: string) => {
    createIssue(
      {
        title,
        team_id: teamId,
        health_check_id: healthCheckId,
      },
      {
        onSuccess: () => {
          setSelectedComment(null);
        },
      },
    );
  };

  return (
    <div className="gap-4">
      {comments && comments.length > 0 && (
        <div className="flex flex-col gap-2 pt-4">
          <h3 className="text-sm font-medium uppercase">Survey Responses</h3>
          {comments.map((comment, index) => {
            const isExpanded = expanded[comment];
            const shouldClamp = isLongComment(comment);

            return (
              <CommentItem
                key={index}
                comment={comment}
                shouldClamp={shouldClamp}
                isExpanded={isExpanded}
                toggleExpand={toggleExpand}
                onClickCreateIssue={() => {
                  setSelectedComment(comment);
                }}
              />
            );
          })}
        </div>
      )}
      <ConfirmModal
        isOpen={!!selectedComment}
        title={MESSAGE.CREATE_LONG_TERM_ISSUE_FROM_COMMENT_TITLE}
        description={MESSAGE.CREATE_LONG_TERM_ISSUE_FROM_COMMENT_DESCRIPTION}
        onCancel={() => setSelectedComment(null)}
        onConfirm={() => {
          if (selectedComment) {
            handleCreateIssueFromComment(selectedComment);
          }
        }}
      />
    </div>
  );
};

export default SurveyResponses;
