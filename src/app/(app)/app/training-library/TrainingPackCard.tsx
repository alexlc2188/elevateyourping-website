import Image from "next/image";
import { Play } from "lucide-react";
import { typeColors } from "@/constants/training";
import Link from "next/link";

type Props = {
  pack: {
    id: string;
    title: string;
    type: keyof typeof typeColors;
    drills: number;
    duration: string;
    image: string;
    idx: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  };
};

const difficultyStyles: Record<Props["pack"]["difficulty"], string> = {
  Beginner: "bg-blue-100 text-blue-800 border border-blue-300",
  Intermediate: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Advanced: "bg-red-100 text-red-800 border border-red-300",
};

export const TrainingPackCard = ({ pack }: Props) => {
  const { pill, text } = typeColors[pack.type] || {
    pill: "bg-slate-200",
    text: "text-slate-800",
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex items-center gap-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 p-3 ">
      {/* Image Block */}
      <div className="relative w-28 h-28 rounded-md overflow-hidden shrink-0">
        <Image
          src={`https://picsum.photos/600/400?random=${pack.idx}`}
          alt={pack.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Play className="w-6 h-6 text-white" />
        </div>
        <span
          className={`absolute bottom-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
            difficultyStyles[pack.difficulty]
          }`}>
          {pack.difficulty}
        </span>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span
            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${pill} ${text}`}>
            {pack.type.toUpperCase()}
          </span>
          <p className="font-semibold text-slate-900">{pack.title}</p>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <span>
              {pack.drills} drills • {pack.duration}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            href={`/training-pack/${pack.id}`}
            className="h-8 px-3 rounded-md border border-slate-300 text-slate-800 text-xs font-medium flex items-center justify-center hover:bg-slate-100 transition">
            Explore
          </Link>
          <Link
            href={`/training-pack/${pack.id}`}
            className="h-8 px-3 rounded-md bg-slate-100 text-black text-xs font-medium flex items-center justify-center hover:bg-black transition">
            Add to Training
          </Link>
        </div>
      </div>
    </div>
  );
};
