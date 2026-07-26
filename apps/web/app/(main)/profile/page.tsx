"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  changeUserPassword,
  getUserData,
  updateUserProfile,
} from "@/lib/actions";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  username: string | null;
  displayUsername: string | null;
  emailVerified: boolean;
  createdAt: string;
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserData();
      const data = res?.data as Profile | undefined;
      if (!data) {
        toast.error("Could not load profile");
        return;
      }
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setUsername(data.username || "");
      setImage(data.image || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const displayName = name.trim() || username.trim() || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingProfile) return;

    setSavingProfile(true);
    try {
      const res = await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        username: username.trim() || null,
        image: image.trim() || null,
      });

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      setProfile((prev) => (prev && res.data ? { ...prev, ...res.data } : prev));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingPassword) return;

    if (!currentPassword || !newPassword) {
      toast.error("Enter your current and new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changeUserPassword(currentPassword, newPassword);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 items-center justify-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-64 w-full max-w-2xl" />
        <Skeleton className="h-56 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 items-center justify-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account details and password
        </p>
      </div>

      <Card className="w-100">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-xl">
              <AvatarImage src={image || undefined} alt={displayName} />
              <AvatarFallback className="rounded-xl text-base">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Account details</CardTitle>
              <CardDescription>
                Update how you appear across Relio
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={onSaveProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="optional"
                disabled={savingProfile}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-image">Avatar URL</Label>
              <Input
                id="profile-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                disabled={savingProfile}
              />
            </div>
            {profile?.createdAt && (
              <p className="text-muted-foreground text-xs">
                Member since{" "}
                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={savingProfile}>
              {savingProfile && <Spinner />}
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="w-100">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Choose a strong password you don&apos;t use elsewhere
          </CardDescription>
        </CardHeader>
        <form onSubmit={onChangePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={savingPassword}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={savingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={savingPassword}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={savingPassword}>
              {savingPassword && <Spinner />}
              Update password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default ProfilePage;
