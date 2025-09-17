import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TriangleAlert } from 'lucide-react';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center text-center px-4 bg-secondary/20">
        <div className="space-y-6 max-w-lg mx-auto">
          <TriangleAlert className="mx-auto h-16 w-16 text-primary/80" />
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl font-headline">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-foreground/70">
            Oops! It seems you've ventured off the beaten path. The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
