import { ResultForm } from "@/components/admin/result-form";

export default function EditResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto py-8">
      <ResultForm id={(params as any).id} />
    </div>
  );
}
