// app/community/[postId]/page.tsx
import CommunityPostDetail from '@/components/dashboard/community/post-details/CommunityPostDetail';


type Props = {
    params: Promise<{
        postId: string
    }>
}



// Next.js page components receive a `params` prop automatically
const PostDetailPage = async ({ params }: Props) => {
    const resolvedParams = await params;
    const postId = resolvedParams.postId;

    // Optional: You could fetch your post data directly here on the server
    // const post = await getPostFromDb(postId);

    return (
        <CommunityPostDetail postId={postId} />
    )
}

export default PostDetailPage