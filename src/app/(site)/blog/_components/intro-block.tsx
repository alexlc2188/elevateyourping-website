
interface IntroBlockProps {
  children: React.ReactNode;
}

export function IntroBlock({ children }: IntroBlockProps) {
  return (
    <div className="max-w-none text-base md:text-lg leading-relaxed mb-8 font-semibold">
      {children}
    </div>
  );
}
