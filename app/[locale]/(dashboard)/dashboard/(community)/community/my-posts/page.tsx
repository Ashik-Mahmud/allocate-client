import MyPostMain from '@/components/dashboard/community/MyPostMain';

type Props = {}

export const metadata = {
  title: "My Posts",
  description: "View and manage your posts within the community hub, designed to help you stay connected and engaged with fellow members.",
}
const MyPostPage = (props: Props) => {
  return (
    <div>
        <MyPostMain />
    </div>
  )
}

export default MyPostPage