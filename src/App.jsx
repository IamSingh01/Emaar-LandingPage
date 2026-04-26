import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

// Reliable Unsplash images — all load without auth or CORS issues
// Hero: luxury Dubai-style modern residential exteriors
const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
];

const RESIDENCES = [
  {
    // 1BR — bright modern living room interior
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    tag: "1 Bedroom",
    title: "One Bedroom Residence",
    area: "832 - 915 sq ft",
    beds: "1 Bedroom",
    baths: "2 Bathrooms",
    price: "From AED 1.74M",
    floorplanIndex: 0,
  },
  {
    // 2BR — open-plan kitchen/living space
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    tag: "2 Bedroom",
    title: "Two Bedroom Residence",
    area: "1,245 - 1,380 sq ft",
    beds: "2 Bedrooms",
    baths: "3 Bathrooms",
    price: "From AED 2.45M",
    floorplanIndex: 1,
  },
  {
    // 3BR — spacious luxury apartment interior
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    tag: "3 Bedroom",
    title: "Three Bedroom Residence",
    area: "1,650 - 1,825 sq ft",
    beds: "3 Bedrooms",
    baths: "4 Bathrooms",
    price: "From AED 3.2M",
    floorplanIndex: 2,
  },
];

const EXP_BG_IMAGES = [
  // Golf course / green landscape
  "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80",
  // Outdoor pool / resort
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
  // Urban park greenery
  "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
  // Luxury fitness / gym
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  // Infinity pool with city view
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
  // Modern apartment exterior
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
];

const GALLERY_IMAGES = [
  // Golf course aerial
  { src: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80", caption: "Golf Course Views", wide: false },
  // Luxury living room
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80", caption: "Living Area", wide: true },
  // Modern kitchen
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", caption: "Kitchen", wide: false },
  // Master bedroom
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", caption: "Bedroom", wide: false },
  // Balcony with city view
  { src: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80", caption: "Balcony", wide: false },
  // Rooftop / infinity pool
  { src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80", caption: "Pool", wide: true },
  // Park & green spaces
  { src: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80", caption: "Park & Green Spaces", wide: false },
];

const LIGHTBOX_DATA = {
  gallery: GALLERY_IMAGES.map((g) => ({ src: g.src, alt: g.caption })),
  floorplan: [
    { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80", alt: "1 Bedroom" },
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80", alt: "2 Bedroom" },
    { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80", alt: "3 Bedroom" },
  ],
};

const PROXIMITY = [
  { icon: "🏛️", title: "Downtown Dubai", time: "15 minutes" },
  { icon: "✈️", title: "DXB Airport", time: "20 minutes" },
  { icon: "🏖️", title: "Dubai Marina", time: "25 minutes" },
  { icon: "⛳", title: "Golf Course", time: "Championship 18-hole" },
];

const FOOTER_COLUMNS = [
  {
    title: "About EMAAR",
    links: ["Who We Are", "Contact Us", "FAQ", "Careers", "Whistleblower Line", "Investor Relations", "Latest Press Releases", "Emaar Blogs", "Mortgage Calculator", "Scam Alerts", "Emaar Sustainability", "Real Estate Glossary"],
  },
  {
    title: "Communities",
    links: ["Grand Polo Club & Resort", "Expo Living", "The Oasis", "The Heights Country Club & Wellness", "ADDRESS AL MARJAN ISLAND", "Dubai Hills Estate", "Dubai Creek Harbour", "The Valley", "Emaar Beachfront", "Rashid Yachts & Marina", "Dubai Marina", "Downtown Dubai", "Arabian Ranches III", "Emaar South"],
  },
  {
    title: "Latest Launches",
    links: ["Serro 2 at The Heights", "Serro at The Heights", "Salva at The Heights", "Greencrest at Dubai Hills Estate", "Vista Ridge at Emaar South", "Grove Ridge at Emaar South", "Marèva at The Oasis", "Marèva 2 at The Oasis", "Avarra by Palace", "Creek Haven at Dubai Creek Harbour", "View All Properties"],
  },
  {
    title: "Emaar International",
    links: ["KSA", "India", "Pakistan", "Egypt", "Morocco", "Turkey"],
  },
  {
    title: "Emaar Entertainment",
    links: ["Burj Khalifa", "Reel Cinemas", "Dubai Opera", "Dubai Ice Rink", "KidZania", "Sky Views Dubai", "Dubai Aquarium", "Arabic Music Institute", "Play DXB", "The Storm Coaster", "Dubai Fountain", "View All"],
  },
  {
    title: "Emaar Malls",
    links: ["Dubai Mall", "Dubai Marina Mall", "Dubai Hills Mall", "Gold and Diamond Park", "Souk Al Bahar", "The Springs Souk"],
  },
  {
    title: "Emaar Hospitality",
    links: ["Address Hotels + Resorts", "Vida Hotels and Resorts", "ARMANI HOTELS & RESORTS", "Al Alamein Hotel Egypt", "Rove Hotels"],
  },
  {
    title: "Emaar Leisure",
    links: ["Dubai Polo & Equestrian Club", "Arabian Ranches Golf Club", "Dubai Hills Golf Club", "Dubai Marina Yacht Club", "Creek Marina Yacht Club", "Veo Fitness"],
  },
  {
    title: "Trending Searches",
    links: ["Properties Dubai Hills Estate", "Luxury Apartments Dubai Hills", "Off-Plan Properties Dubai", "Waterfront Apartments Dubai", "Properties Rashid Yachts & Marina", "Properties in The Valley", "Apartments for Sale Dubai", "Villa for Sale Dubai", "Penthouse Dubai", "3 Bedroom Apartments Dubai"],
  },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );
    const els = document.querySelectorAll("[data-scroll]");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const animate = () => {
      dot.current.x += (mouse.current.x - dot.current.x) * 0.5;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.5;
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.left = `${dot.current.x}px`;
        dotRef.current.style.top = `${dot.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x - 20}px`;
        ringRef.current.style.top = `${ring.current.y - 20}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const expand = () => ringRef.current && (ringRef.current.style.transform = "scale(1.5)");
    const shrink = () => ringRef.current && (ringRef.current.style.transform = "scale(1)");
    const targets = document.querySelectorAll("a, button, .masonry-item, .bento-item");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function Nav({ onOpenContact }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setNavOpen(false);
  };

  return (
    <nav className={`nav-glass${scrolled ? " scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <img
            src="https://properties.emaar.com/static/images/emaar-logo.svg"
            alt="Emaar Properties"
            className="logo-image"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
          <div className="logo-text-fallback" style={{ display: "none" }}>
            <span className="logo-text">EMAAR</span>
          </div>
        </div>

        <div className={`nav-menu${navOpen ? " active" : ""}`} id="navMenu">
          {["home", "concept", "residences", "experience", "gallery", "location"].map((id) => (
            <a key={id} href={`#${id}`} className="nav-link" onClick={(e) => { e.preventDefault(); smoothScroll(id); }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <a href="#connect" className="nav-link cta-nav" onClick={(e) => { e.preventDefault(); onOpenContact(); setNavOpen(false); }}>
            Connect With Us
          </a>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle navigation"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ transform: navOpen ? "rotate(45deg) translateY(12px)" : "" }} />
          <span style={{ opacity: navOpen ? 0 : 1 }} />
          <span style={{ transform: navOpen ? "rotate(-45deg) translateY(-12px)" : "" }} />
        </button>
      </div>
    </nav>
  );
}

function Hero({ onOpenContact }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-fullscreen" id="home">
      <div className="hero-media">
        {HERO_SLIDES.map((src, i) => (
          <div
            key={i}
            className={`hero-slide${i === current ? " active" : ""}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="hero-gradient" />
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-content">
          <div className="hero-label">New Launch • Dubai Hills Estate</div>
          <h1 className="hero-title">
            <span className="title-line">GREENCREST</span>
            <span className="title-subtitle">at Dubai Hills Estate</span>
          </h1>
          <p className="hero-description">Where architectural excellence meets natural harmony</p>

          <div className="hero-stats">
            <div className="stat-item"><div className="stat-number">1, 2, 3</div><div className="stat-label">Bedrooms</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-number">AED 1.74M</div><div className="stat-label">Prices From</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-number">832 sqft</div><div className="stat-label">Area From</div></div>
            <div className="stat-divider" />
            <div className="stat-item"><div className="stat-number">43</div><div className="stat-label">Available Units</div></div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onOpenContact}>
              <span>Register Interest</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <button className="btn-secondary" onClick={() => scrollTo("concept")}>
              <span>Discover More</span>
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

function Concept() {
  return (
    <section className="split-section" id="concept">
      <div className="split-left sticky-section">
        <div className="split-image parallax-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80')" }} />
      </div>
      <div className="split-right">
        <div className="content-block" data-scroll>
          <span className="section-label">The Concept</span>
          <h2 className="section-title">A New Era of<br />Conscious Living</h2>
          <p className="section-text">The Greencrest represents a paradigm shift in residential architecture. Designed by award-winning architects, this development seamlessly integrates biophilic design principles with cutting-edge sustainability features.</p>
          <p className="section-text">Every element has been meticulously crafted to create an ecosystem where luxury and nature coexist in perfect harmony, offering residents a sanctuary that nurtures both body and soul.</p>

          <div className="feature-list">
            {[
              { icon: "🌱", title: "Sustainable Architecture", desc: "LEED Gold certified with solar integration" },
              { icon: "💎", title: "Premium Materials", desc: "Italian marble, German fittings, smart home tech" },
              { icon: "🏞️", title: "Vertical Gardens", desc: "Living walls and rooftop garden terraces" },
            ].map((f) => (
              <div className="feature-item" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-content">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResidenceCard({ res, onOpenContact, onOpenLightbox }) {
  return (
    <div className="residence-slide">
      <div className="residence-card glass-card">
        <div className="residence-image-wrapper">
          <img src={res.image} alt={res.tag} />
          <div className="residence-tag">{res.tag}</div>
          <button className="view-floor-btn" onClick={() => onOpenLightbox("floorplan", res.floorplanIndex)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" /></svg>
            View Living Spaces
          </button>
        </div>
        <div className="residence-details">
          <h3>{res.title}</h3>
          <div className="residence-specs">
            <div className="spec-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" /></svg>
              <span>{res.area}</span>
            </div>
            <div className="spec-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" /></svg>
              <span>{res.beds}</span>
            </div>
            <div className="spec-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" /><path d="M12 14v7m-3-4h6" stroke="currentColor" strokeWidth="2" /></svg>
              <span>{res.baths}</span>
            </div>
          </div>
          <div className="residence-price">{res.price}</div>
          <button className="btn-link" onClick={onOpenContact}>Inquire Now →</button>
        </div>
      </div>
    </div>
  );
}

function Residences({ onOpenContact, onOpenLightbox }) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);

  const move = (dir) => {
    const next = (idx + dir + RESIDENCES.length) % RESIDENCES.length;
    setIdx(next);
    if (!trackRef.current) return;
    const slides = trackRef.current.querySelectorAll(".residence-slide");
    if (!slides[next]) return;
    slides[next].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section className="residences-showcase" id="residences">
      <div className="container-wide">
        <div className="section-header-center" data-scroll>
          <span className="section-label">Residences</span>
          <h2 className="section-title">Curated Living Spaces</h2>
          <p className="section-subtitle">Each residence is a masterpiece of design and functionality</p>
        </div>

        <div className="residence-carousel">
          <div className="residence-track" ref={trackRef}>
            {RESIDENCES.map((res) => (
              <ResidenceCard key={res.tag} res={res} onOpenContact={onOpenContact} onOpenLightbox={onOpenLightbox} />
            ))}
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn prev" onClick={() => move(-1)} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <div className="carousel-dots">
              {RESIDENCES.map((_, i) => (
                <button key={i} className={`carousel-dot${i === idx ? " active" : ""}`} onClick={() => { setIdx(i); const slides = trackRef.current?.querySelectorAll(".residence-slide"); if (slides?.[i]) slides[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
            <button className="carousel-btn next" onClick={() => move(1)} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience-section" id="experience">
      <div className="experience-full-width">
        <div className="experience-bg-grid">
          {EXP_BG_IMAGES.map((src, i) => (
            <div key={i} className="grid-image" style={{ backgroundImage: `url('${src}')`, animationDelay: `${i * (i % 2 === 0 ? 2 : 1)}s` }} />
          ))}
        </div>

        <div className="experience-gradient" />

        <div className="experience-content-wrapper">
          <div className="container-wide">
            <div className="experience-content-grid">
              <div className="exp-header-side" data-scroll>
                <span className="section-label-white">The Experience</span>
                <h2 className="section-title-white">Elevated Lifestyle<br />Amenities</h2>
              </div>

              <div className="exp-content-side" data-scroll>
                <div className="exp-glass-panel">
                  <h3 className="exp-subtitle-white">DUBAI HILLS ESTATE</h3>
                  <h2 className="exp-main-title-white">The Green Heart of Dubai</h2>
                  <p className="exp-text-white">Dubai Hills Estate unfolds like a retreat, an escape into a blissful sanctuary. A place to unwind, recharge, and reconnect with nature. Framed by rolling greens and panoramic vistas, it is where wellness flows, movement thrives, and connections come to life.</p>
                  <p className="exp-text-white">Spanning over 11 million square meters, Dubai Hills Estate seamlessly weaves contemporary living into a lush, green tapestry. Often hailed as 'The Green Heart of Dubai' it offers a balance — moments from the city, yet worlds away in spirit.</p>
                  <ul className="exp-features-list-white">
                    {["2,700-acre Multi-purpose Development", "18-Hole Championship Golf Course", "1,450,000 sqm Parks & Open Spaces", "180,000 sqm Dubai Hills Park", "282,000 sqm Dubai Hills Mall", "3 Schools", "54 km Bicycle Route"].map((item) => (
                      <li key={item}><span className="feature-dot" />{item}</li>
                    ))}
                  </ul>
                  <div className="exp-amenities-tags">
                    {["Dubai Hills Golf Club", "Dubai Hills Park", "Kids' Play Area"].map((tag) => (
                      <span key={tag} className="amenity-badge">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery({ onOpenLightbox }) {
  return (
    <section className="gallery-section" id="gallery">
      <div className="container-wide">
        <div className="section-header-center" data-scroll>
          <span className="section-label">Gallery</span>
          <h2 className="section-title">Visual Journey</h2>
        </div>

        <div className="masonry-grid" data-scroll>
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className={`masonry-item${img.wide ? " wide" : ""}`} onClick={() => onOpenLightbox("gallery", i)}>
              <img src={img.src} alt={img.caption} />
              <div className="masonry-overlay"><span>{img.caption}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section className="location-section" id="location">
      <div className="container-wide">
        <div className="section-header-center" data-scroll>
          <span className="section-label">Location</span>
          <h2 className="section-title">Perfectly Connected</h2>
          <p className="section-subtitle">In the heart of Dubai, yet surrounded by nature</p>
        </div>

        <div className="location-split">
          <div className="location-map-container" data-scroll>
            <iframe
              title="Greencrest by Emaar Location"
              src="https://www.google.com/maps?q=Greencrest%20by%20Emaar%20Dubai&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="location-info" data-scroll>
            <div className="proximity-list">
              {PROXIMITY.map((p) => (
                <div className="proximity-item" key={p.title}>
                  <div className="proximity-icon">{p.icon}</div>
                  <div className="proximity-details">
                    <h4>{p.title}</h4>
                    <p>{p.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="location-stats">
              {[
                { number: "1, 2, 3", label: "Bedrooms" },
                { number: "AED 1.74M", label: "Prices From" },
                { number: "832 sqft", label: "Area From" },
                { number: "43", label: "Available Units" },
              ].map((s) => (
                <div className="location-stat-item" key={s.label}>
                  <div className="location-stat-number">{s.number}</div>
                  <div className="location-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpenContact }) {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="cta-content-center" data-scroll>
          <h2>Begin Your Journey at<br />Greencrest</h2>
          <p>Limited units available. Register now for exclusive pre-launch benefits</p>
          <button className="btn-primary large" onClick={onOpenContact}>
            <span>Schedule Private Tour</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function FooterColumn({ col }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="footer-column">
      <div className={`footer-column-header${open ? " active" : ""}`} onClick={() => setOpen((v) => !v)}>
        <h4>{col.title}</h4>
        <svg className={`footer-chevron${open ? " open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <ul className={`footer-column-content${open ? " open" : ""}`}>
        {col.links.map((link) => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}

const MARQUEE_ITEMS = ["Dubai Hills Estate", "Downtown Dubai", "Dubai Creek Harbour", "Emaar Beachfront", "The Valley", "Arabian Ranches", "Dubai Marina", "The Oasis"];

function Footer() {
  return (
    <footer className="footer-comprehensive">

      {/* Marquee strip */}
      <div className="footer-marquee-wrap" aria-hidden="true">
        <div className="footer-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="footer-marquee-item">
              <span className="footer-marquee-dot">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container-wide">

        {/* Brand + social header */}
        <div className="footer-header-row">
          <div className="footer-brand-block">
            <img
              src="https://properties.emaar.com/static/images/emaar-logo.svg"
              alt="Emaar Properties"
              className="footer-logo"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
            />
            <h3 className="footer-logo-text" style={{ display: "none" }}>EMAAR</h3>
            <p className="footer-tagline">Building Communities for Life</p>
          </div>

          <div className="footer-social-block">
            <span className="footer-social-label">Follow Us</span>
            <div className="footer-social">
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map(({ label, path }) => (
                <a key={label} href="#" aria-label={label} className="footer-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Accordion columns */}
        <div className="footer-main">
          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn key={col.title} col={col} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 Emaar Properties PJSC. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Asset Usage Policy</a>
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

function ContactModal({ isOpen, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Our team will contact you within 24 hours with personalized information about The Greencrest.");
    onClose();
    e.target.reset();
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal active" id="contactModal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className="modal-content contact-content">
          <div className="modal-header contact-header">
            <span className="contact-kicker">Private Consultation</span>
            <h2>Let's Connect</h2>
            <p>Our team will reach out within 24 hours with personalized information</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid contact-grid">
              <label className="contact-field">
                <span>Full Name</span>
                <input type="text" name="name" placeholder="Enter your full name" required />
              </label>
              <label className="contact-field">
                <span>Email Address</span>
                <input type="email" name="email" placeholder="name@example.com" required />
              </label>
              <label className="contact-field">
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+971 50 000 0000" required />
              </label>
              <label className="contact-field">
                <span>Interest</span>
                <select name="interest" required defaultValue="">
                  <option value="" disabled>Select your interest</option>
                  <option value="1br">1 Bedroom</option>
                  <option value="2br">2 Bedroom</option>
                  <option value="3br">3 Bedroom</option>
                  <option value="investment">Investment Opportunity</option>
                  <option value="tour">Private Tour</option>
                </select>
              </label>
            </div>
            <label className="contact-field contact-field-full">
              <span>Message</span>
              <textarea name="message" rows="4" placeholder="Tell us what you’re looking for" />
            </label>
            <button type="submit" className="btn-primary full-width"><span>Submit</span></button>
            <p className="form-note">By submitting, you agree to our privacy policy and to be contacted about Greencrest.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

function WelcomeModal({ isOpen, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Welcome! You're now registered for exclusive pre-launch offers. Check your email for more details.");
    onClose();
    e.target.reset();
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal welcome-modal active" id="welcomeModal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container welcome-container">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className="welcome-content">
          <div className="welcome-visual">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" alt="Greencrest" />
          </div>
          <div className="welcome-text">
            <span className="welcome-kicker">Priority Access Registration</span>
            <h2>Welcome to Greencrest</h2>
            <p>Register now for exclusive pre-launch offers and priority unit selection</p>
            <form className="welcome-form" onSubmit={handleSubmit}>
              <label className="welcome-field">
                <span>Full Name</span>
                <input type="text" name="name" placeholder="Enter your full name" required />
              </label>
              <label className="welcome-field">
                <span>Email Address</span>
                <input type="email" name="email" placeholder="name@example.com" required />
              </label>
              <label className="welcome-field">
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+971 50 000 0000" required />
              </label>
              <button type="submit" className="btn-primary full-width"><span>Get Early Access</span></button>
            </form>
            <p className="form-note">Limited time offer for first 100 registrants</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ isOpen, section, index, onClose, onChange }) {
  const images = section ? LIGHTBOX_DATA[section] : [];
  const current = images[index] || {};

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") onChange(-1);
      if (e.key === "ArrowRight") onChange(1);
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onChange, onClose]);

  // Touch swipe
  const touchStart = useRef(0);
  const onTouchStart = (e) => { touchStart.current = e.changedTouches[0].screenX; };
  const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].screenX - touchStart.current;
    if (diff > 50) onChange(-1);
    else if (diff < -50) onChange(1);
  };

  if (!isOpen) return null;

  return (
    <div className="lightbox-premium active" id="lightbox" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="lightbox-backdrop" onClick={onClose} />
      <button className="lightbox-close" onClick={onClose}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <button className="lightbox-nav prev" onClick={() => onChange(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <button className="lightbox-nav next" onClick={() => onChange(1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <div className="lightbox-content">
        <img id="lightboxImage" src={current.src} alt={current.alt || ""} />
        <div className="lightbox-info">
          <div className="lightbox-caption">{current.alt}</div>
          <div className="lightbox-counter">{index + 1} / {images.length}</div>
        </div>
      </div>
    </div>
  );
}

function FABs({ onOpenContact }) {
  return (
    <>
      <div className="contact-fab" onClick={onOpenContact}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </div>
      <div className="whatsapp-fab">
        <a href="https://wa.me/3232432424" target="_blank" rel="noreferrer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        </a>
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, section: "", index: 0 });

  useScrollAnimation();

  // Show welcome modal after 2 seconds
  useEffect(() => {
    const id = setTimeout(() => setWelcomeOpen(true), 2000);
    return () => clearTimeout(id);
  }, []);

  const openLightbox = useCallback((section, index) => {
    setLightbox({ open: true, section, index });
  }, []);

  const changeLightbox = useCallback((dir) => {
    setLightbox((lb) => {
      const images = LIGHTBOX_DATA[lb.section] || [];
      return { ...lb, index: (lb.index + dir + images.length) % images.length };
    });
  }, []);

  return (
    <>
      <CursorFollower />
      <Nav onOpenContact={() => setContactOpen(true)} />
      <Hero onOpenContact={() => setContactOpen(true)} />
      <Concept />
      <Residences onOpenContact={() => setContactOpen(true)} onOpenLightbox={openLightbox} />
      <Experience />
      <Gallery onOpenLightbox={openLightbox} />
      <Location />
      <FinalCTA onOpenContact={() => setContactOpen(true)} />
      <Footer />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <WelcomeModal isOpen={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
      <Lightbox
        isOpen={lightbox.open}
        section={lightbox.section}
        index={lightbox.index}
        onClose={() => setLightbox((lb) => ({ ...lb, open: false }))}
        onChange={changeLightbox}
      />
      <FABs onOpenContact={() => setContactOpen(true)} />
    </>
  );
}
