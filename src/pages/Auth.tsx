import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Loader2, ArrowLeft, Mail } from 'lucide-react';

// Auth cleanup utility
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to complete your registration.",
      });
      
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in.",
        });
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen w-full bg-gradient-subtle flex items-center justify-center px-4">
        <Card className="glass-card w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SpotLink Vault
              </CardTitle>
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Reset Password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email to receive a password reset link
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-foreground">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                variant="glass-primary"
                disabled={resetLoading}
              >
                {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
            <Button
              variant="ghost"
              onClick={() => setShowForgotPassword(false)}
              className="w-full gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SpotLink Vault
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="glass-card w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">Welcome</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to your account or create a new one
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground text-muted-foreground"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground text-muted-foreground"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="glass-primary"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Forgot your password?
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-white/20 bg-white/5 text-foreground placeholder:text-muted-foreground"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="glass-primary"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground text-center">
                  By creating an account, you agree to our terms of service and privacy policy.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;