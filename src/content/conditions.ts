// ─────────────────────────────────────────────────────────────────────────
// Self-diagnosis data layer
//
// Maps plain-language patient complaints → the medical condition → the exact
// IYA Medical procedure that treats it. This powers the "What's bothering you?"
// explorer so patients can find their own solution and book a consultation.
//
// Every `procedureSlug` must match a slug in procedures.ts.
// ─────────────────────────────────────────────────────────────────────────

export interface Concern {
  /** Plain-language, first-person symptom a patient would recognize. */
  label: string
  /** One short supporting line. */
  detail: string
  /** Medical condition name (shown as the "answer"). */
  condition: string
  /** Slug of the procedure that treats it (must exist in procedures.ts). */
  procedureSlug: string
}

export interface BodyArea {
  id: string
  /** Patient-facing area label. */
  label: string
  /** lucide-react icon name. */
  icon: string
  /** Short reassuring blurb shown when the area is selected. */
  blurb: string
  concerns: Concern[]
}

export const bodyAreas: BodyArea[] = [
  {
    id: 'legs-veins',
    label: 'Legs & Veins',
    icon: 'Footprints',
    blurb: 'Pain, swelling, cramping, or visible veins in the legs and feet.',
    concerns: [
      {
        label: 'My legs cramp or ache when I walk',
        detail: 'Pain that eases when you rest can mean narrowed leg arteries.',
        condition: 'Peripheral Artery Disease (PAD)',
        procedureSlug: 'peripheral-artery-disease-pad',
      },
      {
        label: 'I have bulging, ropey, or spider veins',
        detail: 'Twisted, visible veins that may ache or itch.',
        condition: 'Varicose Veins',
        procedureSlug: 'varicose-veins',
      },
      {
        label: 'My legs feel heavy, swollen, or restless',
        detail: 'Swelling and heaviness that worsen by day’s end.',
        condition: 'Chronic Venous Insufficiency',
        procedureSlug: 'venous-insufficiency',
      },
      {
        label: 'One leg is suddenly swollen, warm, or painful',
        detail: 'A possible blood clot — this can be urgent.',
        condition: 'Deep Vein Thrombosis (DVT)',
        procedureSlug: 'deep-vein-thrombosis-dvt',
      },
      {
        label: 'I have a wound on my foot or leg that won’t heal',
        detail: 'Non-healing sores can signal poor circulation.',
        condition: 'Peripheral Artery Disease (PAD)',
        procedureSlug: 'peripheral-artery-disease-pad',
      },
    ],
  },
  {
    id: 'knees-joints',
    label: 'Knees & Joints',
    icon: 'PersonStanding',
    blurb: 'Persistent knee pain, stiffness, or arthritis that limits you.',
    concerns: [
      {
        label: 'My knee aches and won’t settle down',
        detail: 'Chronic knee pain from arthritis, without surgery.',
        condition: 'Knee Osteoarthritis',
        procedureSlug: 'genicular-artery-embolization',
      },
      {
        label: 'I want to avoid or delay knee replacement',
        detail: 'A minimally invasive alternative for ongoing knee pain.',
        condition: 'Chronic Knee Pain',
        procedureSlug: 'chronic-knee-pain',
      },
      {
        label: 'My joints hurt and I’m exploring regenerative options',
        detail: 'Stem cell and regenerative treatments to support healing.',
        condition: 'Joint Degeneration',
        procedureSlug: 'stem-cell-therapy',
      },
    ],
  },
  {
    id: 'back-spine',
    label: 'Back & Spine',
    icon: 'Activity',
    blurb: 'Long-standing back pain or spine fractures.',
    concerns: [
      {
        label: 'My back has hurt for months',
        detail: 'Image-guided treatments for lasting back-pain relief.',
        condition: 'Chronic Back Pain',
        procedureSlug: 'chronic-back-pain',
      },
      {
        label: 'I have a spinal fracture from osteoporosis',
        detail: 'Sudden, sharp back pain after a minor strain or fall.',
        condition: 'Vertebral Compression Fracture',
        procedureSlug: 'compression-fracture',
      },
    ],
  },
  {
    id: 'womens-health',
    label: "Women's Health",
    icon: 'Venus',
    blurb: 'Heavy periods, fibroids, and chronic pelvic pain.',
    concerns: [
      {
        label: 'My periods are heavy with pain or pressure',
        detail: 'Treat fibroids without surgery and keep your uterus.',
        condition: 'Uterine Fibroids',
        procedureSlug: 'uterine-fibroids',
      },
      {
        label: 'I have constant, dull pelvic pain',
        detail: 'Pain that worsens when standing may be pelvic vein related.',
        condition: 'Pelvic Congestion Syndrome',
        procedureSlug: 'pelvic-congestion-syndrome',
      },
    ],
  },
  {
    id: 'mens-health',
    label: "Men's Health",
    icon: 'Mars',
    blurb: 'Prostate symptoms and varicocele.',
    concerns: [
      {
        label: 'I urinate often, urgently, or weakly',
        detail: 'Enlarged-prostate relief without surgical side effects.',
        condition: 'Enlarged Prostate (BPH)',
        procedureSlug: 'prostate-artery-embolization',
      },
      {
        label: 'I have a dull ache or lump in my scrotum',
        detail: 'Varicocele can cause discomfort and affect fertility.',
        condition: 'Varicocele',
        procedureSlug: 'varicocele',
      },
    ],
  },
  {
    id: 'cancer-tumors',
    label: 'Cancer & Tumors',
    icon: 'Ribbon',
    blurb: 'Targeted, image-guided treatments for tumors.',
    concerns: [
      {
        label: 'I’ve been diagnosed with liver cancer',
        detail: 'Targeted chemo/radioembolization and ablation.',
        condition: 'Liver Cancer',
        procedureSlug: 'liver-cancer',
      },
      {
        label: 'I’ve been diagnosed with kidney cancer',
        detail: 'Image-guided ablation as an alternative to surgery.',
        condition: 'Kidney Cancer',
        procedureSlug: 'kidney-cancer',
      },
      {
        label: 'I have cancer that has spread to my bones',
        detail: 'Ablation and stabilization to relieve bone pain.',
        condition: 'Bone Metastases',
        procedureSlug: 'bone-metastases',
      },
    ],
  },
  {
    id: 'lungs-clots',
    label: 'Lungs & Blood Clots',
    icon: 'Wind',
    blurb: 'Blood clots in the lungs and clot prevention.',
    concerns: [
      {
        label: 'I’m short of breath with chest pain',
        detail: 'A clot in the lungs can be life-threatening — seek care now.',
        condition: 'Pulmonary Embolism',
        procedureSlug: 'pulmonary-embolism',
      },
      {
        label: 'I can’t take blood thinners but need clot protection',
        detail: 'A small filter can help prevent dangerous clots.',
        condition: 'Clot Prevention',
        procedureSlug: 'ivc-filters',
      },
    ],
  },
  {
    id: 'kidney-dialysis',
    label: 'Kidney & Dialysis',
    icon: 'Droplets',
    blurb: 'Dialysis access creation and maintenance.',
    concerns: [
      {
        label: 'My dialysis access isn’t working well',
        detail: 'Creation and repair of fistulas and grafts.',
        condition: 'Dialysis Access',
        procedureSlug: 'dialysis-access',
      },
    ],
  },
  {
    id: 'digestive',
    label: 'Digestive (GI)',
    icon: 'Stethoscope',
    blurb: 'Gastrointestinal bleeding.',
    concerns: [
      {
        label: 'I have internal GI bleeding',
        detail: 'Angiographic embolization to stop bleeding quickly.',
        condition: 'GI Bleeding',
        procedureSlug: 'gi-bleeding',
      },
    ],
  },
  {
    id: 'brain-nerves',
    label: 'Brain & Nerves',
    icon: 'Brain',
    blurb: 'Headaches, numbness, memory, and nervous-system concerns.',
    concerns: [
      {
        label: 'I have headaches, numbness, or memory concerns',
        detail: 'Full neurological evaluation and treatment.',
        condition: 'Neurological Conditions',
        procedureSlug: 'neurology',
      },
    ],
  },
]

/** Flattened concern list for free-text search across the whole catalog. */
export const allConcerns: (Concern & { areaId: string; areaLabel: string })[] =
  bodyAreas.flatMap((area) =>
    area.concerns.map((c) => ({
      ...c,
      areaId: area.id,
      areaLabel: area.label,
    }))
  )
