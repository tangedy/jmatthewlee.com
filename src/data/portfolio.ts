import aboutPortrait from '../assets/media/matthew-about.webp'
import dutchBlitzerImage from '../assets/media/dutch-blitzer.webp'
import dutchBlitzerPoster from '../assets/media/dutch-blitzer-poster.webp'
import fftPoster from '../assets/media/fpga-dsp-poster.webp'
import homePortrait from '../assets/media/matthew-home.webp'
import macroPadImage from '../assets/media/macro-pad.webp'
import spikeballImage from '../assets/media/spikeball.webp'
import spikeballPoster from '../assets/media/spikeball-poster.webp'
import storyBitesImage from '../assets/media/storybites.webp'
import timeboundImage from '../assets/media/timebound.webp'
import timeboundPoster from '../assets/media/timebound-poster.webp'

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  id: string
  title: string
  category: string
  description: string
  image: string
  poster?: string
  imageAlt: string
  technologies: string[]
  links: ProjectLink[]
}

export const profile = {
  name: 'Matthew Lee',
  discipline: 'Mechatronics Engineering',
  location: 'University of Waterloo',
  shortBio:
    'Mechatronics Engineering at the University of Waterloo, focused on embedded systems, hardware design, and robotics.',
  homePortrait,
  aboutPortrait,
  about: [
    'Mechatronics Engineering student at the University of Waterloo, focused on embedded systems, FPGA design, and custom hardware.',
    'Research assistant at the Engineering IDEAS Clinic, where I deliver hands-on workshops on microcontrollers and FPGAs to 140+ students and am building a real-time DSP platform on Cyclone V hardware.',
    'Recent work includes a baremetal STM32 macropad with a custom KiCad PCB, an FPGA audio spectrum analyzer with a from-scratch 512-point FFT, and embedded sensing projects using IMU-based classification.',
  ],
  interests: [
    'Embedded Systems',
    'Robotics',
    'Game Development',
    'Hardware Design',
    '3D Design & Printing',
  ],
  skills: [
    {
      group: 'Programming / Development',
      items: [
        'C / C++',
        'Python',
        'JavaScript',
        'React',
        'C#',
        'Express.js',
        'Tailwind CSS',
        'Unity',
        'Git',
      ],
    },
    {
      group: 'Engineering / Hardware',
      items: [
        'STM32',
        'Arduino',
        'KiCad',
        'SolidWorks',
        'AutoCAD',
        '3D Printing',
      ],
    },
    {
      group: 'Cloud / Services',
      items: ['Auth0', 'ElevenLabs', 'Gemini API', 'Snowflake REST API'],
    },
  ],
}

export const projects: Project[] = [
  {
    id: 'fpga-dsp',
    title: 'FPGA DSP Workshop',
    category: 'Signal Processing / 2026',
    description:
      'Real-time audio DSP on Cyclone V GX for the UW IDEAS Clinic, with a custom 512-point FFT in SystemVerilog at 48 kHz, live HDMI spectrum visualization, and a KiCad audio I/O PCB.',
    image: fftPoster,
    imageAlt: 'Live FPGA audio spectrum visualization on a display',
    technologies: ['SystemVerilog', 'Quartus', 'Cyclone V', 'KiCad'],
    links: [],
  },
  {
    id: 'macro-pad',
    title: 'STM32 Baremetal Macro Pad',
    category: 'Embedded Hardware / 2025',
    description:
      'Custom macro pad with baremetal firmware, custom KiCad PCB design, and STM32Cube USB HID drivers for sending programmable macros.',
    image: macroPadImage,
    imageAlt: 'Custom STM32 macro pad PCB and assembled keypad',
    technologies: ['STM32', 'C', 'KiCad', 'USB HID'],
    links: [],
  },
  {
    id: 'storybites',
    title: 'StoryBites',
    category: 'Hack the Valley / 2025',
    description:
      "A web platform that turns a child's interests into personalized, dyslexia-friendly audiobooks with natural narration.",
    image: storyBitesImage,
    imageAlt: 'StoryBites personalized audiobook web interface',
    technologies: ['React', 'Gemini API', 'ElevenLabs', 'Snowflake', 'Auth0'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/VainerAriel/HackTheValley2025',
      },
      { label: 'Live site', href: 'https://storybites.vip/' },
    ],
  },
  {
    id: 'timebound',
    title: 'Timebound',
    category: 'GMTK Game Jam / 2025',
    description:
      'A Unity game built in C# for the 2025 GMTK Game Jam, designed and shipped as a collaborative rapid-development project.',
    image: timeboundImage,
    poster: timeboundPoster,
    imageAlt: 'Gameplay from the Unity game Timebound',
    technologies: ['Unity', 'C#', 'Game Design'],
    links: [{ label: 'GitHub', href: 'https://github.com/JMatthewLee/gmtk2025' }],
  },
  {
    id: 'spikeball',
    title: 'Spikeball Rim Detector',
    category: 'Embedded Sensing / 2025',
    description:
      'Arduino-based impact detection that distinguishes rim hits from net shots using MPU6500 motion data, then reports the result through instant LED feedback.',
    image: spikeballImage,
    poster: spikeballPoster,
    imageAlt: 'Spikeball rim detector hardware responding during a test',
    technologies: ['Arduino Nano', 'C++', 'MPU6500', 'LED Control'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/JMatthewLee/Spikeball-Rim-Detector',
      },
    ],
  },
  {
    id: 'dutch-blitzer',
    title: 'Dutch Blitz Card Sorter',
    category: 'Robotics / 2025',
    description:
      'A Lego EV3 robot that automates sorting four mixed Dutch Blitz decks and supports score calculation between rounds.',
    image: dutchBlitzerImage,
    poster: dutchBlitzerPoster,
    imageAlt: 'Lego EV3 Dutch Blitz card sorting robot in operation',
    technologies: ['Lego EV3', 'C', 'Color Sensing', 'Mechanism Design'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/JMatthewLee/EV3-Card-Sorter-and-Game-Manager',
      },
    ],
  },
]

export const contactLinks = [
  { label: 'GitHub', value: '@JMatthewLee', href: 'https://github.com/JMatthewLee' },
  {
    label: 'LinkedIn',
    value: '/in/JamesMatthewLee',
    href: 'https://linkedin.com/in/JamesMatthewLee',
  },
  {
    label: 'Devpost',
    value: '@JMatthewLee',
    href: 'https://devpost.com/JMatthewLee',
  },
  { label: 'Email', value: 'm88lee@uwaterloo.ca', href: 'mailto:m88lee@uwaterloo.ca' },
] as const