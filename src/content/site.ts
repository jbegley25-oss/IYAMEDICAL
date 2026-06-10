export const siteConfig = {
  name: 'IYA Medical',
  title: 'IYA Medical',
  description:
    "IYA Medical is Scottsdale's leading multi-specialty practice offering interventional radiology, neurology, and primary care.",
  longDescription:
    "IYA Medical offers comprehensive care across interventional radiology, neurology, internal medicine, and dermatology. Our board-certified physicians use state-of-the-art minimally invasive techniques for faster recovery and better outcomes.",
  url: 'https://iyamedical.com',

  // Contact
  phone: '480-771-0000',
  phoneHref: 'tel:+14807710000',
  fax: '',
  mobile: '',
  email: 'scheduling@iyamedical.com',

  // Social
  social: {
    youtube: 'https://www.youtube.com/@iyamedical',
  },

  // Office Hours
  hours: {
    weekday: 'Monday - Friday: 8:00 AM - 5:00 PM',
    saturday: 'Saturday: 9:00 AM - 2:00 PM',
    sunday: 'Sunday: Closed',
  },

  // Main Address
  mainAddress: {
    street: '9201 E. Mountain View Rd., Suite 130',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85258',
  },

  // Assets
  logo: '/images/iya-medical-logo-blue.png',
  favicon: '/images/iya-medical-logo-blue-logo.png',

  // Hero rotating text
  heroTexts: [
    "Compassionate Care from Arizona's Leading Interventional Radiology Team",
    'Your Health, Our Mission -- Advanced Minimally Invasive Solutions',
    'Board-Certified Experts Dedicated to Your Recovery and Wellbeing',
    'Personalized Treatment Plans for Every Patient, Every Condition',
    'Where Medical Excellence Meets Genuine Compassion',
    'Helping Patients Live Healthier, Happier Lives Through Innovation',
    'Trusted by Thousands of Families Across Arizona',
    'State-of-the-Art Care with a Personal Touch',
    'Pioneering Treatments That Get You Back to Living',
    'Your Partners in Health -- From Diagnosis to Recovery',
    'Experienced Physicians, Life-Changing Results',
    'Advanced Medical Care, Exceptional Patient Experience',
    'Dedicated to Improving Lives Through Cutting-Edge Medicine',
    'Where Patients Come First, Always',
    'Expert Care for Complex Conditions, Delivered with Compassion',
  ],

  // Section headings
  sections: {
    about: {
      title: 'About Us',
      description:
        "IYA Medical's Program of Vascular and Interventional Radiology (IR)",
    },
    benefits: {
      title: 'Our Benefits',
      description:
        'Experienced and certified doctors, Modern medical equipment, Comprehensive healthcare solutions',
    },
    contact: {
      title: 'Contact Us',
      description: 'Contact our team for personalized care and appointments',
    },
    doctor: {
      title: 'Our Doctor',
      description:
        'Qualified Medical Professionals, Your Health is Our Priority',
    },
    service: {
      title: 'Our Services',
      description:
        'Discover the wide range of medical services offered at IYA Medical',
    },
    testimonial: {
      title: 'Journeys of Healing And Trust From Our Patients',
      description: '',
    },
    locations: {
      title: 'Find Our Locations Near You',
      description: '',
    },
    procedures: {
      title: 'Explore Your Minimally Invasive Treatment Options',
      description:
        'IR has revolutionized medicine with image-guided, minimally invasive treatments.',
    },
  },

  // Navigation
  navLinks: [
    { label: 'Home', href: '/' },
    {
      label: 'About',
      href: '/about',
      children: [
        { label: 'About IYA Medical', href: '/about' },
        { label: 'Meet Dr. Agha', href: '/doctors/dr-ayad-agha' },
        { label: 'Meet Dr. Al-Hasan', href: '/doctors/dr-yazan-al-hasan' },
        { label: 'Affiliated Doctors & Providers', href: '/doctors' },
        { label: 'Our Locations', href: '/locations' },
        { label: 'Career Opportunities', href: '/careers' },
      ],
    },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'IR Services Overview', href: '/services' },
        { label: 'Neurology', href: '/services/neurology' },
        { label: 'Internal Medicine', href: '/services/internal-medicine' },
      ],
    },
    {
      label: 'Procedures',
      href: '/procedures',
      children: [
        { label: 'All Procedures', href: '/procedures' },
        { label: 'PAD Treatment', href: '/procedures/peripheral-artery-disease-pad' },
        { label: 'Uterine Fibroids', href: '/procedures/uterine-fibroids' },
        { label: 'Varicose Veins', href: '/procedures/varicose-veins' },
        { label: 'Liver Cancer', href: '/procedures/liver-cancer' },
        { label: 'Chronic Knee Pain', href: '/procedures/chronic-knee-pain' },
        { label: 'DVT Treatment', href: '/procedures/deep-vein-thrombosis-dvt' },
        { label: 'Stem Cell Therapy', href: '/procedures/stem-cell-therapy' },
      ],
    },
    {
      label: 'Patients',
      href: '/patient-forms',
      children: [
        { label: 'Patient Forms', href: '/patient-forms' },
        { label: 'Online Intake', href: '/patient-intake' },
        { label: 'Patient Portal', href: '/portal' },
      ],
    },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '/contact' },
  ],
} as const
