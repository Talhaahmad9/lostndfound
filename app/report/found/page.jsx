import ReportFoundForm from "@/components/ReportFound/ReportFoundForm";

export const metadata = {
  title: "Report Found Item - Lost & Found App",
  description:
    "Report an item you have found to help reunite it with its owner.",
};

// Page component
const ReportFoundPage = () => {
  return (
    <ReportFoundForm />
  );
};

export default ReportFoundPage;
