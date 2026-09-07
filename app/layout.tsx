import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'All About Pawz OS - Dashboard',
  description: 'Pet grooming operations management, appointment scheduling, staff capacity, revenue analytics, and client records for All About Pawz.',
  openGraph: {
    title: 'All About Pawz OS - Dashboard',
    description: 'Pet grooming operations management, appointment scheduling, staff capacity, revenue analytics, and client records for All About Pawz.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All About Pawz OS - Dashboard',
    description: 'Pet grooming operations management, appointment scheduling, staff capacity, revenue analytics, and client records for All About Pawz.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full bg-surface">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
          rel="stylesheet" 
        />
      </head>
      <body className="h-full antialiased bg-surface text-on-surface font-body-md selection:bg-primary selection:text-on-primary" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
