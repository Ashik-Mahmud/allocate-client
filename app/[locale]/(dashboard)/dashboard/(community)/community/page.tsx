import CommunityMain from '@/components/dashboard/community/community-main';

type Props = {}

export const metadata = {
  title: "Community Hub",
  description: "Engage with your community through our interactive hub, designed to foster connections and facilitate communication among members.",
}
const CommunityHubPage = (props: Props) => {
  return (
    <div>
      <CommunityMain />
    </div>
  )
}

export default CommunityHubPage