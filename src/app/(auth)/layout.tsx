import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Sign In | Framo.dev',
};

export default function AuthLayout({children,}: {children: React.ReactNode;}) {
  return children;
}
