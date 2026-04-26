import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import { CSPostHogProvider } from "./providers";
import { AuthProvider } from "@/components/AuthProvider";
import { PersonaProvider } from "@/components/PersonaProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Path Pilot — Learn. Code. Get Hired.",
  description: "India's smartest learning platform for Tier 2 & 3 engineering students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans antialiased" style={{ backgroundColor: '#FDF6EC', color: '#2C1A0E' }}>
        <ErrorBoundary>
          <PersonaProvider>
            <AuthProvider>
              <CSPostHogProvider>
                {children}
              </CSPostHogProvider>
            </AuthProvider>
          </PersonaProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
