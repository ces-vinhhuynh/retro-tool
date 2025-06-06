import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
interface ConfirmModalProps {
  variant?: "delete" | "confirm";
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  className?: string;
}

const ConfirmModal = ({
  variant = "confirm",
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
  loading = false,
  className,
}: ConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
              "bg-red-600 hover:bg-red-700",
              variant === "confirm" && "bg-blue-600 hover:bg-blue-700",
              className
            )}
            disabled={loading}
          >
            {variant === "confirm" ? "Confirm" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
