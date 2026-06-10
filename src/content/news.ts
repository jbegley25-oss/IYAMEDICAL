export interface NewsArticle {
  slug: string
  title: string
  date: string
  excerpt: string
  image: string
  content: string
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'what-is-kyphoplasty',
    title: 'What is Kyphoplasty?',
    date: '2025-09-02',
    excerpt:
      'Kyphoplasty is a minimally invasive procedure used to treat spinal compression fractures. Learn how this innovative treatment can relieve debilitating back pain and restore spinal height.',
    image: '/images/blog/kyphoplasty.jpg',
    content:
      'Kyphoplasty is a minimally invasive surgical procedure used to treat vertebral compression fractures (VCFs) of the spine. These fractures are often caused by osteoporosis, cancer, or trauma. During the procedure, a small balloon is inserted into the fractured vertebra and inflated to restore the bone to its original height. The space created is then filled with bone cement to stabilize the fracture. Most patients experience significant pain relief within 48 hours of the procedure.',
  },
  {
    slug: 'is-your-chemotherapy-still-working',
    title: 'Is Your Chemotherapy Still Working?',
    date: '2025-09-02',
    excerpt:
      'Interventional radiology offers advanced imaging techniques to monitor chemotherapy effectiveness and provide targeted alternatives when systemic treatment falls short.',
    image: '/images/blog/chemotherapy.jpg',
    content:
      'For cancer patients undergoing chemotherapy, knowing whether treatment is effective is crucial. Advanced imaging techniques used in interventional radiology can help oncologists determine if chemotherapy is achieving its goals. When systemic chemotherapy is no longer effective, interventional radiology offers targeted treatment options such as chemoembolization and radioembolization that deliver therapy directly to the tumor site, minimizing side effects and maximizing treatment efficacy.',
  },
  {
    slug: 'iv-ice-future-of-cancer-treatments',
    title: 'IV ICE: The Future of Cancer Treatments',
    date: '2025-09-02',
    excerpt:
      'Discover how IV ICE (Intravenous Intratumoral Cryotherapy Enhancement) is revolutionizing cancer treatment with minimally invasive technology that targets tumors directly.',
    image: '/images/blog/iv-ice.jpg',
    content:
      'IV ICE represents a groundbreaking advancement in cancer treatment technology. This innovative approach combines the precision of interventional radiology with cryotherapy to target tumors directly, freezing cancer cells while preserving surrounding healthy tissue. The minimally invasive nature of this procedure means shorter recovery times, fewer side effects, and the potential for outpatient treatment. As research continues, IV ICE is poised to become an important tool in the fight against cancer.',
  },
]
