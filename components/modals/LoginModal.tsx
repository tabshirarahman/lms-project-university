"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export function LoginModal({ open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Please Login</DialogTitle>
        </DialogHeader>
        <p>You must be logged in to view this course.</p>

        <Link href="/auth/login" className="btn-primary w-full text-center">
          Go To Login
        </Link>
      </DialogContent>
    </Dialog>
  );
}
