import Image from "next/image";
import Link from "next/link";

interface TrainingPackCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export function TrainingPackCard({
  title,
  description,
  image,
  href,
}: TrainingPackCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl overflow-hidden border border-slate-700 bg-white/5 hover:bg-white/10 p-4 transition-all w-full max-w-[280px] shadow-md hover:shadow-blue-500/30 hover:-translate-y-1 hover:scale-[1.02] duration-200 cursor-pointer">
      <div className="relative w-full aspect-[3/4]">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-lg font-bold  mb-1">{title}</h3>
      <p className="text-sm text-slate-700 line-clamp-2 ">{description}</p>
    </Link>
  );
}
