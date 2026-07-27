"use client";

import CopyButton from "@/components/Copybtn";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handelLogin } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DemoState = "BTN" | "MODAL";

async function persistLegacyJwt() {
  const res = await fetch("/api/user/session-token", {
    credentials: "include",
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { token?: string };
  if (!data.token) return false;
  sessionStorage.setItem("relio-jwt", data.token);
  return true;
}

function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [currActive, setCurrActive] = useState<DemoState>("BTN");
  const [isLoading, setIsLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const finishAuth = async (message: string) => {
    await persistLegacyJwt();
    toast.success(message);
    router.push("/home");
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (!error) {
        await finishAuth("Login successful");
        return;
      }

      // Legacy demo / JWT users (username + password on User table)
      const localPart = email.includes("@") ? email.split("@")[0] : email;
      const ok = await handelLogin(localPart, password);
      if (ok) {
        toast.success("Login successful");
        router.push("/home");
        return;
      }

      toast.error(error.message || "Invalid email or password");
    } catch {
      try {
        const localPart = email.includes("@") ? email.split("@")[0] : email;
        const ok = await handelLogin(localPart, password);
        if (ok) {
          toast.success("Login successful");
          router.push("/home");
          return;
        }
      } catch {
        // ignore
      }
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim();
    const password = regPassword;

    if (!name || !email || !password) {
      toast.error("Name, email, and password are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== regConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Could not create account");
        return;
      }

      await finishAuth("Account created");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center tracking-tight">
      <div className="absolute top-5 right-5">
        <ThemeToggleButton start="top-down" variant="rectangle" />
      </div>
      <Card className="w-full max-w-md bg-transparent backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome to Relio</CardTitle>
          <CardDescription>
            Sign in with email and password, or create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={onLogin} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spinner />}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <form onSubmit={onRegister} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Name</Label>
                  <Input
                    id="reg-name"
                    autoComplete="name"
                    placeholder="Your name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirm password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spinner />}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
