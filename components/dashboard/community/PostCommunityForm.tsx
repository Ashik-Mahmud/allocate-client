import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CommunityHub, CommunityHubPostType, CommunityHubStatus, PostCommunityFormData } from '@/types/community';
import SharedRichEditor from '@/components/shared/RichEditor';
import { cn } from '@/lib/utils/cn';

type InnerFormProps = {
    onCancel: () => void;
    onSubmit: (data: PostCommunityFormData) => void;
    isSubmitting?: boolean;
    isEdit?: boolean;
    initialData?: CommunityHub | undefined;
    errorMessage?: string | null;
};

export const PostCommunityInnerForm = ({
    onCancel,
    onSubmit,
    isSubmitting = false,
    isEdit = false,
    initialData,
    errorMessage
}: InnerFormProps) => {


    const resolvedPostType =
        (initialData as any)?.postType ||
        (initialData as any)?.post_type ||
        CommunityHubPostType.GENERAL_DISCUSSION;

    const resolvedStatus =
        (initialData as any)?.status ||
        (initialData as any)?.status_key ||
        CommunityHubStatus.DRAFT;


    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PostCommunityFormData>({
        defaultValues: {
            title: initialData?.title || '',
            content: initialData?.content || '',
            imageUrl: initialData?.imageUrl || '',
            visibility: initialData?.visibility || {
                showToStaff: true,
                showToOrgAdmin: true,
                showToAdmin: false,
            },
            isPrivate: Boolean(initialData?.isPrivate),
            postType: resolvedPostType,
            status: resolvedStatus,
        }
    });


    useEffect(() => {
        if (isEdit && initialData) {
            reset({
                title: initialData.title || '',
                content: initialData.content || '',
                imageUrl: initialData.imageUrl || '',
                visibility: initialData.visibility || {
                    showToStaff: true,
                    showToOrgAdmin: true,
                    showToAdmin: false,
                },
                isPrivate: Boolean(initialData.isPrivate),
                postType: resolvedPostType,
                status: resolvedStatus,
            });
        }
    }, [isEdit, initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full text-neutral-900 dark:text-neutral-100">

            {/* Title */}
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Title
                </Label>
                <Input
                    id="title"
                    placeholder="Give your post a title..."

                    className={
                        cn(
                            "h-10 border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm",
                            errors.title && "border-red-500 focus-visible:ring-red-400 dark:focus-visible:ring-red-700"
                        )
                    }
                    {...register('title', {
                        required: {
                            value: true,
                            message: 'Title is required'
                        }
                    })}
                />

                {errors.title && (
                    <p className="text-red-500 text-xs">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Content
                </Label>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <SharedRichEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Provide the technical specifications or renewal deadlines for this resource request..."
                        />
                    )}
                />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
                <Label htmlFor="imageUrl" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Image URL (Optional)
                </Label>
                <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="h-10 border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
                    {...register('imageUrl')}
                />
            </div>

            {/* Post Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Post Type
                    </Label>
                    <Controller
                        name="postType"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-10! w-full! border-neutral-200 capitalize! dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-neutral-400 dark:focus:ring-neutral-700 text-sm">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800">
                                    {Object.values(CommunityHubPostType).map((type) => (
                                        <SelectItem key={type} value={type} className="text-sm cursor-pointer capitalize">
                                            {type.replace(/_/g, ' ').toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Status
                    </Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-10! w-full! border-neutral-200 capitalize! dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-neutral-400 dark:focus:ring-neutral-700 text-sm">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-neutral-200 dark:border-slate-800">
                                    {Object.values(CommunityHubStatus).map((status) => (
                                        <SelectItem key={status} value={status} className="text-sm cursor-pointer capitalize">
                                            {status.toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* Visibility Controls */}
            <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                    Visible To
                </Label>
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 bg-neutral-50 dark:bg-slate-900 p-3 rounded-lg border border-neutral-100 dark:border-slate-800">
                    {([
                        { name: 'visibility.showToStaff' as const, id: 'showToStaff', label: 'Staff' },
                        { name: 'visibility.showToOrgAdmin' as const, id: 'showToOrgAdmin', label: 'Org Admin' },
                        { name: 'visibility.showToAdmin' as const, id: 'showToAdmin', label: 'System Admin' },
                    ]).map(({ name, id, label }) => (
                        <div key={id} className="flex items-center space-x-2">
                            <Controller
                                name={name}
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id={id}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-neutral-300 dark:border-slate-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-slate-100"
                                    />
                                )}
                            />
                            <label htmlFor={id} className="text-xs font-medium text-neutral-700 dark:text-slate-300 cursor-pointer select-none">
                                {label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Private Toggle */}
            <div className="flex items-center space-x-2 py-1">
                <Controller
                    name="isPrivate"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            id="isPrivate"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-100"
                        />
                    )}
                />
                <label htmlFor="isPrivate" className="text-xs font-medium text-neutral-800 dark:text-slate-200 cursor-pointer select-none">
                    Restrict access (Make this post private)
                </label>
            </div>

            {
                errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )
            }
            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-slate-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="h-10 w-full cursor-pointer sm:w-auto border-neutral-200 dark:border-slate-800 text-neutral-600 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-900 text-sm font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 w-full cursor-pointer sm:w-auto bg-neutral-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-neutral-800 dark:hover:bg-slate-200 text-sm font-medium shadow-sm transition-colors"
                >
                    {isEdit
                        ? (isSubmitting ? "Updating..." : "Update Post")
                        : (isSubmitting ? "Creating..." : "Create Post")
                    }
                </Button>
            </div>
        </form>
    );
};