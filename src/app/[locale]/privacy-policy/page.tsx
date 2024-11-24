import PdfViewer from "@/components/shared/PdfViewer";

export default function PrivacyStatement() {
  return (
    <div className="h-fit min-h-screen w-screen">
      <PdfViewer pdfUrl="/legal/privacy_policy.pdf" />
    </div>
  );
}
