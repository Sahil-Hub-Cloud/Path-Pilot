import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import { CSPostHogProvider } from "./providers";
import { AuthProvider } from "@/components/AuthProvider";
import { PersonaProvider } from "@/components/PersonaProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RoleRouteGuard } from "@/components/RoleRouteGuard";
import Navbar from "@/components/Navbar";

export const dynamic = 'force-dynamic'
export const revalidate = 0

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Path Pilot — Learn. Code. Get Hired.",
  description: "India's smartest learning platform for Tier 2 & 3 engineering students.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('pathpilot_theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[var(--bg-cream)] text-[var(--text-dark)]">
        <ErrorBoundary>
          <PersonaProvider>
            <AuthProvider>
              <RoleRouteGuard>
                <CSPostHogProvider>
                  <Navbar />
                  {children}
                </CSPostHogProvider>
              </RoleRouteGuard>
            </AuthProvider>
          </PersonaProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
