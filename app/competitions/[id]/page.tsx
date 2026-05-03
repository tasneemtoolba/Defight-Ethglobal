import { CompetitionDetailClient } from "@/components/CompetitionDetailClient";

type Props = { params: { id: string } };

export default function CompetitionDetailPage({ params }: Props) {
  return <CompetitionDetailClient competitionId={params.id} />;
}
