import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, BookOpen, MessageSquare, Clock } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useReadingStreak } from "@/hooks/useReadingStreak";
import ReadingHeatmap from "@/components/ReadingHeatmap";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [stats, setStats] = useState({ favorites: 0, history: 0, comments: 0, collections: 0 });

  usePageTitle("Profile");
  const { data: streakData } = useReadingStreak(user?.id);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }

    const fetchData = async () => {
      // Fetch profile
      const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
      if (data) setDisplayName(data.display_name || "");

      // Fetch stats in parallel
      const [favRes, histRes, commRes, collRes] = await Promise.all([
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reading_history").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("collections").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setStats({
        favorites: favRes.count || 0,
        history: histRes.count || 0,
        comments: commRes.count || 0,
        collections: collRes.count || 0,
      });
      setLoading(false);
    };

    fetchData();
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);
    toast(error
      ? { title: "Error", description: "Failed to update profile.", variant: "destructive" as const }
      : { title: "Success", description: "Your profile has been updated." });
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password Updated", description: "Your password has been changed." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const statItems = [
    { icon: Heart, label: "Favorites", value: stats.favorites },
    { icon: Clock, label: "Poems Read", value: stats.history },
    { icon: MessageSquare, label: "Comments", value: stats.comments },
    { icon: BookOpen, label: "Collections", value: stats.collections },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map(({ icon: Icon, label, value }) => (
              <Card key={label}>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{value}</span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                  <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter your display name" />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-pw">New Password</Label>
                  <Input id="new-pw" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pw">Confirm Password</Label>
                  <Input id="confirm-pw" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} required />
                </div>
                <Button type="submit" disabled={changingPassword}>
                  {changingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
