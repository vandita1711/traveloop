"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

const initialState = { success: false, error: undefined as string | undefined };

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterValues) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("confirmPassword", values.confirmPassword);

      const state = await registerUser(initialState, formData);

      if (!state.success) {
        setServerError(state.error ?? "Unable to create account.");
        return;
      }

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="w-full max-w-lg border-white/70 bg-white/78 shadow-card">
      <CardHeader className="space-y-3">
        <div className="inline-flex w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700">
          Build your first trip in minutes
        </div>
        <CardTitle className="text-3xl">Create your account</CardTitle>
        <CardDescription>
          Set up your workspace and jump straight into the travel-planning dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} name="name" />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} name="email" />
            {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} name="password" />
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                name="confirmPassword"
              />
              {errors.confirmPassword ? (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </div>
          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
          <Button type="submit" className="mt-2" disabled={isPending}>
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already planning a trip?{" "}
            <Link href="/login" className="font-semibold text-slate-900">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
