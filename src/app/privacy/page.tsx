export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-zinc-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm">
            <div className="space-y-8 text-zinc-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="leading-relaxed">
                  VidStream prioritizes your privacy. We collect minimal information necessary to provide you with the best streaming experience. This may include usage data, preferences, and technical information about your device. We do not sell your personal data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">
                  The information we collect is used in the following ways:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To personalize your experience and deliver content relevant to your interests.</li>
                  <li>To improve our website, services, and overall user experience.</li>
                  <li>To analyze usage patterns and optimize performance.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services</h2>
                <p className="leading-relaxed">
                  We use third-party services like TMDB (The Movie Database) for content metadata. These services may have their own privacy policies. We are not responsible for the privacy practices of these third-party providers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>
              
              <section className="pt-4 border-t border-white/10">
                <p className="text-sm text-zinc-500">
                  If you have any questions about this Privacy Policy, please contact us through our social channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
