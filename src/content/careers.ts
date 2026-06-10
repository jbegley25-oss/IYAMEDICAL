export interface CareerPosition {
  title: string
  type: string
  description: string
}

export const careerPositions: CareerPosition[] = [
  {
    title: 'Medical Assistant',
    type: 'Full-Time',
    description:
      'Assist physicians with patient care, prepare examination rooms, and support clinical procedures in our interventional radiology practice.',
  },
  {
    title: 'Front Desk Receptionist',
    type: 'Full-Time',
    description:
      'Greet patients, manage scheduling, handle insurance verifications, and provide excellent customer service as the first point of contact.',
  },
  {
    title: 'Radiology Technologist',
    type: 'Full-Time',
    description:
      'Operate imaging equipment, assist during interventional radiology procedures, and ensure patient safety and comfort during diagnostic exams.',
  },
  {
    title: 'Patient Care Coordinator',
    type: 'Full-Time',
    description:
      'Coordinate patient care across departments, manage referrals, and ensure smooth communication between patients, physicians, and insurance providers.',
  },
  {
    title: 'Medical Billing Specialist',
    type: 'Full-Time / Part-Time',
    description:
      'Process medical claims, manage billing inquiries, and ensure accurate coding and timely reimbursement for all medical services.',
  },
]
