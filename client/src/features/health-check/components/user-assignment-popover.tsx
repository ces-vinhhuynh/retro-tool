import { Check, User as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { ActionItem, User } from '../types/health-check';

import { GenericPopover } from './generic-popover';

interface UserAssignmentPopoverProps {
  item: ActionItem;
  assignees: string[];
  teamMembers: User[];
  isEditable?: boolean;
  openPopovers?: Record<string, boolean>;
  setOpenPopovers?: (value: Record<string, boolean>) => void;
  assignToNone?: (actionId: string) => void;
  assignToAll?: (actionId: string) => void;
  toggleAssignee?: (actionId: string, memberId: string) => void;
  isCreatingAssignee?: boolean;
  isRemovingAssignee?: boolean;
}

const UserAssignmentPopover = ({
  item,
  isEditable,
  assignees,
  teamMembers,
  openPopovers,
  setOpenPopovers,
  assignToNone,
  assignToAll,
  toggleAssignee,
  isCreatingAssignee,
  isRemovingAssignee,
}: UserAssignmentPopoverProps) => {
  const isAllAssigned = assignees?.length === teamMembers?.length;

  const triggerButton = (
    <div className="flex cursor-pointer items-center">
      {assignees?.length > 0 ? (
        <>
          {assignees?.slice(0, 3).map((assigneeId) => {
            const member = teamMembers?.find((m) => m.id === assigneeId);
            if (!member) return null;
            return (
              <Avatar
                key={assigneeId}
                className="-pl-2 h-8 w-8 border-2 border-white first:ml-0"
              >
                {member.avatar_url ? (
                  <AvatarImage
                    src={member.avatar_url || '/placeholder.svg'}
                    alt={member.full_name ?? ''}
                  />
                ) : (
                  <AvatarFallback>
                    {member.full_name?.slice(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
            );
          })}

          {assignees?.length > 3 && (
            <span className="pl-2 text-blue-400">+{assignees.length - 3}</span>
          )}
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          disabled={!isEditable}
          className="h-8 w-8 rounded-full text-cyan-500"
        >
          <UserIcon size={18} />
          <span className="sr-only">Assign user</span>
        </Button>
      )}
    </div>
  );

  // Popover content
  const popoverContent = (
    <div className="w-64 px-3">
      <div className="flex border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-500">ASSIGN TO</span>
          <div className="flex">
            <Button
              variant="ghost"
              className="cursor-pointer border-none bg-transparent text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                assignToNone?.(item.id);
              }}
              disabled={isRemovingAssignee}
            >
              NONE
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer border-none bg-transparent text-blue-400"
              onClick={(e) => {
                e.stopPropagation();
                assignToAll?.(item.id);
              }}
              disabled={isCreatingAssignee || isAllAssigned}
            >
              ALL
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-64 overflow-x-hidden overflow-y-auto py-2">
        {teamMembers?.map((member) => (
          <Button
            key={member.id}
            variant="ghost"
            className="flex cursor-pointer items-center px-3 py-2 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              toggleAssignee?.(item.id, member.id);
            }}
            disabled={isCreatingAssignee}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {assignees?.includes(member.id) && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
            <Avatar className="h-8 w-8">
              {member.avatar_url ? (
                <AvatarImage
                  src={member.avatar_url || '/placeholder.svg'}
                  alt={member.full_name ?? ''}
                />
              ) : (
                <AvatarFallback>{member.full_name?.slice(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            <span className="px-2">{member.full_name}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <GenericPopover
      item={item}
      openPopovers={openPopovers}
      setOpenPopovers={setOpenPopovers}
      isUpdating={isCreatingAssignee}
      triggerButton={triggerButton}
      popoverContent={popoverContent}
      align="end"
      className="w-auto p-0"
    />
  );
};

export default UserAssignmentPopover;
