"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function NotStudentModal({ open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Access Restricted</DialogTitle>
        </DialogHeader>

        <p>You must be a student to access this course.</p>
      </DialogContent>
    </Dialog>
  );
}
