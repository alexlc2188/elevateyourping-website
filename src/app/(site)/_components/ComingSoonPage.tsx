export default function ComingSoonPage() {
  return (
    <main className="h-full flex items-center justify-center bg-slate-100 px-6">
      <div className="text-center max-w-md">
        {/* Logo Placeholder */}
        {/* <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-300 flex items-center justify-center text-xl font-bold text-white">
            LOGO
          </div>
        </div> */}

        {/* Title & Subtitle */}
        <h1 className="text-4xl text-slate-800 mb-4">Something Great is Coming</h1>
        <p className="text-slate-600 mb-6">
          We're working hard behind the scenes. Sign up to get notified when we launch!
        </p>

        {/* Email Capture Form */}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault()
            // Optionally add form handling logic here
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto"
          />
          <Button type="submit">Notify Me</Button>
        </form> */}

        <p className="text-sm text-slate-400 mt-6">
          © {new Date().getFullYear()} Elevate Your Ping. All rights reserved.
        </p>
      </div>
    </main>
  )
}