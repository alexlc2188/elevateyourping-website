import React from "react";

export const TestimonialSection = () => {
  return (
    <section className="py-12 px-6 bg-secondary">
      <h2 className="text-center text-4xl md:text-5xl tracking-tight mb-12">
        💬 What Table Tennis Players Are Saying
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="italic mb-4 text-muted-foreground">
            “I never knew what to work on after matches. Now I get feedback and
            drills tailored to my game.”
          </p>
          <div className="font-semibold">Jay — Club Player</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="italic mb-4 text-muted-foreground">
            “The beginner pack helped me improve fast. I love loading drills and
            starting the timer — it’s addictive.”
          </p>
          <div className="font-semibold">Ali — Beginner</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border">
          <p className="italic mb-4 text-muted-foreground">
            “This is like having a private coach in my pocket. Great app, great
            drills, and amazing review quality.”
          </p>
          <div className="font-semibold">Vincent — State Player</div>
        </div>
      </div>
    </section>
  );
};
