import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { HeroSlide } from '@/models/HeroSlide';
import { BrandPartner } from '@/models/BrandPartner';
import { Event } from '@/models/Event';
import { MediaItem } from '@/models/MediaItem';
import { Settings } from '@/models/Settings';
import { JobPosting } from '@/models/JobPosting';
import type { HeroSlide as HeroSlideData, BrandItem, WeekdayEvent, PastEvent, GalleryItem } from '@/components/rinwa/data';
import { heroSlides, brandPartners, weekdayEvents, pastEvents, galleryItems } from '@/components/rinwa/data';

async function main() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      HeroSlide.deleteMany({}),
      BrandPartner.deleteMany({}),
      Event.deleteMany({}),
      MediaItem.deleteMany({}),
      Settings.deleteMany({}),
      JobPosting.deleteMany({}),
    ]);

    // Create admin users
    console.log('Creating admin users...');
    const adminUsers = [
      {
        email: process.env.ADMIN_EMAIL || 'admin@rinwahospitality.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        name: 'RÌNWÁ Admin',
        role: 'admin' as const,
      },
      {
        email: 'rinwahospitality@gmail.com',
        password: 'Password#12',
        name: 'RÌNWÁ Hospitality Admin',
        role: 'admin' as const,
      },
    ];

    const uniqueAdminUsers = adminUsers.filter(
      (user, index, self) => index === self.findIndex((candidate) => candidate.email.toLowerCase() === user.email.toLowerCase())
    );

    await User.create(uniqueAdminUsers);
    console.log(`✓ ${uniqueAdminUsers.length} admin user(s) created`);

    // Seed Hero Slides
    console.log('Seeding hero slides...');
    const heroSlidesData = (heroSlides as HeroSlideData[]).map((slide, index) => ({
      imageUrl: slide.type === 'video' ? slide.poster : slide.src,
      videoUrl: slide.type === 'video' ? slide.src : undefined,
      title: slide.headline,
      description: slide.alt,
      order: index,
      isActive: true,
    }));
    await HeroSlide.insertMany(heroSlidesData);
    console.log(`✓ ${heroSlidesData.length} hero slides created`);

    // Seed Brand Partners
    console.log('Seeding brand partners...');
    const partnersData = (brandPartners as BrandItem[]).map((partner, index) => {
      const regionMap: Record<string, 'Lagos' | 'Canada' | 'Hospitality' | 'Other'> = {
        'Lagos': 'Lagos',
        'Canada': 'Canada',
        'Hospitality': 'Hospitality',
        'Experiences': 'Other',
      };
      return {
        name: partner.label,
        logoUrl: `https://via.placeholder.com/200?text=${encodeURIComponent(partner.label)}`,
        region: regionMap[partner.region] || 'Other',
        order: index,
        isActive: true,
      };
    });
    await BrandPartner.insertMany(partnersData);
    console.log(`✓ ${partnersData.length} brand partners created`);

    // Seed Events (from pastEvents as archived events)
    console.log('Seeding events...');
    const typeMap: Record<string, 'Dining' | 'Community' | 'Nightlife' | 'Creative' | 'Wellness'> = {
      'Hospitality / Dining': 'Dining',
      'Community': 'Community',
      'Nightlife': 'Nightlife',
      'Creative Strategy': 'Creative',
      'Gathering': 'Community',
    };
    const eventsData = (pastEvents as PastEvent[]).map((event, index) => ({
      name: event.title,
      description: event.category,
      city: 'Lagos' as const,
      weekday: 'Wednesday' as const,
      date: 'Upcoming',
      time: '6pm - 9pm',
      location: 'RÌNWÁ Venue',
      rsvpLink: 'https://example.com/rsvp',
      imageUrl: event.src,
      eventType: typeMap[event.category] || 'Dining',
      isFeatured: index === 0,
      isPast: true,
      order: index,
    }));
    await Event.insertMany(eventsData);
    console.log(`✓ ${eventsData.length} events created`);

    // Seed Media Items
    console.log('Seeding media items...');
    const mediaData = (galleryItems as GalleryItem[]).map((item, index) => ({
      imageUrl: item.src,
      caption: item.caption,
      order: index,
      isActive: true,
    }));
    await MediaItem.insertMany(mediaData);
    console.log(`✓ ${mediaData.length} media items created`);

    // Seed Job Postings
    console.log('Seeding job postings...');
    const jobPostings = [
      {
        title: 'Content Creator & Visual Storyteller',
        company: 'RÌNWÁ Hospitality & Experiences Ltd.',
        location: 'Lagos, Nigeria',
        type: 'Contract / Part-Time / Retainer',
        overview:
          'RÌNWÁ is a diaspora hospitality and experience design company operating across the Canada–Nigeria market. We create culturally intelligent experiences, storytelling, and environments that connect people to home, culture, community, and ease. We\'re looking for a Content Creator & Visual Storyteller to help capture and shape the visual world of the brand across hospitality, tourism, wellness, and cultural experiences.',
        responsibilities: [
          'Create short-form content for Instagram, TikTok, and LinkedIn',
          'Capture experiences, events, behind-the-scenes moments, and founder-led storytelling',
          'Edit reels and visual content aligned with the RÌNWÁ aesthetic',
          'Support campaign shoots and content production',
          'Translate Lagos, culture, and hospitality into compelling digital storytelling',
          'Maintain strong visual consistency across platforms',
        ],
        requirements: [
          '2–5+ years creating digital or brand content',
          'Strong eye for storytelling, aesthetics, and internet culture',
          'Skilled in shooting and editing mobile-first content',
          'Understands luxury, hospitality, culture, and experiential brands',
          'Highly proactive, collaborative, and creative',
          'Based in Lagos and available for on-site shoots/events',
        ],
        order: 0,
      },
      {
        title: 'Copywriter & Brand Storytelling Lead',
        company: 'RÌNWÁ Hospitality & Experiences Ltd.',
        location: 'Remote / Lagos',
        type: 'Full-time',
        overview:
          'We\'re looking for a strategic copywriter who can shape the voice of RÌNWÁ across digital platforms, campaigns, partnerships, and founder storytelling. This role is ideal for someone who understands modern brand building, emotional storytelling, and culturally intelligent communication.',
        responsibilities: [
          'Write copy for social media, campaigns, website, decks, and brand materials',
          'Develop storytelling concepts and content directions',
          'Support founder-led thought leadership and brand positioning',
          'Maintain a consistent brand voice across all touchpoints',
          'Translate experiences and cultural insights into compelling narratives',
        ],
        requirements: [
          'Strong portfolio in branding, editorial, or digital storytelling',
          'Deep understanding of culture, hospitality, and audience psychology',
          'Strong writing instincts across luxury, lifestyle, and community-led brands',
          'Able to balance emotional storytelling with strategic communication',
        ],
        order: 1,
      },
      {
        title: 'Graphic Designer & Brand Designer',
        company: 'RÌNWÁ Hospitality & Experiences Ltd.',
        location: 'Remote / Lagos',
        type: 'Full-time',
        overview:
          'RÌNWÁ is seeking a designer who can build visually refined, culturally intelligent, and emotionally resonant brand assets across digital, experiential, and hospitality touchpoints.',
        responsibilities: [
          'Design social assets, presentations, campaign visuals, and branded materials',
          'Support visual identity development and creative direction',
          'Create cohesive designs across digital and physical experiences',
          'Collaborate with content and strategy teams on campaigns and launches',
          'Help evolve the visual world of the brand',
        ],
        requirements: [
          'Strong portfolio in branding, hospitality, lifestyle, or culture-led design',
          'Strong typography and layout skills',
          'Experience designing for social and experiential campaigns',
          'Understands elevated, minimal, and emotionally-driven aesthetics',
          'Skilled in Adobe Creative Suite, Figma, or equivalent tools',
        ],
        order: 2,
      },
    ];
    await JobPosting.insertMany(jobPostings);
    console.log(`✓ ${jobPostings.length} job postings created`);

    // Create Settings
    console.log('Creating settings...');
    await Settings.create({
      partnershipEmail: process.env.ADMIN_EMAIL || 'rinwahospitality@gmail.com',
      tagline: 'Come here, you\'ve arrived home',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      joinTeamDescription:
        'As RÌNWÁ expands globally, we\'re building a team of thoughtful creatives, strategists, and cultural disruptors to help shape the future of culturally-driven hospitality and experiences.',
      joinTeamGoogleFormUrl: 'https://forms.gle/example',
    });
    console.log('✓ Settings created');

    console.log('\n✨ Seed completed successfully!');
    console.log(`\nLogin with:`);
    uniqueAdminUsers.forEach((adminUser) => {
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: ${adminUser.password}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
