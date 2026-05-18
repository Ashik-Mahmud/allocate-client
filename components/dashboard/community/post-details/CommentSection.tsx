"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CommentStructure } from '@/types/community';
import { Clock3, MessageSquareDashed, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type CommentSectionProps = {
    comments: CommentStructure[] | null;
    onDeleteComment: (commentId: string) => void;
    currentUserId: string;
};

const CommentSection = ({ comments, currentUserId, onDeleteComment }: CommentSectionProps) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const prevCommentsLength = useRef(comments?.length || 0);

    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (comments && comments.length > prevCommentsLength.current) {
            setVisibleCount(comments.length);

            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        prevCommentsLength.current = comments?.length || 0;
    }, [comments]);

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <MessageSquareDashed className="w-5 h-5 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    No responses posted yet. Be the first to start the conversation.
                </p>
            </div>
        );
    }

    const visibleComments = comments.slice(0, visibleCount);
    const hasMore = comments.length > visibleCount;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    const scrollToCommentsTop = () => {
        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    return (
        <div className="space-y-4">
            <div ref={topRef} className="scroll-mt-20" />

            <div className="space-y-4">
                {visibleComments.map((comment) => {
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
                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-3 w-full min-w-0">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                                        {initials}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                            {comment.authorName} {isAuthor ? ' (You)' : ''}
                                        </span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">
                                            {comment.email}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium font-mono bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-900">
                                        <Clock3 className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>

                                    {isAuthor && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteComment(comment.id)}
                                            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover/comment:opacity-100 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Comment Body */}
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed pl-1"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                            />
                        </div>
                    );
                })}
            </div>


            <div ref={bottomRef} />

            <div className="flex items-center justify-center mt-4 gap-4">
                {/* Load More Button */}
                {hasMore && (
                    <div className=" flex justify-center">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-full transition-all cursor-pointer shadow-xs"
                        >
                            <span>Show {comments.length - visibleCount} more replies</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {
                    !hasMore && visibleComments.length > 5 && (
                        <div className=" flex justify-center">
                            <button
                                type="button"
                                onClick={() => setVisibleCount(5)}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-full transition-all cursor-pointer shadow-xs"
                            >
                                <span>Show Less</span>
                                <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )
                }

                {/* Scroll To Top */}
                {visibleComments?.length > 10 && (
                    <div className=" flex justify-center">
                        <button
                            type="button"
                            onClick={scrollToCommentsTop}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-full transition-all cursor-pointer shadow-xs"
                        >
                            <span>Scroll to Top</span>
                            <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;