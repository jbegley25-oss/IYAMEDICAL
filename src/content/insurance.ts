export interface InsuranceProvider {
  name: string
  logoPath: string
}

export const insuranceProviders: InsuranceProvider[] = [
  { name: 'Aetna', logoPath: '/images/insurance/aetna.svg' },
  { name: 'Blue Cross Blue Shield', logoPath: '/images/insurance/bluecross-and-blueshield.svg' },
  { name: 'Cigna', logoPath: '/images/insurance/cigna.svg' },
  { name: 'Humana', logoPath: '/images/insurance/humana.svg' },
  { name: 'Medicare', logoPath: '/images/insurance/medicare.png' },
  { name: 'AHCCCS', logoPath: '/images/insurance/ahcccs.png' },
  { name: 'Arizona Complete Health', logoPath: '/images/insurance/arizona-complete-health.png' },
  { name: 'Multiplan', logoPath: '/images/insurance/multiplan.webp' },
  { name: 'US TRICARE', logoPath: '/images/insurance/us-tricare.png' },
  { name: 'United Health Care', logoPath: '/images/insurance/united-health-care.png' },
  { name: 'Ameriben', logoPath: '/images/insurance/ameriben.png' },
  { name: 'Oscar', logoPath: '/images/insurance/oscar.png' },
]
