import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🐝 Seeding database...');

  // Create admin user via Better Auth API (requires server to be running)
  // For manual seeding, use: curl -X POST http://localhost:3000/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"email":"michael@costperdemo.com","password":"e120fleB!","name":"Admin"}'
  // Then update: UPDATE "User" SET "emailVerified" = true, "role" = 'ADMIN' WHERE email = 'michael@costperdemo.com';
  
  const adminEmail = 'michael@costperdemo.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', existingAdmin.email);
  } else {
    console.log('⚠️  Admin user not found.');
    console.log('To create admin user, run:');
    console.log('curl -X POST http://localhost:3000/api/auth/sign-up/email \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"email":"michael@costperdemo.com","password":"e120fleB!","name":"Admin"}\'');
    console.log('Then run this seed script again.');
  }

  // Create bees
  const socialBee = await prisma.bee.upsert({
    where: { slug: 'social-bee' },
    update: {
      name: 'Social Bee',
      tagline: 'Your 24/7 Social Media Manager',
      description:
        'Automates social media posting, engagement, and content creation across all platforms. Never miss a post or engagement opportunity again.',
      icon: '/socialbee.png',
      features: [
        'Create engaging content automatically',
        'Schedule posts across all platforms',
        'Engage with followers 24/7',
        'Track performance and analytics',
        'Multi-platform support (Instagram, Facebook, Twitter, LinkedIn)',
        'Content calendar management',
      ],
      priceMonthly: 299,
      isActive: true,
      sortOrder: 1,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
    create: {
      slug: 'social-bee',
      name: 'Social Bee',
      tagline: 'Your 24/7 Social Media Manager',
      description:
        'Automates social media posting, engagement, and content creation across all platforms. Never miss a post or engagement opportunity again.',
      icon: '/socialbee.png',
      features: [
        'Create engaging content automatically',
        'Schedule posts across all platforms',
        'Engage with followers 24/7',
        'Track performance and analytics',
        'Multi-platform support (Instagram, Facebook, Twitter, LinkedIn)',
        'Content calendar management',
      ],
      priceMonthly: 299,
      isActive: true,
      sortOrder: 1,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
  });

  const salesBee = await prisma.bee.upsert({
    where: { slug: 'sales-bee' },
    update: {
      name: 'Sales Bee',
      tagline: 'Your AI Sales Team',
      description:
        'Automates prospecting, personalized outreach, and meeting booking to fill your calendar with qualified leads.',
      icon: '/salesbee.png',
      features: [
        'Find and qualify ideal prospects',
        'Personalized multichannel outreach',
        'Automated follow-up sequences',
        'Book meetings automatically',
        'Track and optimize campaigns',
        'CRM integration',
      ],
      priceMonthly: 499,
      isActive: true,
      sortOrder: 2,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
    create: {
      slug: 'sales-bee',
      name: 'Sales Bee',
      tagline: 'Your AI Sales Team',
      description:
        'Automates prospecting, personalized outreach, and meeting booking to fill your calendar with qualified leads.',
      icon: '/salesbee.png',
      features: [
        'Find and qualify ideal prospects',
        'Personalized multichannel outreach',
        'Automated follow-up sequences',
        'Book meetings automatically',
        'Track and optimize campaigns',
        'CRM integration',
      ],
      priceMonthly: 499,
      isActive: true,
      sortOrder: 2,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
  });

  const bespokeBee = await prisma.bee.upsert({
    where: { slug: 'bespoke-bee' },
    update: {
      name: 'Bespoke Bee',
      tagline: 'Custom AI Solutions',
      description:
        "Tell us your unique workflow and we'll build a custom Bee tailored to your exact business needs. Your automation, your way.",
      icon: '/bespokebee.png',
      features: [
        'Fully customized automation',
        'Integrate with your existing tools',
        'Ongoing support and updates',
        'Dedicated success manager',
        'Flexible pricing based on complexity',
        'White-label options available',
      ],
      isActive: true,
      sortOrder: 3,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
    create: {
      slug: 'bespoke-bee',
      name: 'Bespoke Bee',
      tagline: 'Custom AI Solutions',
      description:
        "Tell us your unique workflow and we'll build a custom Bee tailored to your exact business needs. Your automation, your way.",
      icon: '/bespokebee.png',
      features: [
        'Fully customized automation',
        'Integrate with your existing tools',
        'Ongoing support and updates',
        'Dedicated success manager',
        'Flexible pricing based on complexity',
        'White-label options available',
      ],
      isActive: true,
      sortOrder: 3,
      ctaCalLink: process.env.NEXT_PUBLIC_CALCOM_LINK,
    },
  });

  console.log('✅ Created bees:', {
    socialBee: socialBee.name,
    salesBee: salesBee.name,
    bespokeBee: bespokeBee.name,
  });

  // Create testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        author: 'Sarah Johnson',
        role: 'Founder',
        company: 'FitLife Studios',
        quote:
          'Social Bee transformed our social media presence. We went from sporadic posts to consistent, engaging content that actually converts. Our bookings increased 40% in just 2 months!',
        rating: 5,
        beeId: socialBee.id,
      },
      {
        author: 'Michael Chen',
        role: 'Sales Director',
        company: 'TechStart Solutions',
        quote:
          'Sales Bee is like having a team of SDRs working around the clock. Our outbound pipeline has never been fuller, and the quality of leads is exceptional.',
        rating: 5,
        beeId: salesBee.id,
      },
      {
        author: 'Emma Williams',
        role: 'Owner',
        company: 'Boutique Haven',
        quote:
          'I was skeptical about AI automation, but B2Bee made it so easy. Now I can focus on what I love - designing - while the bees handle the marketing.',
        rating: 5,
        beeId: socialBee.id,
      },
      {
        author: 'David Martinez',
        role: 'CEO',
        company: 'Growth Ventures',
        quote:
          'The bespoke solution B2Bee built for us was exactly what we needed. It integrates perfectly with our existing systems and saves us hours every day.',
        rating: 5,
        beeId: bespokeBee.id,
      },
      {
        author: 'Lisa Thompson',
        role: 'Marketing Manager',
        company: 'EcoGoods',
        quote:
          'Finally, marketing automation that actually works for small businesses. The ROI has been incredible - paid for itself in the first month.',
        rating: 5,
        beeId: socialBee.id,
      },
      {
        author: 'James Anderson',
        role: 'Founder',
        company: 'ConsultPro',
        quote:
          'Sales Bee books more qualified meetings than our previous two sales reps combined. Game changer for our consultancy.',
        rating: 5,
        beeId: salesBee.id,
      },
    ],
  });

  console.log('✅ Created testimonials');

  // Create ABM Pages
  const danielBeerPage = await prisma.aBMPage.upsert({
    where: { linkedinIdentifier: 'dbeer' },
    update: {
      linkedinUrl: 'https://www.linkedin.com/in/dbeer/',
      firstName: 'Daniel',
      lastName: 'Beer',
      title: 'Associate Director',
      company: 'The Store Room',
      targetMarket: 'Plumbers, Electricians and Carpenters',
      targetLocation: 'Solihull, United Kingdom',
      mockCompanies: [
        'ABC Plumbing & Heating Ltd',
        'Smith Electrical Services',
        'Elite Carpentry Solutions',
        'ProFix Plumbing',
        'Midlands Electric Co',
        'Premier Carpentry Works',
        'HomeFlow Plumbing',
        'Voltage Electrical Ltd',
      ],
      mockLeads: [
        {
          name: 'John Smith',
          company: 'ABC Plumbing & Heating Ltd',
          title: 'Owner & Director',
        },
        {
          name: 'Sarah Williams',
          company: 'Smith Electrical Services',
          title: 'Managing Director',
        },
        {
          name: 'Michael Johnson',
          company: 'Elite Carpentry Solutions',
          title: 'Founder',
        },
        {
          name: 'David Brown',
          company: 'ProFix Plumbing',
          title: 'Business Owner',
        },
        {
          name: 'Emma Davis',
          company: 'Midlands Electric Co',
          title: 'Director',
        },
        {
          name: 'James Wilson',
          company: 'Premier Carpentry Works',
          title: 'Owner',
        },
      ],
      mockAnalytics: {
        replies: 47,
        meetings: 12,
        openRate: 68,
        replyRate: 24,
      },
      heroMessage: null, // Will use default template
      benefitPoints: [
        'Fill storage units faster',
        'Target local tradesmen',
        'Automated outreach 24/7',
        'Qualified leads only',
      ],
      isActive: true,
    },
    create: {
      linkedinIdentifier: 'dbeer',
      linkedinUrl: 'https://www.linkedin.com/in/dbeer/',
      firstName: 'Daniel',
      lastName: 'Beer',
      title: 'Associate Director',
      company: 'The Store Room',
      targetMarket: 'Plumbers, Electricians and Carpenters',
      targetLocation: 'Solihull, United Kingdom',
      mockCompanies: [
        'ABC Plumbing & Heating Ltd',
        'Smith Electrical Services',
        'Elite Carpentry Solutions',
        'ProFix Plumbing',
        'Midlands Electric Co',
        'Premier Carpentry Works',
        'HomeFlow Plumbing',
        'Voltage Electrical Ltd',
      ],
      mockLeads: [
        {
          name: 'John Smith',
          company: 'ABC Plumbing & Heating Ltd',
          title: 'Owner & Director',
        },
        {
          name: 'Sarah Williams',
          company: 'Smith Electrical Services',
          title: 'Managing Director',
        },
        {
          name: 'Michael Johnson',
          company: 'Elite Carpentry Solutions',
          title: 'Founder',
        },
        {
          name: 'David Brown',
          company: 'ProFix Plumbing',
          title: 'Business Owner',
        },
        {
          name: 'Emma Davis',
          company: 'Midlands Electric Co',
          title: 'Director',
        },
        {
          name: 'James Wilson',
          company: 'Premier Carpentry Works',
          title: 'Owner',
        },
      ],
      mockAnalytics: {
        replies: 47,
        meetings: 12,
        openRate: 68,
        replyRate: 24,
      },
      heroMessage: null,
      benefitPoints: [
        'Fill storage units faster',
        'Target local tradesmen',
        'Automated outreach 24/7',
        'Qualified leads only',
      ],
      isActive: true,
    },
  });

  const michaelBeckettPage = await prisma.aBMPage.upsert({
    where: { linkedinIdentifier: 'mjcbeckett' },
    update: {
      linkedinUrl: 'https://www.linkedin.com/in/mjcbeckett/',
      firstName: 'Michael',
      lastName: 'Beckett',
      title: 'Founder & CEO',
      company: 'B2Bee',
      targetMarket: 'Small Business Owners and Entrepreneurs',
      targetLocation: 'United Kingdom',
      mockCompanies: [
        'Green Leaf Consulting',
        'Urban Kitchen Co',
        'FitPro Studios',
        'Digital Edge Marketing',
        'Artisan Coffee House',
        'TechStart Solutions',
        'Bloom Beauty Salon',
        'Peak Performance Coaching',
      ],
      mockLeads: [
        {
          name: 'Sophie Turner',
          company: 'Green Leaf Consulting',
          title: 'Founder',
        },
        {
          name: 'Oliver Hayes',
          company: 'Urban Kitchen Co',
          title: 'Owner & Head Chef',
        },
        {
          name: 'Emily Roberts',
          company: 'FitPro Studios',
          title: 'Managing Director',
        },
        {
          name: 'Lucas Bennett',
          company: 'Digital Edge Marketing',
          title: 'CEO',
        },
        {
          name: 'Isabella Clarke',
          company: 'Artisan Coffee House',
          title: 'Owner',
        },
        {
          name: 'Noah Phillips',
          company: 'TechStart Solutions',
          title: 'Founder & CTO',
        },
      ],
      mockAnalytics: {
        replies: 63,
        meetings: 18,
        openRate: 72,
        replyRate: 31,
      },
      heroMessage: null,
      benefitPoints: [
        'Scale without hiring',
        'Focus on what you do best',
        'Predictable growth',
        'AI-powered efficiency',
      ],
      isActive: true,
    },
    create: {
      linkedinIdentifier: 'mjcbeckett',
      linkedinUrl: 'https://www.linkedin.com/in/mjcbeckett/',
      firstName: 'Michael',
      lastName: 'Beckett',
      title: 'Founder & CEO',
      company: 'B2Bee',
      targetMarket: 'Small Business Owners and Entrepreneurs',
      targetLocation: 'United Kingdom',
      mockCompanies: [
        'Green Leaf Consulting',
        'Urban Kitchen Co',
        'FitPro Studios',
        'Digital Edge Marketing',
        'Artisan Coffee House',
        'TechStart Solutions',
        'Bloom Beauty Salon',
        'Peak Performance Coaching',
      ],
      mockLeads: [
        {
          name: 'Sophie Turner',
          company: 'Green Leaf Consulting',
          title: 'Founder',
        },
        {
          name: 'Oliver Hayes',
          company: 'Urban Kitchen Co',
          title: 'Owner & Head Chef',
        },
        {
          name: 'Emily Roberts',
          company: 'FitPro Studios',
          title: 'Managing Director',
        },
        {
          name: 'Lucas Bennett',
          company: 'Digital Edge Marketing',
          title: 'CEO',
        },
        {
          name: 'Isabella Clarke',
          company: 'Artisan Coffee House',
          title: 'Owner',
        },
        {
          name: 'Noah Phillips',
          company: 'TechStart Solutions',
          title: 'Founder & CTO',
        },
      ],
      mockAnalytics: {
        replies: 63,
        meetings: 18,
        openRate: 72,
        replyRate: 31,
      },
      heroMessage: null,
      benefitPoints: [
        'Scale without hiring',
        'Focus on what you do best',
        'Predictable growth',
        'AI-powered efficiency',
      ],
      isActive: true,
    },
  });

  console.log('✅ Created ABM pages:', {
    danielBeer: `${danielBeerPage.firstName} ${danielBeerPage.lastName}`,
    michaelBeckett: `${michaelBeckettPage.firstName} ${michaelBeckettPage.lastName}`,
  });

  console.log('🎉 Database seeded successfully!');

  // Create initial boat fund contributions
  console.log('⛵ Creating boat fund contributions...');
  
  const boatContributions = [
    { amount: 50000, description: 'Initial seed money' }, // £500
    { amount: 125000, description: 'Social Bee monthly commission' }, // £1,250
    { amount: 75000, description: 'Sales Bee setup fee' }, // £750
    { amount: 20000, description: 'Bespoke Bee consultation' }, // £200
  ];

  for (const contribution of boatContributions) {
    await prisma.boatFundContribution.create({
      data: contribution,
    });
  }

  console.log('✅ Boat fund seeded with', boatContributions.length, 'contributions');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

