import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdditionalItemRowProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}

const AdditionalItemRow = ({
  value,
  onChange,
  onDelete,
}: AdditionalItemRowProps) => (
  <div className="flex items-center gap-2">
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="focus:border-ces-orange-500 focus:ring-ces-orange-500 flex-1 rounded-lg border border-gray-200 bg-[#F7F7F7] focus:ring-1"
      placeholder="Click to edit this item"
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={18} />
    </Button>
  </div>
);

export default AdditionalItemRow;
