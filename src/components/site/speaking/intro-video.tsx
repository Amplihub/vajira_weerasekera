// Speaker reel — real <video> with native controls. Source + poster live in
// /public/videos (ported from the MVP).
export function SpeakingIntroVideo() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto flex max-w-[1664px] flex-col items-center gap-12 px-6 py-20 sm:px-8 lg:px-[128px] lg:py-[100px]">
        <h2 className="max-w-3xl text-center font-heading text-4xl font-semibold leading-[1.15] tracking-[-0.5px] sm:text-5xl">
          <span className="text-brand-ink">from recent </span>
          <span className="text-brand-blue">keynotes, leadership interviews</span>
          <span className="text-brand-ink">, and </span>
          <span className="text-brand-blue">forum panels.</span>
        </h2>

        <video
          controls
          preload="metadata"
          poster="/videos/speaker-reel-poster.jpg"
          className="aspect-video w-full max-w-4xl rounded-3xl border border-brand-navy/10 bg-brand-navy/10 shadow-card"
        >
          <source src="/videos/speaker-reel.mp4" type="video/mp4" />
          Your browser does not support the video element.
        </video>
      </div>
    </section>
  );
}
