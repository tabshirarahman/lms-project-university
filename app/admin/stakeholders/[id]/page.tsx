import { StakeholderForm } from "@/components/admin/stakeholder-form";

export default function EditStakeholderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto py-8">
      <StakeholderForm id={(params as any).id} />
    </div>
  );
}
