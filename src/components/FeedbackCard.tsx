"use client";
import { Feedback } from "@/models/feedback.model";
import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Use your actual button
import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponseMessage } from "@/app/types/apiResponseMessage";

type FeedbackCardPramas = {
  feedback: Feedback;
  onFeedbackDelete: (feedbackId: string) => void;
};

export default function FeedbackCard({
  feedback,
  onFeedbackDelete,
}: FeedbackCardPramas) {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false); 

  const onMessageDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`/api/delete-feedback/${id}`, {
        data: { feedbackId: id },
      });
      toast.success(res.data.message);
      onFeedbackDelete(id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseMessage>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to delete feedback. Try again."
      );
    } finally {
      setDeleteLoading(false);
      setOpen(false);
    }
  };

  return (
    <Card className="shadow hover:scale-103 transition-transform duration-200 hover:cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{feedback.content}</CardTitle>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 p-2 rounded-sm">
                <X className="w-5 h-5 text-white" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this feedback.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onMessageDelete(feedback._id as string)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? <Loader2/> : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-sm text-start">
          {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  );
}
