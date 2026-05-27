"use client";

export default function AboutSections() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-5 py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto">
        <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
          About
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.96] tracking-[-0.04em] text-white">
          RÌNWÁ Hospitality & Experiences Ltd.
        </h2>
        <p className="mx-auto mt-5 text-base leading-8 text-white/70">
          RÌNWÁ Hospitality & Experiences Ltd. (popularly known as The Badést
          Events) is an award-winning experiential hospitality and diaspora
          concierge consultancy operating across the Canada–Nigeria space. We
          design trusted, culturally intelligent environments that help people,
          brands, and institutions navigate Africa and Canada with greater ease,
          connection, and confidence.
        </p>
      </div>

      <div className="mx-auto mt-10 space-y-6 text-white/80">
        <p className="mx-auto text-base leading-8 text-white/70">
          At the intersection of hospitality, culture, business, and community,
          we specialize in experience design, strategic hospitality, curated
          travel support, cross-border engagement, and relationship-driven
          execution. Our work supports organizations, founders, diaspora
          communities, and global audiences looking to build meaningful presence
          across African and North American markets. Over the years, we have
          built a reputation for creating environments that influence audiences
          to arrive openly, engage deeply, stay longer, spend intentionally,
          share freely, and return with purpose.
        </p>

        <p className="mx-auto mt-5 text-base leading-8 text-white/70">
          Whether you are planning a wedding trip in Lagos, curating immersive
          cultural experiences, hosting international guests, entering new
          markets, or producing community-centered experiences in Toronto, you
          are right at home here.
        </p>

        <p className="mx-auto mt-5 text-base leading-8 text-white/70">
          RÌNWÁ exists to reduce friction, deepen connections, and transform
          hospitality into meaningful human experience.
        </p>

        <div className="pt-4">
          <a
            href="#contact"
            className="inline-block rounded-full bg-teal-400 px-6 py-3 text-sm font-medium text-black hover:opacity-95"
          >
            Travel With Us
          </a>
        </div>
      </div>
    </section>
  );
}
