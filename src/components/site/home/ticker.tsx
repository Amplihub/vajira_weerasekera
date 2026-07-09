export function Ticker() {
  const textItems = [
    "FORMER MICROSOFT CTO - ASIA",
    "FORMER RED HAT VP - ASIA",
    "30+ YEARS GLOBAL LEADERSHIP",
    "EXECUTIVE COACH",
    "KEYNOTE SPEAKER",
  ];

  // Duplicate the array multiple times to ensure the track fills the screen
  // and loops seamlessly with the -50% translateX marquee animation
  const repeatedItems = [...textItems, ...textItems, ...textItems, ...textItems];

  return (
    <div className="w-full overflow-hidden relative z-10 bg-white/40 backdrop-blur-md border-y border-slate-200/50 py-4">
      <div className="flex w-max min-w-full animate-[marquee_50s_linear_infinite] items-center">
        {repeatedItems.map((text, i) => (
          <div key={i} className="flex items-center">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-800 whitespace-nowrap">
              {text}
            </span>
            <span className="mx-8 text-blue-600 text-lg leading-none">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
