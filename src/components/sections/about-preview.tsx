import Link from 'next/link';

export const AboutPreview = () => {
  return (
    <div className="space-y-4">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold text-lg">Inioluwa.xyz</span>
      </Link>
      <p className="text-base text-foreground/70">
        An architecture student and Web3 developer exploring the intersection of space, code, and community to build more equitable and beautiful futures.
      </p>
       <p className="text-base text-foreground/70">
        Design as a tool for transformation.
      </p>
    </div>
  );
};
