import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { CommunityHub, CommunityHubPostType, CommunityHubStatus, PostCommunityFormData, PostVisibility } from '@/types/community';
import SharedRichEditor from '@/components/shared/RichEditor';




type InnerFormProps = {
    onCancel: () => void;
    onSubmit: (data: PostCommunityFormData) => void;
    isSubmitting?: boolean;
    isEdit?: boolean;
    initialData?: CommunityHub | undefined;
};

export const PostCommunityInnerForm = ({ onCancel, onSubmit, isSubmitting = false, isEdit = false, initialData }: InnerFormProps) => {
    const [formData, setFormData] = useState<PostCommunityFormData>({
        title: '',
        content: '',
        imageUrl: '',
        visibility: {
            showToStaff: true,
            showToOrgAdmin: true,
            showToAdmin: false,
        },
        isPrivate: false,
        postType: CommunityHubPostType.GENERAL_DISCUSSION,
        status: CommunityHubStatus.DRAFT,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: 'postType' | 'status', value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleVisibilityChange = (role: keyof PostVisibility, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            visibility: { ...prev.visibility, [role]: checked },
        }));
    };

    const handlePrivateChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isPrivate: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Populate form with initial data when in edit mode
    React.useEffect(() => {
        if (isEdit && initialData !== undefined) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                imageUrl: initialData.imageUrl || '',
                visibility: initialData.visibility,
                isPrivate: initialData.isPrivate,
                // Force strings explicitly to match enum values
                postType: (initialData.postType as CommunityHubPostType) || CommunityHubPostType.GENERAL_DISCUSSION,
                status: (initialData.status as CommunityHubStatus) || CommunityHubStatus.DRAFT,
            });
        }

    }, [isEdit, initialData,]);


    return (
        <form onSubmit={handleSubmit} className="space-y-5 w-full text-neutral-900 dark:text-neutral-100">
            {/* Title */}
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Title
                </Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your post a title..."
                    required
                    className="h-10 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
                />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Content
                </Label>
                {/* <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="What would you like to share?"
                    rows={4}
                    required
                    className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm resize-none"
                /> */}
                <SharedRichEditor
                    value={formData.content}
                    onChange={(htmlValue) => setFormData({...formData, content: htmlValue})}
                    placeholder="Provide the technical specifications or renewal deadlines for this resource request..."
                />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
                <Label htmlFor="imageUrl" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Image URL (Optional)
                </Label>
                <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="h-10 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm"
                />
            </div>

            {/* Post Type & Status (Stacked on small screens, side-by-side on sm screens and up) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Post Type
                    </Label>
                    <Select
                        value={formData.postType || initialData?.postType || undefined}
                        onValueChange={(val) => handleSelectChange('postType', val)}
                    >
                        <SelectTrigger className="h-10! w-full! border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-neutral-400 dark:focus:ring-neutral-700 text-sm">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                            {Object.values(CommunityHubPostType).map((type) => (
                                <SelectItem key={type} value={type} className="text-sm cursor-pointer capitalize">
                                    {type.replace('_', ' ').toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Status
                    </Label>
                    <Select
                        value={formData.status || initialData?.status || CommunityHubStatus.DRAFT}
                        onValueChange={(val) => handleSelectChange('status', val)}

                    >
                        <SelectTrigger className="h-10! w-full! border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-neutral-400 dark:focus:ring-neutral-700 text-sm">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                            {Object.values(CommunityHubStatus).map((status) => (
                                <SelectItem key={status} value={status} className="text-sm cursor-pointer capitalize">
                                    {status.toLowerCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Visibility Controls */}
            <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                    Visible To
                </Label>
                {/* Responsive layout: wraps options into rows natively on tiny mobile layouts */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showToStaff"
                            checked={formData.visibility.showToStaff}
                            onCheckedChange={(checked) => handleVisibilityChange('showToStaff', !!checked)}
                            className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-100"
                        />
                        <label htmlFor="showToStaff" className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                            Staff
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showToOrgAdmin"
                            checked={formData.visibility.showToOrgAdmin}
                            onCheckedChange={(checked) => handleVisibilityChange('showToOrgAdmin', !!checked)}
                            className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-100"
                        />
                        <label htmlFor="showToOrgAdmin" className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                            Org Admin
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showToAdmin"
                            checked={formData.visibility.showToAdmin}
                            onCheckedChange={(checked) => handleVisibilityChange('showToAdmin', !!checked)}
                            className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-100"
                        />
                        <label htmlFor="showToAdmin" className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                            System Admin
                        </label>
                    </div>
                </div>
            </div>

            {/* Private Toggle Option */}
            <div className="flex items-center space-x-2 py-1">
                <Checkbox
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => handlePrivateChange(!!checked)}
                    className="border-neutral-300 dark:border-neutral-700 data-[state=checked]:bg-neutral-900 dark:data-[state=checked]:bg-neutral-100"
                />
                <label htmlFor="isPrivate" className="text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer select-none">
                    Restrict access (Make this post private)
                </label>
            </div>

            {/* Actions (Responsive layout changes button orientation on small devices) */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="h-10 w-full cursor-pointer sm:w-auto border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 w-full cursor-pointer sm:w-auto bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium shadow-sm transition-colors"
                >
                    {isEdit ? (isSubmitting ? "Updating..." : "Update Post") : (isSubmitting ? "Creating..." : "Create Post")}
                </Button>
            </div>
        </form>
    )
}