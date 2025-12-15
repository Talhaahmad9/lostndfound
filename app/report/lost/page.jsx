// app/report/lost/page.jsx

import ReportLostForm from "@/components/ReportLost/ReportLostForm";

export const metadata = {
  title: "Report Lost Item - Lost & Found App",
  description:
    "Report an item you have Lost to help us to find it back.",
};

export default function ReportLostPage() {
  return (
    // The main layout already applies max-width and centering, so we just render the form
    <ReportLostForm />
  );
}
