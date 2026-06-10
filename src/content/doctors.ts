export interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  email: string
  bio: string
  image: string
  credentials: string[]
}

export const doctors: Doctor[] = [
  {
    id: 'dr-ayad-agha',
    name: 'Ayad K. M. Agha, DO',
    title: 'Medical Director',
    specialty: 'Interventional Radiology',
    email: 'dragha@iyamedical.com',
    bio: "The Valley's Premier Diagnostic and Interventional Radiologist. Dr. Agha leads IYA Medical's Program of Vascular and Interventional Radiology, using state-of-the-art minimally invasive techniques and imaging-guidance to replace conventional surgery.",
    image: '/images/doctors/dr-ayad-agha.png',
    credentials: [
      'Doctor of Osteopathic Medicine (DO)',
      'Board-Certified Interventional Radiologist',
      'Phoenix Magazine Top Doc Award',
      'ACR Accredited Facility',
    ],
  },
  {
    id: 'dr-yazan-al-hasan',
    name: 'Yazan Al-Hasan, MD, PhD',
    title: 'Neurologist',
    specialty: 'Neurology',
    email: 'yazan@iyamedical.com',
    bio: 'Dr. Al-Hasan is a board-certified neurologist specializing in the diagnosis and treatment of neurological conditions. He brings advanced research expertise and a patient-centered approach to neurological care at IYA Medical.',
    image: '/images/doctors/yazan-al-hasan.png',
    credentials: [
      'Doctor of Medicine (MD)',
      'Doctor of Philosophy (PhD)',
      'Board-Certified Neurologist',
    ],
  },
  {
    id: 'dr-ahmed-agha',
    name: 'Ahmed K. Agha, MD',
    title: 'Internal Medicine Physician',
    specialty: 'Internal Medicine',
    email: 'ahmed@iyamedical.com',
    bio: 'Dr. Ahmed Agha provides comprehensive internal medicine care, focusing on preventive health and management of chronic conditions. He is dedicated to building lasting relationships with patients and delivering personalized medical care.',
    image: '/images/doctors/dr-ahmed-agha.png',
    credentials: [
      'Doctor of Medicine (MD)',
      'Board-Certified Internal Medicine',
    ],
  },
  {
    id: 'dr-iya-agha',
    name: 'Dr. Iya Agha, D.O.',
    title: 'Dermatology Resident',
    specialty: 'Dermatology',
    email: '',
    bio: 'Dr. Iya Agha is a dermatology resident contributing to the comprehensive care team at IYA Medical, supporting the practice with expertise in skin health and dermatological conditions.',
    image: '/images/doctors/dr-iya-agha.png',
    credentials: [
      'Doctor of Osteopathic Medicine (DO)',
      'Dermatology Resident',
    ],
  },
  {
    id: 'dr-mustafa-ogali',
    name: 'Mustafa Ogaili, M.D.',
    title: 'Licensed Interventional Radiology Provider',
    specialty: 'Interventional Radiology',
    email: 'malogaili@iyamedical.com',
    bio: 'Dr. Ogaili is a Licensed Interventional Radiology Provider (Transitional Training Permit) with 3 years of experience in image-guided and endovascular interventions such as embolization, vascular reconstruction, pain interventions, and neuro interventions. At IYA Medical, he has provided care for many patients performing over 5,000 procedures. He completed his Vascular Interventional Radiology post-doctoral research fellowship at Mayo Clinic — Phoenix Campus, where he investigated, presented, and published numerous projects with the Division of Interventional Radiology. Dr. Ogaili has also recently joined St. Louis University/SSM Vascular Interventional Radiology IR/DR residency program for his Advanced Specialty Training.',
    image: '/images/doctors/dr-mustafa-ogali.jpg',
    credentials: [
      'Licensed Transitional Trainee — Interventional Radiology',
      'M.D.',
      '3+ years of image-guided and endovascular interventions',
      '5,000+ procedures performed at IYA Medical',
      'Vascular IR Research Fellowship — Mayo Clinic, Phoenix',
      'IR/DR Residency — St. Louis University/SSM',
    ],
  },
]
