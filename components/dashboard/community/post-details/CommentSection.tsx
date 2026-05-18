"use client";

import React from 'react';
import { CommentStructure } from '@/types/community';
import { Clock3, MessageSquareDashed, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type CommentSectionProps = {
    comments: CommentStructure[] | null;
    onDeleteComment: (commentId: string) => void;
    currentUserId: string;
};

const CommentSection = ({ comments, currentUserId, onDeleteComment }: CommentSectionProps) => {


    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl max-w-none">
                <MessageSquareDashed className="w-5 h-5 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No responses posted yet. Be the first to start the conversation.
                </p>
            </div>
        );
    }



    return (
        <div className="space-y-4">
            {comments.map((comment) => {
                if (!comment) return null;

                const initials = comment.authorName
                    ? comment.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'U';

                const isAuthor = currentUserId === comment.authorId;

                return (
                    <div
                        key={comment.id}
                        className="bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/80 p-4 rounded-xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-3 group/comment"
                    >
                        {/* Header Row: User Metadata & Actions */}
                        <div className="flex items-start justify-between gap-3 w-full min-w-0">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {/* Rounded Avatar Node */}
                                <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0 select-none">
                                    {initials}
                                </div>
                                
                                {/* Identity Block */}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {comment.authorName} 
                                        {isAuthor ? ' (You)' : ''}
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">
                                        {comment.email}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamp & Deletion Actions Handling Group */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium font-mono bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-900">
                                    <Clock3 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>

                                {isAuthor && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteComment(comment.id)}
                                        className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all opacity-0 group-hover/comment:opacity-100 focus:opacity-100 cursor-pointer"
                                        title="Delete comment"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Comment Body Content (Rich Text / Prose Compatible Layer) */}
                        <div 
                            className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 wrap-break-word text-[13px] leading-relaxed pl-1 prose-p:leading-relaxed prose-pre:my-1 prose-ul:my-1 prose-ol:my-1"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default CommentSection;