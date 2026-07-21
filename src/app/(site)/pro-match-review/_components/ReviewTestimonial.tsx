import Image from "next/image";

export function ReviewTestimonials() {
  const testimonials = [
    {
      quote: (
        <span className="italic">
          “I went from{" "}
          <span className="text-red-600 font-bold">1100 to 1450</span> in just 3
          months — all because I finally knew{" "}
          <span className="text-red-600 font-bold">what to work on</span>.”
        </span>
      ),
      name: "Daniel",
      role: "Club Player",
      image: "/images/pro-players/daniel-rounded.png",
    },
    {
      quote: (
        <span className="italic">
          “Alex is not just a skilled player but also a fantastic coach with
          years of experience competing at the highest international levels. His
          deep understanding of the game — from{" "}
          <span className="text-red-600 font-bold">advanced strategy</span> to{" "}
          <span className="text-red-600 font-bold">fine-tuning technique</span>{" "}
          — makes him an invaluable teacher.”
        </span>
      ),
      name: "Nicholas Lum",
      role: "Australian National Team • WR #41",
      image: "/images/pro-players/nicholas-lum-rounded.png",
    },
  ];

  return (
    <section className="bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 px-4 md:flex-row md:gap-6 md:justify-center">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm w-full md:w-[45%] flex flex-col justify-between">
            <div className="text-slate-700 text-base leading-relaxed flex-grow">
              {t.quote}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Image
                src={t.image}
                alt={t.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">{t.name}</div>
                <div className="text-slate-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
