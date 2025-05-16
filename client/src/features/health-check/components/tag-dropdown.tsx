import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/utils/cn';

interface Tag {
  id: string;
  title: string;
  bg: string;
  text: string;
}
interface TagDropdownProps {
  tags: Tag[];
  onTagChange: (tagId: string, questionId: string) => void;
  selectedTag: Tag;
}

export default function TagDropdown({
  tags,
  onTagChange,
  selectedTag,
}: TagDropdownProps) {
  return (
    <Select
      onValueChange={(value) => onTagChange(selectedTag.id, value)}
      defaultValue={selectedTag.id}
    >
      <SelectTrigger className="h-8 w-[170px] border bg-white px-2 shadow focus:ring-2 focus:ring-violet-400">
        <SelectValue>
          <Badge
            className={cn(
              selectedTag.bg,
              selectedTag.text,
              'block max-w-[100px] truncate px-2 py-1',
            )}
          >
            {selectedTag.title}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {tags.map((tag) => (
          <SelectItem
            key={tag.id}
            value={tag.id}
            className="flex items-center gap-2"
          >
            <span
              className={cn(
                'rounded px-2 py-1 text-xs font-medium',
                tag.bg,
                tag.text,
              )}
            >
              {tag.title}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
