import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitialLetter } from '@/utils/string';

export const ProjectLogo = ({ name }: { name: string }) => {
  return (
    <Avatar className="h-8 w-8 cursor-pointer">
      <AvatarFallback className="bg-transparent">
        {getInitialLetter(name)}
      </AvatarFallback>
    </Avatar>
  );
};
