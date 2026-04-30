/**
 * Loading Component (Splash Screen)
 *
 * Japanese-inspired music visualization themed loading screen.
 * Features animated wave lines and pulsing text that matches
 * the aesthetic of the main hero section.
 */
export default function Loading() {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Light gradient background matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 z-0"></div>

      {/* Animated wave lines background */}
      <div className="absolute inset-0 z-10">
        {/* Top wave lines */}
        <div className="absolute top-1/4 left-0 right-0 flex flex-col gap-8 opacity-60">
          <div
            className="h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full animate-wave-slide"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-wave-slide"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full animate-wave-slide"
            style={{ animationDelay: "400ms" }}
          />
        </div>

        {/* Bottom wave lines */}
        <div className="absolute bottom-1/4 left-0 right-0 flex flex-col gap-8 opacity-60">
          <div
            className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full animate-wave-slide-reverse"
            style={{ animationDelay: "100ms" }}
          />
          <div
            className="h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full animate-wave-slide-reverse"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-wave-slide-reverse"
            style={{ animationDelay: "500ms" }}
          />
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-20 text-center px-4">
        {/* Animated logo/icon placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-20 h-20">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-spin-slow"
              style={{
                borderImage:
                  "linear-gradient(135deg, #FF6B9D, #AA96DA, #4ECDC4) 1",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute inset-2 rounded-full border-4 border-amber-400 animate-spin-slow-reverse opacity-80"
            />
            {/* Center dot */}
            <div
              className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 animate-pulse-slow"
            />
          </div>
        </div>

        {/* Loading text */}
        <div
          className="transition-all duration-700 opacity-100 translate-y-0"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-3">
            Loading
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Preparing your experience...
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div
            className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-200 rounded-full blur-3xl opacity-20"
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-15"
        />
      </div>
    </div>
  );
}
