export const HeroBanner = () => {
  return (
    <div className="relative w-full h-52 md:h-auto overflow-hidden mb-10 shadow">
      <img
        src="/images/hero-admin.jpg" // Place your table tennis image here
        alt="Admin Dashboard"
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-2xl md:text-4xl font-bold">Admin Control Panel</h1>
        <p className="mt-2 text-sm md:text-lg text-white/80">
          Manage content, review matches, and power up the platform.
        </p>
      </div>
    </div>
  );
};
