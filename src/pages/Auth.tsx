import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (!error) navigate("/");
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signUp(email, password, displayName);
    if (!error) {
      setEmail("");
      setPassword("");
      setDisplayName("");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a password reset link." });
      setShowForgot(false);
      setForgotEmail("");
    }
    setIsLoading(false);
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group mb-8">
              <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              <span className="font-serif text-3xl font-bold text-primary">Poetry Hub</span>
            </Link>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">We'll send you a reset link</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-8">
            <BookOpen className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="font-serif text-3xl font-bold text-primary">Poetry Hub</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to save your favorite poems</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <button type="button" onClick={() => setShowForgot(true)} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center">
                    Forgot your password?
                  </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up to start building your poetry collection</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name</Label>
                    <Input id="signup-name" type="text" placeholder="Your Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/discover")}>
            Continue as Guest →
          </Button>
          <p className="text-xs text-muted-foreground mt-1">Browse poems without an account</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
