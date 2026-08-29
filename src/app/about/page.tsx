export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About VidStream
            </h1>
            <p className="text-lg text-zinc-400">
              Your ultimate cinematic destination.
            </p>
          </div>

          <div className="prose prose-invert max-w-none prose-zinc">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-zinc-300 leading-relaxed mb-8">
                At VidStream, we believe that everyone deserves access to high-quality entertainment. 
                Our platform is designed to provide a seamless, beautiful, and intuitive streaming experience. 
                Whether you're looking for the latest blockbusters, timeless classics, or hidden gems, 
                VidStream brings the magic of cinema directly to your screen.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h2>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex gap-3">
                  <span className="text-blue-500">✓</span>
                  <span><strong>Premium Design:</strong> A sleek, distraction-free interface built for binge-watching.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500">✓</span>
                  <span><strong>Lightning Fast:</strong> Optimized for speed so you spend less time waiting and more time watching.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500">✓</span>
                  <span><strong>Vast Library:</strong> Discover a massive collection of movies and TV shows powered by TMDB.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
