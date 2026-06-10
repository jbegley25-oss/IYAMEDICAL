export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  mapUrl: string
  mapEmbed: string
  image: string
}

export const locations: Location[] = [
  {
    id: 'mountain-view',
    name: 'Mountain View',
    address: '9201 E. Mountain View Rd., Suite 130',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85258',
    phone: '480-771-0000',
    mapUrl: 'https://www.google.com/maps/place/9201+E+Mountain+View+Rd+Suite+130,+Scottsdale,+AZ+85258',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.5!2d-111.89!3d33.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s9201+E+Mountain+View+Rd+Suite+130+Scottsdale+AZ+85258!5e0!3m2!1sen!2sus',
    image: '/images/locations/mountain-view.png',
  },
  {
    id: 'north-scottsdale',
    name: 'North Scottsdale',
    address: '8787 N. Scottsdale Rd., Suite 105',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85258',
    phone: '480-771-0000',
    mapUrl: 'https://www.google.com/maps/place/8787+N+Scottsdale+Rd+Suite+105,+Scottsdale,+AZ+85258',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.5!2d-111.89!3d33.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s8787+N+Scottsdale+Rd+Suite+105+Scottsdale+AZ+85258!5e0!3m2!1sen!2sus',
    image: '/images/locations/north-scottsdale.png',
  },
  {
    id: 'scottsdale',
    name: 'Scottsdale',
    address: '14901 N. Scottsdale Rd.',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85254',
    phone: '480-771-0000',
    mapUrl: 'https://www.google.com/maps/place/14901+N+Scottsdale+Rd,+Scottsdale,+AZ+85254',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.5!2d-111.89!3d33.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s14901+N+Scottsdale+Rd+Scottsdale+AZ+85254!5e0!3m2!1sen!2sus',
    image: '/images/locations/scottsdale.png',
  },
]
