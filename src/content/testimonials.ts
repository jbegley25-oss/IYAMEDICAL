export interface Testimonial {
  name: string
  condition: string
  quote: string
  videoId: string | null
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    name: 'Marlow',
    condition: 'Knee & Hip Pain',
    quote: 'He saved my life.. he spent 30 minutes showing my husband and I the MRI exam before the procedure. He gave me my life back.',
    videoId: '8yGSYvDGwEs',
    rating: 5,
  },
  {
    name: 'Anna S.',
    condition: 'Back Fracture',
    quote: "This physician saved my mom's life. My mom was bleeding for three days internally...",
    videoId: 'YHY0uQLfjrc',
    rating: 5,
  },
  {
    name: 'Bill',
    condition: 'Prostate Cancer',
    quote: 'I found him understanding and caring. He explained everything in detail...',
    videoId: null,
    rating: 5,
  },
  {
    name: 'Denise',
    condition: 'Cancer Treatment',
    quote: 'Beautiful office with a lot to offer. I love how nice everyone is.',
    videoId: 'z2mgLIyKpyQ',
    rating: 5,
  },
  {
    name: 'Mike',
    condition: 'Leg Surgery',
    quote: 'The entire team at IYA Medical was professional and caring. My recovery was faster than I expected.',
    videoId: null,
    rating: 5,
  },
]
