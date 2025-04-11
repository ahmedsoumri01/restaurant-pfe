"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useClientStore from "@/store/useClientStore";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  utilisateur: {
    _id: string;
    nom?: string;
    prenom?: string;
    photoProfil?: string;
  };
  texte: string;
  date: string;
}

interface PlatCommentsProps {
  platId: string;
  comments: Comment[];
}

export default function PlatComments({ platId, comments }: PlatCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { makeComment } = useClientStore();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await makeComment(platId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (user: Comment["utilisateur"]) => {
    if (user.nom && user.prenom) {
      return `${user.nom[0]}${user.prenom[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Comments{" "}
        <span className="text-gray-500 text-sm font-normal">
          ({comments.length})
        </span>
      </h2>

      {/* Add comment form */}
      <div className="space-y-4">
        <Textarea
          placeholder="Add your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? "Submitting..." : "Post Comment"}
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-6 mt-8">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_APP_URL || ""}${
                    comment.utilisateur.photoProfil
                  }`}
                  alt="User"
                />
                <AvatarFallback>
                  {getInitials(comment.utilisateur)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    {comment.utilisateur.prenom} {comment.utilisateur.nom}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.texte}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
