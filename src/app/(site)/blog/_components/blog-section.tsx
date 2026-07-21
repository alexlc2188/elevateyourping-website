// components/BlogSection.tsx
export function BlogSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-[#f9fafb] rounded-xl p-6 my-10 shadow-sm">
      {children}
    </section>
  );
}
