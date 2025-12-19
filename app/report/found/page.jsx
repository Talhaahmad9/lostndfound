'use client';

import ReportFoundForm from "@/components/ReportFound/ReportFoundForm";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const ReportFoundPage = () => {
  const { userId } = useAuth();
  if (!userId) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">Please sign in to report a found item.</p>
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }
  return <ReportFoundForm />;
};

export default ReportFoundPage;
