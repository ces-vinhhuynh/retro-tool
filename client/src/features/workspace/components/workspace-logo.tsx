import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function WorkspaceLogo({ name }: { name: string }) {
  const getProjectNameInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 1);
  };

  return (
    <Avatar className="h-8 w-8 cursor-pointer">
      <AvatarFallback className="bg-ces-orange-500">
        {getProjectNameInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
