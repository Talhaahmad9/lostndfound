'use client';

import ReportLostForm from "@/components/ReportLost/ReportLostForm";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function ReportLostPage() {
  const { userId } = useAuth();
  if (!userId) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">Please sign in to report a lost item.</p>
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }
  return <ReportLostForm />;
}
