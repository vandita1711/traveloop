import { RegisterForm } from "@/components/auth/register-form";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="auth-surface flex min-h-screen items-center justify-center px-4 py-10 md:px-8">
      <RegisterForm />
    </div>
  );
}
