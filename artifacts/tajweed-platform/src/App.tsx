import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation, Redirect } from 'wouter';
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser, useAuth } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { useEffect, useRef, useState } from 'react';
import { useSyncUser, useGetCurrentUser, setAuthTokenGetter } from '@workspace/api-client-react';

// Pages
import HomePage from '@/pages/home';
import ApplyPage from '@/pages/apply';
import DashboardRouter from '@/pages/dashboard/router';
import AdminRouter from '@/pages/admin/router';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(204, 46%, 48%)",
    colorForeground: "hsl(210, 40%, 22%)",
    colorMutedForeground: "hsl(210, 25%, 48%)",
    colorDanger: "hsl(0, 84%, 60%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(210, 30%, 87%)",
    colorInputForeground: "hsl(210, 40%, 22%)",
    colorNeutral: "hsl(210, 30%, 87%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center ui-sans",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl border border-border",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-serif text-primary text-center",
    headerSubtitle: "text-muted-foreground text-center ui-sans",
    socialButtonsBlockButtonText: "ui-sans font-medium",
    formFieldLabel: "text-primary font-medium ui-sans",
    footerActionLink: "text-secondary font-medium hover:text-primary ui-sans",
    footerActionText: "text-muted-foreground ui-sans",
    dividerText: "text-muted-foreground ui-sans",
    identityPreviewEditButton: "text-secondary ui-sans",
    formFieldSuccessText: "text-primary ui-sans",
    alertText: "text-destructive ui-sans",
    logoBox: "flex justify-center mb-4",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "border border-border hover:bg-muted/50 rounded-lg ui-sans",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg ui-sans font-medium shadow-sm transition-colors",
    formFieldInput: "rounded-lg border-border focus:ring-ring focus:border-ring ui-sans placeholder:text-muted-foreground",
    footerAction: "ui-sans",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive/20 text-destructive ui-sans rounded-lg",
    otpCodeFieldInput: "border-border ui-sans",
    formFieldRow: "ui-sans",
    main: "ui-sans",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(180 78% 24% / 0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative z-10 w-full max-w-md">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(180 78% 24% / 0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative z-10 w-full max-w-md">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

// Attach Clerk bearer token to every API request
function ClerkTokenSetter() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

// Ensure the user is synced with our local database before proceeding to dashboards
function UserSync() {
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const { mutate: syncUser } = useSyncUser();
  
  useEffect(() => {
    if (user && !synced) {
      syncUser(
        { 
          data: { 
            clerkId: user.id, 
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || '',
            avatarUrl: user.imageUrl 
          } 
        },
        {
          onSuccess: () => setSynced(true),
          onError: (err) => console.error("Failed to sync user", err)
        }
      );
    }
  }, [user, synced, syncUser]);

  if (!synced) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return <RoleRouter />;
}

// Render the correct router inline (used at /dashboard and /admin routes)
function RoleRouter() {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!currentUser) return <Redirect to="/" />;

  if (currentUser.role === 'teacher') {
    return <AdminRouter />;
  }
  
  return <DashboardRouter />;
}

// Sync user then redirect to the correct section (used at / route only)
function SyncThenRedirect() {
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const { mutate: syncUser } = useSyncUser();
  const { data: currentUser, isLoading } = useGetCurrentUser();

  useEffect(() => {
    if (user && !synced) {
      syncUser(
        {
          data: {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || '',
            avatarUrl: user.imageUrl,
          },
        },
        {
          onSuccess: () => setSynced(true),
          onError: (err) => console.error("Failed to sync user", err),
        }
      );
    }
  }, [user, synced, syncUser]);

  if (!synced || isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!currentUser) return <HomePage />;
  if (currentUser.role === 'teacher') return <Redirect to="/admin" />;
  return <Redirect to="/dashboard" />;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <SyncThenRedirect />
      </Show>
      <Show when="signed-out">
        <HomePage />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "مرحباً بعودتك",
            subtitle: "سجل دخولك للوصول إلى حسابك",
          },
        },
        signUp: {
          start: {
            title: "إنشاء حساب جديد",
            subtitle: "ابدأ رحلتك معنا اليوم",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkTokenSetter />
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/apply" component={ApplyPage} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          
          <Route path="/dashboard/*?" component={UserSync} />
          <Route path="/admin/*?" component={UserSync} />
          
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
