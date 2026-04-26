"use client";

import VerifyLoggedInUser from "@/components/shared/verify-user";
import { useCurrentUser } from "@/features/auth/hooks";
import { BiError } from "react-icons/bi";

export  function ResourceErrorState({ message }: { message: string }) {
    const {user} =  useCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
      <BiError className="h-10 w-10 text-red-500" aria-hidden="true" />
      <p className="text-sm font-medium text-red-700 dark:text-red-300">{message}</p>
      {
        user?.id || user?.name === null ? null : (
         <VerifyLoggedInUser className="px-4 py-2 rounded bg-red-400 text-xs cursor-pointer hover:bg-red-600" />
        )
      }
    </div>
  );
}
