import Dashboard from "@/components/dashboard";
import React from "react";
import { auth } from "@/auth";

const page = async () => {
  const session = await auth();

  return (
    <div>
      <Dashboard session={session} />
    </div>
  );
};

export default page;
