// All site copy and media, carried over from the original wealthymindandbody.com.
// Edit text here, then run `npm run build` to regenerate the site in /docs.

export const site = {
  name: 'Wealthy Mind and Body',
  short: 'WMB',
  brand: 'Wealthy Mind and Body',
  domain: 'WealthyMindAndBody.com',
  url: 'https://wealthymindandbody.com',
  tagline: 'Elevate Your Mind. Empower Your Body. Awaken Your Soul.',
  positioning: 'Where Modern Wellness Meets Mind, Body & Soul Transformation.',
  // Optional: paste a form endpoint (e.g. Formspree / Mailchimp) to collect emails directly.
  // Leave empty and forms fall back to opening an email or WhatsApp message.
  formEndpoint: '',
  audience: 'Women 30+',
  audienceLine: 'Helping Women Rise Into Their Most Confident, Healthy and Aligned Selves.',
  // Paste the real store links here. Until then the Shop menu points to the shop page.
  shopifyUrl: '',
  digistoreUrl: '',
  owner: 'Letchance Ngassa',
  location: 'Dubai, UAE',
  locationNote:
    'Available for private classes or group classes at home, schools, corporates or hospitals',
  phone: '+971552807783',
  phoneDisplay: '(+971) 55 280 7783',
  whatsapp: '971552807783',
  emails: ['letchancengassa@gmail.com', 'info@mbm.tips'],
  description:
    'For women 30+: where modern wellness meets mind, body & soul transformation. Mindset mastery, mindful movement and soulful living with Letchance Ngassa — live daily, online worldwide and in person in Dubai. Mind and body wellness through movement, breathwork and coaching in Dubai, UAE. Mindset coaching, YogaFit, Hatha, Prenatal, Yin and Children’s Yoga — in person across the UAE and online worldwide.',
  about:
    'At our wellness center, we focus on holistic growth by combining mindset coaching with yoga sessions. Our approach is designed to enhance both flexibility and strength, promoting overall well-being and personal development.',
  social: [
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/leechance_ngassa/' },
    { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/c/LeeChanceYoga' },
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/chanceline.ngassa' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/lee-chance-yoga-8363981aa/' },
    { name: 'X (Twitter)', icon: 'x', url: 'https://twitter.com/LeeChance77' },
  ],
  youtube: {
    main: 'https://www.youtube.com/c/LeeChanceYoga',
    mindset: 'https://www.youtube.com/@Mindsetwith_leechance',
    kids: 'https://www.youtube.com/@leechancekidsyoga4170',
    daily: 'https://www.youtube.com/@Letchance_Ngassa/videos',
  },
  facebookAbout: 'https://www.facebook.com/leechance.ngassa/about',
  facebookShare: 'https://www.facebook.com/share/197TY5Ug8i/?mibextid=wwXIfr',
  introVideo: 'Ej4V2iTvoOc',
  // Homepage About section: this TikTok plays silently; clicking opens the YouTube video.
  aboutTikTok: '7687105797901372690',
  aboutYouTube: 'https://youtu.be/Ej4V2iTvoOc',
  empowerVideo: 'MDYtyErvpEY',
};

export const hero = {
  overline: 'Mind and Body Wellness Through Movement, Breathwork, and Coaching',
  slides: [
    {
      align: 'right', // text on the right so it doesn't cover the person in the photo
    title: 'Discover Balance Through Mindset & Movement',
      text: 'Our mindset coaching sessions help you develop a more resilient and positive outlook, enabling you to navigate life’s challenges with greater ease.',
      img: 'sunset-tree-pose',
      cta: { label: 'Read More', href: 'about/' },
    },
    {
      title: 'Empower your Mind and Body',
      text: 'Unleash your spirit, conquer challenges and embark on an exhilarating journey to a vibrant joyful life',
      img: 'skydive-palm',
      cta: { label: 'Watch the film', video: 'MDYtyErvpEY' },
    },
    {
      title: 'Stay Fit from a Young Age',
      text: 'Introduce your child to the benefits of yoga and set them on the path to a healthy, active life.',
      img: 'kids-beach-yoga',
      cta: { label: 'Read More', href: '#kids' },
    },
  ],
  tagline:
    'Achieve balance and well-being with our mind and body movements. Through practices like yoga and mindfulness, we help you strengthen your body, calm your mind, and boost overall health for a harmonious life.',
};

export const kids = {
  title: 'Stay Fit from a Young Age',
  text: 'Introduce your child to the benefits of yoga and set them on the path to a healthy, active life. Our children’s yoga classes are designed to improve flexibility, strength, and coordination while promoting mindfulness and emotional balance. Through fun and engaging activities, kids develop body awareness, boost focus, and reduce stress, all while staying fit. Help your child build a strong foundation for physical and mental well-being from a young age with our playful and nurturing yoga practice.',
};

export const aboutMBM = {
  title: 'About Wealthy Mind and Body',
  text: 'Our approach is combining mindset coaching with yoga sessions to promote overall well-being and personal development.',
  missionLabel: 'Our Mission Statement',
  mission: 'Empower our Mind and Body',
  belief:
    'At Wealthy Mind and Body, we believe in the transformative power of body movement and self-discovery to unlock your potential and elevate your well-being.',
  wellness:
    'At Wealthy Mind and Body, we believe that true wellness is not just about physical health, but a harmonious balance of the mind, body, and spirit. Our dedicated team is committed to guiding you on a transformative journey towards optimal well-being.',
  approachTitle: 'Our Holistic Approach',
  approach:
    'Our holistic approach blends mindful practices, physical movements, breathing techniques, mindset coaching, and emotional well-being to harmonize your inner self with your outer world. Embrace a journey of balance, vitality, and empowerment for a healthier, happier you',
  pillars: [
    {
      title: 'Personalized Services',
      img: 'dancer-sky',
      text: 'Our highly trained practitioners work closely with each client to develop tailored wellness plans that address their unique needs. Whether you’re seeking relief from stress, pain management, or a deeper sense of mindfulness, we have the expertise to support you every step of the way.',
    },
    {
      title: 'Transformative Workshops',
      img: 'workshop-evening',
      text: 'Immerse yourself in our transformative workshops, where you’ll have the opportunity to explore various practices, from meditation and yoga to nutrition and self-care. These enriching experiences will empower you to cultivate lasting changes in your life.',
    },
    {
      title: 'Rejuvenating Retreats',
      img: 'retreat-heart-sunset',
      text: 'Escape the demands of everyday life and join us on one of our rejuvenating wellness retreats. Surrounded by serene natural landscapes, you’ll have the chance to recharge, reconnect, and rediscover your inner harmony.',
    },
  ],
  closing: 'Embrace Your Wellness Journey',
  closingImg: 'workshop-nutrition',
};

export const offer = {
  eyebrow: 'What we offer',
  title: 'Experience the most transformative services',
  text: 'Unlock the full potential of your mind and body with our services. Book today, and you’ll be thanking yourself—now and in the days to come!',
  items: [
    {
      icon: 'coachMind',
      title: 'Mindset & Wellness Coaching',
      text: 'Work with your conscious and subconscious mind to break through limiting beliefs, build confidence and a growth mindset. We integrate mind, body and spirit with personalized guidance on lifestyle, nutrition, stress management and personal growth.',
    },
    {
      icon: 'movePose',
      title: 'Mind & Body Movement Sequences',
      text: 'Yoga and fitness combined to strengthen the body and improve flexibility: Hatha, Yin, Prenatal, Vinyasa, Stretching, Calisthenics, Wall Pilates and Children’s Yoga.',
    },
    {
      icon: 'lungs',
      title: 'Breathwork',
      text: 'Guided breathing, mindfulness meditation and chakra and energy work that improve focus, reduce stress, enhance lung capacity, balance emotions, regulate the nervous system and restore inner peace.',
    },
    {
      icon: 'easel',
      title: 'Workshops, Trainings, Seminars & Events',
      text: 'Interactive workshops, trainings, seminars and wellness events that inspire growth, teach practical skills and share valuable insights in a supportive environment, for schools, corporates and communities.',
    },
    {
      icon: 'people',
      title: 'Private & Group Sessions',
      text: 'Tailored one-on-one or group sessions wherever you are. We bring our expert coaching to the comfort of your home, school, corporate office, hospital, or even local parks, in person across the UAE and online around the world.',
    },
  ],
};

export const benefits = {
  title: 'Benefits of Wealthy Mind and Body',
  items: [
    { icon: 'stretch', title: 'Improve Flexibility & Strength' },
    { icon: 'clarity', title: 'Boost Mental Clarity' },
    { icon: 'bulb', title: 'Sharpen Memory & Creativity' },
    { icon: 'calm', title: 'Reduce Stress & Anxiety' },
    { icon: 'star', title: 'Self-Confidence' },
    { icon: 'link', title: 'Increase Mind & Body Connection' },
  ],
};

export const classes = {
  title: 'Our Classes',
  text: 'Explore a diverse range of mind and body movements classes designed to empower you on your wellness journey. From invigorating yoga sessions to transformative mindfulness practices. Each class is tailored to enhance your physical health and mental clarity. Join us today to cultivate balance strength and inner peace in a supportive community.',
  items: [
    {
      title: 'Mindset Coaching',
      days: 'Tuesdays – Saturdays',
      hours: '8:30 – 17:00',
      img: 'letchance-ngassa',
      text: 'At Wealthy Mind and Body, we empower individuals to shift their perspectives, overcome obstacles, and cultivate a positive mindset. Our tailored lessons combine proven strategies and personalized support to help you achieve your goals, boost resilience, and enhance overall well-being.',
    },
    {
      title: 'YogaFit For Everyone',
      days: '',
      hours: '8:30 – 17:00',
      img: 'yogafit-collage',
      text: 'Discover the perfect blend of strength, flexibility, and tranquility with our Yoga Fit lessons at Wealthy Mind and Body. This includes: Hatha Yoga for strength, Prenatal Yoga, Yin Yoga for deep flexibility, playful Children’s Yoga and Mindful Meditation to cultivate inner peace and clarity.',
    },
    {
      title: 'Private & Group Lessons',
      days: '',
      hours: '8:30 – 17:00',
      img: 'group-lessons',
      text: 'Experience the convenience of tailored private and group sessions wherever you are! At Wealthy Mind and Body, we bring our expert coaching to the comfort of your home, school, corporate office, hospital, or even local parks. Join us and enjoy the flexibility of learning and growing in your ideal environment!',
    },
  ],
};

export const features = {
  title: 'Our Features',
  quote:
    'The body is a living temple, where the mind shapes the vision, emotions bring it to life, the body holds it steady, and energy keeps it thriving. When they work in unison, the temple becomes a powerful force of balance and vitality.',
  img: 'stretch-mat',
  items: [
    {
      icon: 'mind',
      title: 'Mindset Coaching',
      text: 'Mindset coaching helps you break through limiting beliefs and develop a growth-focused mindset. Unlock your potential, build resilience, and achieve your goals with personalized guidance.',
    },
    {
      icon: 'meditate',
      title: 'Mindfulness Meditation',
      text: 'Mindfulness meditation helps you stay present, reduce stress, and improve emotional balance. It fosters clarity and a deeper connection to yourself and the world.',
    },
    {
      icon: 'lotus',
      title: 'Hatha Yoga',
      text: 'Hatha yoga focuses on balancing body and mind through physical postures and breathwork. It improves flexibility, strength, and promotes inner peace and relaxation.',
    },
  ],
};

export const practice = {
  title: 'Yoga is 99% practice and 1% theory',
  text: 'Yoga is not just a philosophy—it’s a journey. It’s through every movement, breath, and moment on the mat that you truly discover the power of yoga, unfolding a deeper connection to your mind, body, and spirit.',
  cta: 'Get Started',
};

export const services = {
  intro:
    'At Wealthy Mind and Body, we understand the importance of holistic wellness for individuals. Our mission is to provide a safe and nurturing space where you can explore and cultivate your mind-body connection.',
  items: [
    {
      title: 'Private and Group Sessions',
      img: 'prenatal-yoga',
      text: 'Whether you prefer personalized one-on-one mindset coaching or the motivation of group yoga and breathwork sessions, Wealthy Mind and Body offers holistic wellness programs designed to boost flexibility, relieve stress, and enhance mental clarity. Our expert-led online and in-person meditation and yoga classes cater to busy adults in the UAE seeking self-care, personal growth, and improved well-being.',
    },
    {
      title: 'Mind and Body Fit',
      img: 'family-yoga-park',
      text: 'Our Mind and Body Fit programs for families and children promote healthy movement, mindfulness, and emotional balance for all ages. Through fun and engaging children’s yoga, family-friendly breathwork, and mindset coaching, we support holistic wellness that nurtures flexibility, stress relief, and positive growth, available in person across the UAE and online around the world.',
    },
    {
      title: 'Mindset Coaching',
      img: 'mindset-event',
      text: 'Our Mindset Coaching programs empower individuals, families, and children to overcome limiting beliefs, build self-confidence, and cultivate a positive growth mindset. Combined with our children’s yoga and family-friendly breathwork, we offer holistic wellness solutions that promote mental clarity, emotional balance, and resilience, available in person across the UAE and online around the world.',
    },
  ],
  list: ['Mindset Coaching', 'Mindful Meditation', 'Hatha Yoga & Prenatal Yoga', 'Yin Yoga', 'Children Yoga'],
  solutionsTitle: 'Discover Our Wellness Solutions',
  solutions: [
    { title: 'Elevate Your Wellbeing with Our Digital Classes', cta: 'Join Now', href: 'shop/#digital', img: 'yoga-childs-pose' },
    { title: 'Unwind and Rejuvenate with Our In-Person Retreats', cta: 'Book Your Stay', href: 'booking/', img: 'retreat-roadtrip' },
    { title: 'Personalized Wellness Coaching for Your Transformation', cta: 'Schedule a Consultation', href: 'booking/', img: 'mindset-coaching-class' },
  ],
  youtube: 'Click the icon to subscribe to my YouTube channel for a minimum of 15 minutes daily Wealthy Mind and Body',
  youtubeImg: 'mindset-coaching-class',
  community: 'Empowering Your Wellness Journey',
};

export const booking = {
  title: 'Reservations',
  paragraphs: [
    'Discover the path to inner peace and physical harmony at Wealthy Mind and Body. Our wellness experts are dedicated to guiding you on a transformative journey, tailored to your unique needs.',
    'Whether you’re seeking rejuvenating treatments, restorative meditation, or empowering fitness classes, our holistic approach will help you achieve a deeper sense of balance and well-being. Let us be your trusted partners in nurturing your mind, body, and soul.',
    'Immerse yourself in a serene oasis of calm, where you can disconnect from the stresses of daily life and reconnect with your true self. Our inviting space and compassionate team are here to support you every step of the way on your wellness journey.',
  ],
  times: ['Morning', 'Afternoon', 'Evening'],
};

export const contactPage = {
  text: 'Join today to empower your mind and body. Visiting our website to book for appointment or shop. You can also contact us at',
};

export const faq = {
  title: 'Frequently Asked Questions',
  items: [
    {
      q: 'How can I book an appointment with Wealthy Mind and Body?',
      a: 'At Wealthy Mind and Body, we understand the importance of convenient and accessible wellness services. You can easily book an appointment online through our user-friendly platform. Simply visit our website, select the service you’re interested in, and choose a time that works best for you. Our team is here to guide you through the process and ensure your booking experience is seamless.',
    },
    {
      q: 'What types of digital products do you offer?',
      a: 'Wealthy Mind and Body is proud to offer a wide range of digital wellness products for our clients. From guided meditations and yoga sessions to nutritional plans and wellness workshops, we have something to support your holistic well-being. All of our digital products are accessible through a secure platform, allowing you to access them anytime, anywhere.',
    },
    {
      q: 'How can I purchase physical products from Wealthy Mind and Body?',
      a: 'Our physical product offerings include a carefully curated selection of wellness tools, supplements, and lifestyle items to enhance your daily routine. You can browse and purchase these products directly on our website. Once your order is placed, we’ll ensure it’s packaged with care and delivered to your doorstep. If you have any questions or need assistance with your purchase, our friendly customer service team is here to help.',
    },
  ],
  cta: 'Explore Our Services',
};

export const shop = {
  title: 'Great things are on the horizon',
  text: 'Something big is brewing! Our store is in the works and will be launching soon!',
  img: 'shop-collage',
  categories: [
    { id: 'ebooks', title: 'Ebooks', img: 'daily-quote-visualization' },
    { id: 'active-wear', title: 'Be Fit & Flex (Active Wear)', img: 'stretch-mat' },
    { id: 'wellness', title: 'Wellness Products', img: 'fresh-juices' },
    { id: 'digital', title: 'Digital Products', img: 'yoga-childs-pose' },
  ],
  digitalTitle: 'Welcome to Our Collection of Digital Products',
  products: [
    {
      name: 'Vitamin C Serum',
      category: 'wellness',
      price: 250,
      img: 'product-vitamin-c',
      text: 'Brighten your skin and reduce signs of aging with Vitamin C serum. Packed with antioxidants, it boosts collagen, evens skin tone, and protects against environmental damage for a radiant, youthful glow',
      more: 'For best results, apply a few drops of vitamin C serum to clean, dry skin in the morning, followed by sunscreen to enhance its protective benefits',
    },
    {
      name: 'Senna Tea',
      category: 'wellness',
      price: null,
      img: 'product-senna-tea',
      text: 'Enjoy the natural benefits of Senna Tea for gentle detox, improved digestion, and overall wellness. High-quality, organic blends. Sip your way to better health.',
    },
    {
      name: 'Selfie Monitor Screen',
      category: 'digital',
      price: 250,
      img: 'product-selfie-monitor',
      text: 'Shop high-quality selfie monitor screens for the perfect vlogs, photos, and videos. Enhance your content creation with crystal-clear displays and easy-to-use features.',
    },
  ],
};

export const privacy = [
  ['', 'This privacy policy describes how we collect, use, and protect your personal information when you use our website and services.'],
  ['1. Information We Collect', 'We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, mailing address, phone number, and payment information.'],
  ['2. How We Use Your Information', 'We use the information we collect to:', ['Process and fulfill your orders', 'Send you order confirmations and updates', 'Respond to your comments and questions', 'Improve our website and services', 'Send you marketing communications (with your consent)']],
  ['3. Information Sharing', 'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business, as long as those parties agree to keep this information confidential.'],
  ['4. Data Security', 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'],
  ['5. Your Rights', 'You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us.'],
  ['6. Cookies', 'We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, though this may affect the functionality of the site.'],
  ['7. Changes to This Policy', 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.'],
  ['8. Contact Us', 'If you have any questions about this Privacy Policy, please contact us.'],
];

// Blog posts. `body` is a list of blocks: ['p', text] | ['h', text] | ['img', name] | ['video', id]
export const posts = [
  {
    slug: 'mind-and-body-movements-10-minutes',
    title: '10 Minutes of Wealthy Mind and Bodys',
    date: '2025-07-26',
    type: 'Video',
    cover: 'video-mind-body-10min',
    excerpt: 'Check out this 10 minutes mind and body movements to feel relax.',
    body: [
      ['p', 'Check out this 10 minutes mind and body movements to feel relax.'],
      ['video', 'Ej4V2iTvoOc'],
    ],
  },
  {
    slug: 'visualization-for-growth-and-emotional-wellness',
    title: 'Daily Quote',
    date: '2025-07-26',
    type: 'Quote',
    cover: 'daily-quote-visualization',
    excerpt: 'Mental visualization of perfect health activates the flow of nerve impulses between your brain and body, forging a powerful connection for your well-being.',
    body: [['img', 'daily-quote-visualization', 'Mindset Quote: mental visualization of perfect health']],
  },
  {
    slug: 'embracing-the-art-of-mindful-living',
    title: 'Embracing the Art of Mindful Living',
    date: '2024-10-04',
    type: 'Article',
    cover: 'yoga-pose-blue',
    body: [
      ['p', 'At Wealthy Mind and Body, we understand that your wellness is a journey, not a destination. Our goal is to provide a welcoming and nurturing space where you can reconnect with yourself, find balance, and cultivate a deeper sense of peace and well-being.'],
      ['img', 'yoga-pose-blue'],
      ['h', 'Unlock the Power of Holistic Wellness'],
      ['p', 'Whether you’re seeking to alleviate stress, improve your physical fitness, or simply find a moment of calm amidst the hustle and bustle of daily life, our range of holistic services and programs are designed to cater to your unique needs. From yoga and meditation classes to personalized coaching and wellness workshops, we’re here to guide you every step of the way.'],
      ['img', 'chancy-yoga-garden'],
      ['h', 'Discover Your Path to Mindful Living'],
      ['p', 'At Wealthy Mind and Body, we believe that true wellness is not just about physical health, but also about nourishing the mind and spirit. Our experienced practitioners are dedicated to helping you cultivate a deeper understanding of yourself, explore new perspectives, and unlock the transformative power of mindful living.'],
      ['img', 'healthy-plate'],
      ['h', 'Invest in Your Well-being Today'],
      ['p', 'Take the first step towards a more balanced, fulfilling life. Explore our range of memberships, packages, and one-time services, and find the perfect fit to support your wellness journey. Whether you’re looking to establish a regular practice or seeking a tailored program, our team is here to ensure your experience is truly transformative.'],
      ['img', 'retreat-roadtrip'],
    ],
  },
  {
    slug: 'unlocking-the-secrets-of-holistic-wellness',
    title: 'Unlocking the Secrets of Holistic Wellness',
    date: '2024-10-04',
    type: 'Article',
    cover: 'foot-massage',
    body: [
      ['p', 'At Wealthy Mind and Body, we believe that true wellness encompasses the harmony of the mind, body, and spirit. Our holistic approach empowers individuals to embark on a transformative journey towards optimal well-being. Whether you’re seeking to alleviate stress, improve your physical fitness, or cultivate a deeper connection with yourself, our team of dedicated professionals is here to guide and support you every step of the way.'],
      ['img', 'foot-massage'],
      ['h', 'Embracing Mindful Movement'],
      ['p', 'At the heart of our wellness center lies the belief that movement can be a powerful tool for self-discovery and personal growth. We offer a diverse range of mindful movement practices, including yoga, Pilates, and tai chi, that are designed to help you achieve a state of balance, flexibility, and inner peace. Our experienced instructors will work closely with you to create a personalized program that caters to your unique needs and goals, ensuring that you embark on a journey of holistic transformation.'],
      ['img', 'nutrition-consult'],
      ['h', 'Nourishing the Body, Nurturing the Mind'],
      ['p', 'Alongside our mindful movement offerings, we prioritize the importance of nourishing the body and nurturing the mind. Our in-house nutritionists and wellness coaches are passionate about helping you develop sustainable, healthy habits that support your overall well-being. From curating personalized meal plans to guiding you through meditation and breathwork practices, we are committed to empowering you to make mindful choices that lead to a life of vitality and fulfillment.'],
      ['img', 'meal-plan'],
      ['h', 'Unleash Your Potential'],
      ['p', 'At Wealthy Mind and Body, we believe that everyone has the inherent potential to thrive. Whether you’re seeking to manage a specific health condition, improve your athletic performance, or simply cultivate a deeper sense of self-awareness, our team of experts is here to support you every step of the way. Through our personalized programs, tailored to your individual needs, we’re committed to helping you unlock your full potential and embark on a transformative journey towards optimal well-being.'],
      ['img', 'beach-surf'],
    ],
  },
  {
    slug: 'unlocking-your-potential-a-holistic-approach-to-wellness',
    title: 'Unlocking Your Potential: A Holistic Approach to Wellness',
    date: '2024-10-04',
    type: 'Article',
    cover: 'kids-yoga-park',
    body: [
      ['p', 'At Wealthy Mind and Body, we understand that your wellbeing is your top priority. Our compassionate team is dedicated to guiding you on your journey towards optimal health and happiness. Whether you’re seeking physical therapy, counseling, or holistic wellness services, we’re here to provide the support and resources you need to thrive.'],
      ['img', 'foot-massage'],
      ['h', 'Unlock Your Potential with Our Personalized Approach'],
      ['p', 'At Wealthy Mind and Body, we believe that every individual is unique, and their wellness needs are equally unique. That’s why we take a personalized approach to care, working closely with each client to develop a customized plan that addresses their specific goals and concerns. Our experienced practitioners are trained in a variety of modalities, from physical therapy and massage to meditation and nutritional counseling, ensuring that we can provide a comprehensive range of services to meet your needs.'],
      ['img', 'kids-yoga-park'],
      ['h', 'Embark on a Transformative Journey'],
      ['p', 'Whether you’re seeking relief from chronic pain, wanting to improve your athletic performance, or simply looking to enhance your overall wellbeing, Wealthy Mind and Body is here to help. Our holistic approach combines the latest evidence-based practices with a deep understanding of the mind-body connection, empowering you to achieve lasting, transformative results. With compassionate guidance and unwavering support, we’ll walk alongside you every step of the way, helping you unlock your full potential and live your best life.'],
      ['img', 'meal-plan'],
      ['h', 'Discover the Difference at Wealthy Mind and Body'],
      ['p', 'At Wealthy Mind and Body, we’re more than just a wellness center – we’re a community of caring practitioners and dedicated individuals committed to helping you thrive. From the moment you walk through our doors, you’ll feel the difference in our warm, welcoming atmosphere and our genuine concern for your wellbeing. Trust us to be your partners in health and wellness, as we work together to create a happier, healthier you.'],
      ['img', 'sunrise-run'],
    ],
  },
  {
    slug: 'unlocking-the-secrets-to-holistic-wellness',
    title: 'Unlocking the Secrets to Holistic Wellness',
    date: '2024-10-04',
    type: 'Article',
    cover: 'seedling-hands',
    body: [
      ['p', 'At Wealthy Mind and Body, we understand that your well-being is of utmost importance. Our holistic approach to wellness empowers you to embark on a transformative journey, nurturing both your physical and mental health. Whether you’re seeking to restore balance, unwind from the stresses of daily life, or embark on a path of self-discovery, we’re here to support you every step of the way.'],
      ['img', 'seedling-hands'],
      ['h', 'Unlock Your Wellness Potential'],
      ['p', 'At our wellness center, we offer a diverse range of services tailored to your unique needs. From rejuvenating massage therapies and soothing yoga sessions to mindfulness workshops and nutritional guidance, our team of experienced practitioners is dedicated to helping you achieve optimal well-being. Step into a space of tranquility and let us guide you towards a healthier, more vibrant you.'],
      ['img', 'yoga-childs-pose'],
      ['h', 'Nourish Your Mind and Body'],
      ['p', 'Maintaining a balanced lifestyle is crucial for your overall well-being. At Wealthy Mind and Body, we believe in the power of holistic living. Explore our selection of premium wellness products, from all-natural supplements to mindfulness tools, designed to support your journey towards a healthier, more fulfilling life. Discover the transformative power of integrating these essentials into your daily routine.'],
      ['img', 'fresh-juices'],
      ['h', 'Embark on a Journey of Self-Care'],
      ['p', 'Whether you’re seeking to book a rejuvenating treatment, inquire about our wellness programs, or simply learn more about our services, our dedicated team is here to assist you. Simply reach out to us, and we’ll be honored to support you in taking the next step towards a more balanced and enriched life. Remember, your well-being is our top priority, and we’re committed to helping you unlock your full potential.'],
      ['img', 'meditation-sunset'],
    ],
  },
];

/* ---------- New Wealthy Mind and Body homepage (from the brand brief) ---------- */
export const home = {
  hero: {
    overline: 'Where Modern Wellness Meets Mind, Body & Soul Transformation',
    title: 'Become the Woman You Were Created to Be',
    text: 'Supporting women in creating lasting transformation through mindset mastery, mindful movement, and soulful living.',
    img: 'meditation-sunset',
    primary: { label: 'Start Your Journey', href: 'booking/' },
    secondary: { label: 'Join Live Classes', href: '#live' },
  },
  pillars: [
    { key: 'Mind', emoji: '🧠', img: 'mindset-event', text: 'Develop confidence, resilience, emotional intelligence and a growth mindset.' },
    { key: 'Body', emoji: '💪', img: 'yoga-pose-blue', text: 'Strengthen your body through yoga, mobility, breathwork and intentional movement.' },
    { key: 'Breathwork', emoji: '🌬️', img: 'meditation-sunset', text: 'Calm your nervous system and find inner peace through mindfulness, meditation and guided breathing.' },
  ],
  meet: {
    eyebrow: 'Meet your coach',
    title: 'Letchance Ngassa',
    subtitle: 'Mindset & Wellness Coach, Mind & Body Movement Specialist',
    // TODO: replace with Letchance's own transformation story.
    story: [
      'I believe in the transformative power of body movement and self-discovery to unlock your potential and elevate your well-being. True wellness is not just about physical health, but a harmonious balance of the mind, body, and spirit.',
      'My approach combines mindset coaching with yoga, breathwork and mindful movement — so you can build confidence, find calm, and feel at home in your body again.',
    ],
    img: 'letchance-ngassa',
    cta: { label: 'Read My Story', href: 'about/' },
  },
  programs: [
    {
      title: 'Mindset & Wellness Coach',
      text: 'Transform limiting beliefs, build confidence and calm your nervous system.',
      points: ['Conscious mind', 'Subconscious mind', 'Nervous system'],
      img: 'mindset-event', icon: 'mind', service: 'Mindset Coaching',
    },
    {
      title: 'Mind & Body Movement',
      text: 'Daily movement sessions promoting strength, mobility and wellbeing.',
      points: ['Hatha Yoga', 'Yin Yoga', 'Prenatal Yoga', 'Vinyasa', 'Stretching', 'Calisthenics', 'Wall Pilates', 'Children Yoga', 'Nervous system regulation'],
      img: 'wheel-pose-benefits', icon: 'stretch', service: 'Mind & Body Movement Sequences',
    },
    {
      title: 'Breathwork',
      text: 'Guided breathing to calm the mind, restore energy and find inner peace.',
      points: ['Mindfulness practices', 'Meditation', 'Chakras', 'Energy', 'Nervous system regulation', 'Inner peace'],
      img: 'breathwork-prayers-meditation', icon: 'breath', service: 'Breathwork Sessions',
    },
  ],
  resources: {
    title: 'Free Resources',
    text: 'Simple, beautiful tools to begin your transformation today.',
    items: [
      { title: 'Morning Mindset Guide', icon: 'spark' },
      { title: 'Gratitude Journal', icon: 'leaf' },
      { title: 'Nervous System Reset Guide', icon: 'calm' },
      { title: '7-Day Wellness Challenge', icon: 'calendar' },
    ],
    cta: 'Get Free Resources',
  },
  live: {
    title: 'Join Me Live Every Evening',
    time: '5:00 PM – 5:30 PM',
    timezone: 'Asia/Dubai',
    startHour: 17,
    durationMin: 30,
    session: 'Mind & Body Movement with Letchance Ngassa',
    videos: [
      { id: 'Ej4V2iTvoOc', title: '30 Minutes of Full Body Stretching & Flexibility', cover: 'video-mind-body-10min' },
      { id: 'MDYtyErvpEY', title: 'Empower your Mind and Body', cover: 'video-empower' },
    ],
  },
  testimonials: [
    'I gained confidence, peace and energy.',
    'The daily movement sessions transformed my morning routine.',
    'I finally feel aligned in my mind, body and soul.',
  ],
  community: {
    title: 'You’re Not Meant to Do Life Alone',
    intro: 'Join the Wealthy Mind and Body membership, a supportive online wellness community for women 30+ in Dubai, the UAE and around the world. Members get live evening yoga and mind & body movement classes, mindset coaching, breathwork and meditation sessions, monthly wellness challenges and group coaching, with an accountability community that helps you build healthy habits, reduce stress, gain confidence and feel aligned in your mind and body.',
    items: ['Exclusive classes', 'Monthly challenges', 'Group coaching', 'Accountability community'],
    cta: 'Join the Community',
    img: 'group-lessons',
  },
  email: {
    title: 'Begin Your Transformation Today',
    text: 'Join our wellness community and receive inspiration, tools and resources delivered to your inbox.',
    cta: 'Join Now',
  },
};

/* ---------- Homepage carousel (first section) ---------- */
// Same slides as the original site; the old logo slide is replaced by the pink brand slide.
export const slides = [
  {
    pink: true,
    overline: 'For Women 30+',
    title: 'Become the Woman You Were Created to Be',
    text: 'Supporting women in creating lasting transformation through mindset mastery, mindful movement, and soulful living.',
    note: 'Helping Women Rise Into Their Most Confident, Healthy and Aligned Selves.',
    img: 'be-fit-flex-tree-pose',
    primary: { label: 'Start Your Journey', href: 'booking/' },
    secondary: { label: 'Join Live Classes', href: '#live' },
  },
  {
    align: 'right', // text on the right so it doesn't cover the person in the photo
    title: 'Discover Balance Through Mindset & Movement',
    text: 'Our mindset coaching sessions help you develop a more resilient and positive outlook, enabling you to navigate life’s challenges with greater ease.',
    img: 'dubai-skyline-sunset-balance',
    primary: { label: 'Read More', href: 'about/' },
  },
  {
    title: 'Empower your Mind and Body',
    text: 'Unleash your spirit, conquer challenges and embark on an exhilarating journey to a vibrant joyful life',
    img: 'dream-big-skydive',
    valign: 'bottom', // full background; text sits low so the "Dream big" caption at the top stays clear
    imgAlt: 'Dream big, the sky is your limit! Letchance Ngassa skydiving over the Palm Jumeirah, Dubai',
    primary: { label: 'Read More', href: 'https://youtu.be/MDYtyErvpEY?si=YoP5vo47C2evWmIb' },
  },
  {
    title: 'Stay Fit from a Young Age',
    text: 'Introduce your child to the benefits of yoga and set them on the path to a healthy, active life. Our children’s yoga classes are designed to improve flexibility, strength, and coordination while promoting mindfulness and emotional balance.',
    img: 'kids-yoga-collage',
    framed: true, // whole collage shown in a frame on the army green background
    imgAlt: 'Collage of two children doing partner yoga poses in a Dubai park',
    primary: { label: 'Read More', href: 'https://www.youtube.com/@leechancekidsyoga4170' },
  },
];

/* ---------- Service menu (Services dropdown + Services page) ---------- */
export const serviceMenu = [
  {
    id: 'mindset-coaching', title: 'Mindset Coaching', img: 'letchance-ngassa', icon: 'mind',
    text: 'Mindset coaching helps you break through limiting beliefs and develop a growth-focused mindset. Unlock your potential, build resilience, and achieve your goals with personalized guidance.',
  },
  {
    id: 'movement-sequences', title: 'Mind & Body Movement Sequences', img: 'yogafit-collage', icon: 'stretch',
    text: 'Discover the perfect blend of strength, flexibility, and tranquility: Hatha Yoga, Yin Yoga, Prenatal Yoga, Vinyasa, Stretching, Calisthenics, Wall Pilates and playful Children’s Yoga.',
  },
  {
    id: 'breathwork', title: 'Breathwork Sessions', img: 'meditation-sunset', icon: 'breath',
    text: 'Guided breathing techniques improve focus, reduce stress, enhance lung capacity, balance emotions, detoxify the body, and boost overall well-being.',
  },
  {
    id: 'group-classes', title: 'Group Classes', img: 'group-lessons', icon: 'link',
    text: 'Enjoy the motivation of group yoga and breathwork sessions, at your school, corporate office, hospital, or even local parks, in person across the UAE and online around the world.',
  },
  {
    id: 'private-classes', title: 'Private Classes', img: 'prenatal-yoga', icon: 'star',
    text: 'Personalized one-on-one sessions tailored to your goals, brought to the comfort of your home or wherever you are.',
  },
];
