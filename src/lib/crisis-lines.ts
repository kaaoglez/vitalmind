/**
 * Crisis Lines Data Module for VitalMind
 *
 * IMPORTANT: These are real crisis intervention phone numbers.
 * All numbers have been verified to the best of our ability.
 * Please verify periodically as numbers may change.
 *
 * Last verified: 2025
 */

export interface CrisisLine {
  /** Name of the crisis service */
  name: string;
  /** Phone number to call (if available) */
  phone?: string;
  /** Brief description of the service */
  description: string;
  /** Availability hours */
  available: string;
  /** Type of service */
  type: 'phone' | 'chat' | 'text';
  /** Website URL if available */
  url?: string;
}

export interface CountryCrisisLines {
  /** Country name in the local language */
  name: string;
  /** ISO country code */
  code: string;
  /** Flag emoji */
  flag: string;
  /** Languages spoken in this country (for sorting/filtering) */
  languages: Language[];
  /** Array of crisis lines available in this country */
  lines: CrisisLine[];
}

export type Language = 'es' | 'en' | 'pt' | 'fr';

export const crisisLinesData: CountryCrisisLines[] = [
  // ── Spanish-speaking countries ──────────────────────────────────────
  {
    name: 'México',
    code: 'MX',
    flag: '🇲🇽',
    languages: ['es'],
    lines: [
      {
        name: 'SAPTEL',
        phone: '800-911-2000',
        description: 'Servicio de Apoyo Psicológico por Teléfono — ayuda emocional profesional',
        available: '24/7',
        type: 'phone',
        url: 'https://www.saptel.org.mx',
      },
      {
        name: 'Línea de la Vida',
        phone: '800-911-7557',
        description: 'Prevención del suicidio y apoyo emocional — Secretaría de Salud',
        available: '24/7',
        type: 'phone',
        url: 'https://www.gob.mx/salud',
      },
      {
        name: 'Locatel',
        phone: '55-5658-1111',
        description: 'Orientación y atención psicológica en la CDMX',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'DIF — Línea Nacional',
        phone: '800-888-2343',
        description: 'Atención a violencia familiar y apoyo psicológico',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat de la Vida',
        description: 'Chat en línea para prevención del suicidio',
        available: '24/7',
        type: 'chat',
        url: 'https://www.gob.mx/salud',
      },
    ],
  },
  {
    name: 'Colombia',
    code: 'CO',
    flag: '🇨🇴',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 106',
        phone: '106',
        description: 'Línea de prevención del suicidio — Ministerio de Salud',
        available: '24/7',
        type: 'phone',
        url: 'https://www.minsalud.gov.co',
      },
      {
        name: 'Línea 123 — Emergencias',
        phone: '123',
        description: 'Línea nacional de emergencias',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 155 — Violencia de Género',
        phone: '155',
        description: 'Atención a mujeres víctimas de violencia',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Papaz',
        phone: '018000-112-113',
        description: 'Protección infantil contra abuso sexual',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat en Línea 106',
        description: 'Chat de prevención del suicidio en línea',
        available: '24/7',
        type: 'chat',
        url: 'https://www.minsalud.gov.co',
      },
    ],
  },
  {
    name: 'Argentina',
    code: 'AR',
    flag: '🇦🇷',
    languages: ['es'],
    lines: [
      {
        name: 'Centro de Asistencia al Suicida (CAS)',
        phone: '135',
        description: 'Atención telefónica para personas en crisis suicida',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 141 — Salud Mental',
        phone: '0800-345-1435',
        description: 'Línea nacional de salud mental y adicciones',
        available: '24/7',
        type: 'phone',
        url: 'https://www.argentina.gob.ar/salud',
      },
      {
        name: 'Línea 144 — Violencia de Género',
        phone: '144',
        description: 'Atención a víctimas de violencia de género',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Teléfono de la Esperanza',
        phone: '0800-888-6789',
        description: 'Apoyo emocional y escucha activa',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat 141',
        description: 'Chat de salud mental en línea',
        available: 'Lunes a Viernes 9-21hs',
        type: 'chat',
        url: 'https://www.argentina.gob.ar/salud',
      },
    ],
  },
  {
    name: 'Chile',
    code: 'CL',
    flag: '🇨🇱',
    languages: ['es'],
    lines: [
      {
        name: 'Salud Responde',
        phone: '600-360-7777',
        description: 'Línea de salud mental — Ministerio de Salud',
        available: '24/7',
        type: 'phone',
        url: 'https://www.minsal.cl',
      },
      {
        name: 'Línea 137 — Salud Mental',
        phone: '137',
        description: 'Atención de emergencia en salud mental',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Fono Infancia',
        phone: '800-200-818',
        description: 'Apoyo psicológico para niños, niñas y adolescentes',
        available: 'Lunes a Viernes 9-18hs',
        type: 'phone',
      },
      {
        name: 'Línea 145 — Violencia',
        phone: '145',
        description: 'Atención a víctimas de violencia sexual',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat Salud Responde',
        description: 'Chat de apoyo psicológico en línea',
        available: '24/7',
        type: 'chat',
        url: 'https://www.minsal.cl',
      },
    ],
  },
  {
    name: 'España',
    code: 'ES',
    flag: '🇪🇸',
    languages: ['es'],
    lines: [
      {
        name: 'Teléfono de la Esperanza — 024',
        phone: '024',
        description: 'Línea de prevención del suicidio — Ministerio de Sanidad',
        available: '24/7',
        type: 'phone',
        url: 'https://www.024info.es',
      },
      {
        name: 'Teléfono de la Esperanza',
        phone: '717-003-717',
        description: 'Apoyo emocional y ayuda en crisis',
        available: '24/7',
        type: 'phone',
        url: 'https://www.telefonodelaesperanza.org',
      },
      {
        name: '016 — Violencia de Género',
        phone: '016',
        description: 'Atención a víctimas de violencia de género',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'ANAR — Ayuda a Niños y Adolescentes',
        phone: '900-202-010',
        description: 'Línea de ayuda para menores en riesgo',
        available: '24/7',
        type: 'phone',
        url: 'https://www.anar.org',
      },
      {
        name: 'Chat 024',
        description: 'Chat de prevención del suicidio en línea',
        available: '24/7',
        type: 'chat',
        url: 'https://www.024info.es',
      },
    ],
  },
  {
    name: 'Perú',
    code: 'PE',
    flag: '🇵🇪',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 113 — Salud',
        phone: '113',
        description: 'Línea de salud del Ministerio de Salud — opción 5 para salud mental',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 100 — Salud Mental',
        phone: '100',
        description: 'Línea de prevención del suicidio y salud mental',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 1818 — Violencia Familiar',
        phone: '1818',
        description: 'Atención a víctimas de violencia familiar y sexual',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat MINSA',
        description: 'Chat de salud mental en línea',
        available: 'Lunes a Viernes 8-20hs',
        type: 'chat',
        url: 'https://www.gob.pe/minsa',
      },
    ],
  },
  {
    name: 'Ecuador',
    code: 'EC',
    flag: '🇪🇨',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 171',
        phone: '171',
        description: 'Línea de prevención del suicidio — Ministerio de Salud',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 911 — Emergencias',
        phone: '911',
        description: 'Línea nacional de emergencias',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 180 — Violencia de Género',
        phone: '180',
        description: 'Atención a mujeres víctimas de violencia',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat de Apoyo Emocional',
        description: 'Chat en línea del Ministerio de Salud Pública',
        available: 'Lunes a Viernes 8-17hs',
        type: 'chat',
        url: 'https://www.salud.gob.ec',
      },
    ],
  },
  {
    name: 'Venezuela',
    code: 'VE',
    flag: '🇻🇪',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 141',
        phone: '141',
        description: 'Atención en salud mental — prevención del suicidio',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Emergencias 171',
        phone: '171',
        description: 'Línea de emergencias nacional',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'FUNDAMAD',
        phone: '0212-263-0144',
        description: 'Fundación de Ayuda al Deprimido y Suicida',
        available: 'Lunes a Viernes 8-17hs',
        type: 'phone',
      },
      {
        name: 'Línea 0800-MUJER',
        phone: '0800-685-3776',
        description: 'Atención a mujeres víctimas de violencia',
        available: '24/7',
        type: 'phone',
      },
    ],
  },
  {
    name: 'Uruguay',
    code: 'UY',
    flag: '🇺🇾',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 1919 — MIDES',
        phone: '1919',
        description: 'Línea de apoyo emocional — Ministerio de Desarrollo Social',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 911 — Emergencias',
        phone: '911',
        description: 'Emergencias generales',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'FAS — Fundación Ayuda al Suicida',
        phone: '2409-8989',
        description: 'Apoyo y prevención del suicidio',
        available: 'Lunes a Viernes 9-21hs',
        type: 'phone',
      },
      {
        name: 'Línea 0800-4141',
        phone: '0800-4141',
        description: 'Atención a víctimas de violencia doméstica',
        available: '24/7',
        type: 'phone',
      },
    ],
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    flag: '🇨🇷',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 911 — Emergencias',
        phone: '911',
        description: 'Emergencias generales',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea de la Vida',
        phone: '800-911-1111',
        description: 'Prevención del suicidio y apoyo emocional',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 800-3000',
        phone: '800-3000',
        description: 'Atención a víctimas de violencia',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat de Apoyo',
        description: 'Chat en línea de la Caja Costarricense de Seguro Social',
        available: 'Lunes a Viernes 8-16hs',
        type: 'chat',
        url: 'https://www.ccss.sa.cr',
      },
    ],
  },
  {
    name: 'Panamá',
    code: 'PA',
    flag: '🇵🇦',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 5151',
        phone: '5151',
        description: 'Línea de salud mental — MINSA',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 911 — Emergencias',
        phone: '911',
        description: 'Emergencias generales',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 100 — Violencia',
        phone: '100',
        description: 'Atención a víctimas de violencia doméstica',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea de la Esperanza',
        phone: '800-0016',
        description: 'Apoyo emocional y prevención del suicidio',
        available: '24/7',
        type: 'phone',
      },
    ],
  },
  {
    name: 'Guatemala',
    code: 'GT',
    flag: '🇬🇹',
    languages: ['es'],
    lines: [
      {
        name: 'Línea 123 — Salud Mental',
        phone: '123',
        description: 'Línea de apoyo en salud mental — MSPAS',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 110 — Emergencias',
        phone: '110',
        description: 'Emergencias generales',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Línea 1550 — Violencia',
        phone: '1550',
        description: 'Atención a víctimas de violencia intrafamiliar',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'SAP Guatemala',
        phone: '2410-8585',
        description: 'Servicio de Apoyo Psicológico',
        available: 'Lunes a Viernes 8-17hs',
        type: 'phone',
      },
    ],
  },

  // ── English-speaking countries ──────────────────────────────────────
  {
    name: 'Estados Unidos',
    code: 'US',
    flag: '🇺🇸',
    languages: ['en'],
    lines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        description: 'National suicide prevention and crisis intervention',
        available: '24/7',
        type: 'phone',
        url: 'https://988lifeline.org',
      },
      {
        name: 'Crisis Text Line',
        phone: '741741',
        description: 'Text HOME to 741741 for crisis support via text',
        available: '24/7',
        type: 'text',
        url: 'https://www.crisistextline.org',
      },
      {
        name: 'National Domestic Violence Hotline',
        phone: '1-800-799-7233',
        description: 'Support for domestic violence victims',
        available: '24/7',
        type: 'phone',
        url: 'https://www.thehotline.org',
      },
      {
        name: 'Trevor Project (LGBTQ+)',
        phone: '1-866-488-7386',
        description: 'Crisis intervention for LGBTQ+ youth',
        available: '24/7',
        type: 'phone',
        url: 'https://www.thetrevorproject.org',
      },
      {
        name: '988 Chat',
        description: 'Online chat with crisis counselors',
        available: '24/7',
        type: 'chat',
        url: 'https://988lifeline.org/chat/',
      },
      {
        name: 'TrevorChat',
        description: 'Online chat for LGBTQ+ youth in crisis',
        available: '24/7',
        type: 'chat',
        url: 'https://www.thetrevorproject.org/get-help-now/',
      },
      {
        name: 'TrevorText',
        phone: '678-678',
        description: 'Text START to 678-678 for LGBTQ+ crisis support',
        available: '24/7',
        type: 'text',
      },
    ],
  },
  {
    name: 'Canadá',
    code: 'CA',
    flag: '🇨🇦',
    languages: ['en', 'fr'],
    lines: [
      {
        name: '988 Suicide Crisis Helpline',
        phone: '988',
        description: 'Suicide prevention and crisis support — call or text',
        available: '24/7',
        type: 'phone',
        url: 'https://988.ca',
      },
      {
        name: 'Crisis Text Line Canada',
        phone: '686868',
        description: 'Text CONNECT to 686868 for crisis support',
        available: '24/7',
        type: 'text',
        url: 'https://www.crisistextline.ca',
      },
      {
        name: 'Kids Help Phone',
        phone: '1-800-668-6868',
        description: 'Counseling and support for youth',
        available: '24/7',
        type: 'phone',
        url: 'https://kidshelpphone.ca',
      },
      {
        name: 'Assaulted Women\'s Helpline',
        phone: '1-866-863-0511',
        description: 'Support for women experiencing violence',
        available: '24/7',
        type: 'phone',
        url: 'https://www.awhl.org',
      },
      {
        name: '988 Chat',
        description: 'Online crisis chat support',
        available: '24/7',
        type: 'chat',
        url: 'https://988.ca',
      },
    ],
  },
  {
    name: 'Reino Unido',
    code: 'GB',
    flag: '🇬🇧',
    languages: ['en'],
    lines: [
      {
        name: 'Samaritans',
        phone: '116-123',
        description: 'Emotional support for anyone in distress — free from any phone',
        available: '24/7',
        type: 'phone',
        url: 'https://www.samaritans.org',
      },
      {
        name: 'SHOUT Crisis Text Line',
        phone: '85258',
        description: 'Text SHOUT to 85258 for crisis support',
        available: '24/7',
        type: 'text',
        url: 'https://www.giveusashout.org',
      },
      {
        name: 'CALM — Campaign Against Living Miserably',
        phone: '0800-58-58-58',
        description: 'Support for men in distress',
        available: '17:00–00:00 daily',
        type: 'phone',
        url: 'https://www.thecalmzone.net',
      },
      {
        name: 'National Domestic Abuse Helpline',
        phone: '0808-2000-247',
        description: 'Support for domestic abuse victims — Refuge',
        available: '24/7',
        type: 'phone',
        url: 'https://www.nationaldahelpline.org.uk',
      },
      {
        name: 'Childline',
        phone: '0800-1111',
        description: 'Support for children and young people',
        available: '24/7',
        type: 'phone',
        url: 'https://www.childline.org.uk',
      },
      {
        name: 'Samaritans Chat',
        description: 'Online emotional support chat',
        available: '24/7',
        type: 'chat',
        url: 'https://www.samaritans.org',
      },
    ],
  },
  {
    name: 'Irlanda',
    code: 'IE',
    flag: '🇮🇪',
    languages: ['en'],
    lines: [
      {
        name: 'Samaritans Ireland',
        phone: '116-123',
        description: 'Emotional support for anyone in distress — free from any phone',
        available: '24/7',
        type: 'phone',
        url: 'https://www.samaritans.ie',
      },
      {
        name: 'Pieta House',
        phone: '1800-247-247',
        description: 'Suicide and self-harm prevention — free 24/7',
        available: '24/7',
        type: 'phone',
        url: 'https://www.pieta.ie',
      },
      {
        name: 'Text 50808',
        phone: '50808',
        description: 'Text HELLO to 50808 for crisis support',
        available: '24/7',
        type: 'text',
        url: 'https://text50808.ie',
      },
      {
        name: 'Women\'s Aid',
        phone: '1800-341-900',
        description: 'Support for women experiencing domestic violence',
        available: '24/7',
        type: 'phone',
        url: 'https://www.womensaid.ie',
      },
    ],
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    languages: ['en'],
    lines: [
      {
        name: 'Lifeline',
        phone: '13-11-14',
        description: 'Crisis support and suicide prevention — free from any phone',
        available: '24/7',
        type: 'phone',
        url: 'https://www.lifeline.org.au',
      },
      {
        name: 'Beyond Blue',
        phone: '1300-22-4636',
        description: 'Support for depression, anxiety and mental health',
        available: '24/7',
        type: 'phone',
        url: 'https://www.beyondblue.org.au',
      },
      {
        name: 'Kids Helpline',
        phone: '1800-55-1800',
        description: 'Counseling for young people aged 5-25',
        available: '24/7',
        type: 'phone',
        url: 'https://www.kidshelpline.com.au',
      },
      {
        name: '1800RESPECT',
        phone: '1800-737-732',
        description: 'National sexual assault and domestic violence counselling',
        available: '24/7',
        type: 'phone',
        url: 'https://www.1800respect.org.au',
      },
      {
        name: 'Lifeline Chat',
        description: 'Online crisis support chat',
        available: '24/7',
        type: 'chat',
        url: 'https://www.lifeline.org.au/crisis-chat/',
      },
    ],
  },

  // ── Portuguese-speaking countries ──────────────────────────────────
  {
    name: 'Brasil',
    code: 'BR',
    flag: '🇧🇷',
    languages: ['pt'],
    lines: [
      {
        name: 'CVV — Centro de Valorização da Vida',
        phone: '188',
        description: 'Prevenção do suicídio e apoio emocional',
        available: '24/7',
        type: 'phone',
        url: 'https://www.cvv.org.br',
      },
      {
        name: 'SAMU — Emergências',
        phone: '192',
        description: 'Serviço de Atendimento Móvel de Urgência',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Ligue 180 — Violência contra a Mulher',
        phone: '180',
        description: 'Atendimento a mulheres vítimas de violência',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'CVV Chat',
        description: 'Chat online de apoio emocional',
        available: '24/7',
        type: 'chat',
        url: 'https://www.cvv.org.br/chat',
      },
      {
        name: 'CVV E-mail',
        description: 'Suporte por e-mail para crise emocional',
        available: 'Resposta em até 24h',
        type: 'chat',
        url: 'https://www.cvv.org.br',
      },
    ],
  },
  {
    name: 'Portugal',
    code: 'PT',
    flag: '🇵🇹',
    languages: ['pt'],
    lines: [
      {
        name: 'SNS 24 — Saúde Mental',
        phone: '808-200-204',
        description: 'Linha de apoio em saúde mental — Serviço Nacional de Saúde',
        available: '24/7',
        type: 'phone',
        url: 'https://www.sns24.gov.pt',
      },
      {
        name: 'Voz de Apoio',
        phone: '21-354-4545',
        description: 'Apoio emocional e prevenção do suicídio',
        available: '24/7',
        type: 'phone',
        url: 'https://www.vozdeapoio.pt',
      },
      {
        name: 'Linha 112 — Emergências',
        phone: '112',
        description: 'Número europeu de emergências',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Linha 800-202-227 — Violência Doméstica',
        phone: '800-202-227',
        description: 'Apoio a vítimas de violência doméstica',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'SNS 24 Chat',
        description: 'Chat de apoio em saúde mental',
        available: '24/7',
        type: 'chat',
        url: 'https://www.sns24.gov.pt',
      },
    ],
  },

  // ── French-speaking countries ──────────────────────────────────────
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    languages: ['fr'],
    lines: [
      {
        name: 'Numéro national de prévention du suicide',
        phone: '3114',
        description: 'Numéro national de prévention du suicide — écoute et accompagnement',
        available: '24/7',
        type: 'phone',
        url: 'https://3114.fr',
      },
      {
        name: 'SOS Amitié',
        phone: '09 72 39 40 50',
        description: 'Écoute et soutien émotionnel — aide et accompagnement',
        available: '24/7',
        type: 'phone',
        url: 'https://www.sos-amitie.fr',
      },
      {
        name: '15 — Urgences médicales',
        phone: '15',
        description: 'Numéro d\'urgence médicale — SAMU',
        available: '24/7',
        type: 'phone',
      },
      {
        name: '3919 — Violences Femmes Info',
        phone: '3919',
        description: 'Accompagnement et orientation pour les femmes victimes de violences',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat SOS Amitié',
        description: 'Chat en ligne pour écoute et soutien émotionnel',
        available: '24/7',
        type: 'chat',
        url: 'https://www.sos-amitie.fr',
      },
    ],
  },
  {
    name: 'Belgique',
    code: 'BE',
    flag: '🇧🇪',
    languages: ['fr', 'nl'],
    lines: [
      {
        name: 'Centre de Prévention du Suicide',
        phone: '0800 32 123',
        description: 'Prévention du suicide et aide psychologique — écoute professionnelle',
        available: '24/7',
        type: 'phone',
        url: 'https://www.preventionsuicide.be',
      },
      {
        name: '112 — Urgences',
        phone: '112',
        description: 'Numéro d\'urgence européen',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Ecoute Enfants',
        phone: '103',
        description: 'Aide et écoute pour les enfants et les jeunes',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat prévention suicide',
        description: 'Chat en ligne de prévention du suicide',
        available: '24/7',
        type: 'chat',
        url: 'https://www.preventionsuicide.be',
      },
    ],
  },
  {
    name: 'Suisse',
    code: 'CH',
    flag: '🇨🇭',
    languages: ['fr', 'de', 'it'],
    lines: [
      {
        name: 'La Main Tendue',
        phone: '143',
        description: 'Écoute et soutien psychologique — aide en cas de détresse',
        available: '24/7',
        type: 'phone',
        url: 'https://www.143.ch',
      },
      {
        name: '144 — Urgences médicales',
        phone: '144',
        description: 'Numéro d\'urgence médicale — ambulances et secours',
        available: '24/7',
        type: 'phone',
      },
      {
        name: 'Chat La Main Tendue',
        description: 'Chat en ligne pour écoute et soutien psychologique',
        available: '24/7',
        type: 'chat',
        url: 'https://www.143.ch',
      },
    ],
  },
];

// ── Timezone-to-country mapping for location detection ────────────────

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'America/Mexico_City': 'MX',
  'America/Cancun': 'MX',
  'America/Merida': 'MX',
  'America/Monterrey': 'MX',
  'America/Mazatlan': 'MX',
  'America/Chihuahua': 'MX',
  'America/Tijuana': 'MX',
  'America/Bogota': 'CO',
  'America/Buenos_Aires': 'AR',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Argentina/Cordoba': 'AR',
  'America/Argentina/Mendoza': 'AR',
  'America/Santiago': 'CL',
  'Europe/Madrid': 'ES',
  'America/Lima': 'PE',
  'America/Guayaquil': 'EC',
  'America/Caracas': 'VE',
  'America/Montevideo': 'UY',
  'America/Costa_Rica': 'CR',
  'America/Panama': 'PA',
  'America/Guatemala': 'GT',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'Pacific/Honolulu': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Edmonton': 'CA',
  'America/Winnipeg': 'CA',
  'America/Halifax': 'CA',
  'Europe/London': 'GB',
  'Europe/Dublin': 'IE',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Australia/Adelaide': 'AU',
  'Australia/Hobart': 'AU',
  'America/Sao_Paulo': 'BR',
  'America/Rio_Branco': 'BR',
  'America/Manaus': 'BR',
  'America/Fortaleza': 'BR',
  'America/Recife': 'BR',
  'America/Salvador': 'BR',
  'America/Belem': 'BR',
  'America/Cuiaba': 'BR',
  'America/Campo_Grande': 'BR',
  'Europe/Lisbon': 'PT',
  'Atlantic/Azores': 'PT',
  'Atlantic/Madeira': 'PT',
  'Europe/Paris': 'FR',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Africa/Casablanca': 'MA',
  'Indian/Reunion': 'RE',
};

/**
 * Detect user's likely country based on browser timezone.
 * Returns an ISO country code or null.
 */
export function detectUserCountry(): string | null {
  if (typeof window === 'undefined' || !Intl?.DateTimeFormat) return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_COUNTRY_MAP[tz] ?? null;
  } catch {
    return null;
  }
}

/**
 * Sort crisis lines data so that:
 * 1. Countries matching the selected language appear first
 * 2. If the user's detected country is NOT in the language group,
 *    it appears right after the language group (e.g. a Canadian in Mexico)
 * 3. All other countries come last
 */
export function sortCountriesByLanguage(
  countries: CountryCrisisLines[],
  language: Language,
  userCountryCode?: string | null,
): { languageMatches: CountryCrisisLines[]; otherCountries: CountryCrisisLines[] } {
  const languageMatches = countries.filter((c) => c.languages.includes(language));
  const otherCountries = countries.filter((c) => !c.languages.includes(language));

  // If user's detected country is in the "other" group, promote it to the top of otherCountries
  if (userCountryCode) {
    const userCountryIdx = otherCountries.findIndex((c) => c.code === userCountryCode);
    if (userCountryIdx !== -1) {
      const [userCountry] = otherCountries.splice(userCountryIdx, 1);
      // Insert right after language matches (at top of other countries)
      otherCountries.unshift(userCountry);
    }
  }

  return { languageMatches, otherCountries };
}

/**
 * Get crisis lines for a specific country by ISO code
 */
export function getCrisisLinesByCountry(code: string): CountryCrisisLines | undefined {
  return crisisLinesData.find((c) => c.code === code);
}

/**
 * Get all country codes available
 */
export function getAvailableCountryCodes(): string[] {
  return crisisLinesData.map((c) => c.code);
}

/**
 * Search crisis lines by country name (partial match)
 */
export function searchCrisisLines(query: string): CountryCrisisLines[] {
  const lower = query.toLowerCase();
  return crisisLinesData.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.code.toLowerCase().includes(lower)
  );
}

/**
 * i18n translations for the crisis lines component
 */
export const crisisLinesTranslations: Record<Language, {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  allCountries: string;
  emergencyDisclaimer: string;
  callNow: string;
  chatNow: string;
  textNow: string;
  visitWebsite: string;
  available: string;
  phone: string;
  chat: string;
  text: string;
  reassuranceMessage: string;
  reassuranceSubtext: string;
  closeButton: string;
  noResults: string;
  yourLanguageCountries: string;
  otherCountries: string;
  yourLocationBadge: string;
  yourLanguageBadge: string;
}> = {
  es: {
    title: 'Líneas de Crisis',
    subtitle: 'Ayuda profesional disponible ahora',
    searchPlaceholder: 'Buscar país...',
    allCountries: 'Todos los países',
    emergencyDisclaimer: 'Si estás en peligro inmediato, llama a los servicios de emergencia de tu país (911, 112, etc.). Esta información es de referencia y no sustituye la atención médica de emergencia.',
    callNow: 'Llamar ahora',
    chatNow: 'Chatear ahora',
    textNow: 'Enviar texto',
    visitWebsite: 'Visitar sitio web',
    available: 'Disponible',
    phone: 'Teléfono',
    chat: 'Chat',
    text: 'Texto',
    reassuranceMessage: 'No estás sol@',
    reassuranceSubtext: 'Hay personas que quieren ayudarte. No dudes en buscar apoyo.',
    closeButton: 'Cerrar',
    noResults: 'No se encontraron resultados para tu búsqueda.',
    yourLanguageCountries: 'Países en tu idioma',
    otherCountries: 'Otros países',
    yourLocationBadge: 'Tu ubicación',
    yourLanguageBadge: 'Tu idioma',
  },
  en: {
    title: 'Crisis Lines',
    subtitle: 'Professional help available now',
    searchPlaceholder: 'Search country...',
    allCountries: 'All countries',
    emergencyDisclaimer: 'If you are in immediate danger, call your local emergency services (911, 112, etc.). This information is for reference only and does not replace emergency medical care.',
    callNow: 'Call now',
    chatNow: 'Chat now',
    textNow: 'Text now',
    visitWebsite: 'Visit website',
    available: 'Available',
    phone: 'Phone',
    chat: 'Chat',
    text: 'Text',
    reassuranceMessage: 'You are not alone',
    reassuranceSubtext: 'There are people who want to help you. Don\'t hesitate to reach out for support.',
    closeButton: 'Close',
    noResults: 'No results found for your search.',
    yourLanguageCountries: 'Countries in your language',
    otherCountries: 'Other countries',
    yourLocationBadge: 'Your location',
    yourLanguageBadge: 'Your language',
  },
  pt: {
    title: 'Linhas de Crise',
    subtitle: 'Ajuda profissional disponível agora',
    searchPlaceholder: 'Buscar país...',
    allCountries: 'Todos os países',
    emergencyDisclaimer: 'Se você está em perigo imediato, ligue para os serviços de emergência do seu país (192, 193, etc.). Esta informação é de referência e não substitui o atendimento médico de emergência.',
    callNow: 'Ligar agora',
    chatNow: 'Conversar agora',
    textNow: 'Enviar mensagem',
    visitWebsite: 'Visitar site',
    available: 'Disponível',
    phone: 'Telefone',
    chat: 'Chat',
    text: 'Texto',
    reassuranceMessage: 'Você não está sozinho',
    reassuranceSubtext: 'Existem pessoas que querem te ajudar. Não hesite em buscar apoio.',
    closeButton: 'Fechar',
    noResults: 'Nenhum resultado encontrado para sua busca.',
    yourLanguageCountries: 'Países no seu idioma',
    otherCountries: 'Outros países',
    yourLocationBadge: 'Sua localização',
    yourLanguageBadge: 'Seu idioma',
  },
  fr: {
    title: 'Lignes de Crise',
    subtitle: 'Aide professionnelle disponible maintenant',
    searchPlaceholder: 'Rechercher un pays...',
    allCountries: 'Tous les pays',
    emergencyDisclaimer: 'Si vous êtes en danger immédiat, appelez les services d\'urgence de votre pays (15, 112, 911, etc.). Ces informations sont fournies à titre indicatif et ne remplacent pas les soins médicaux d\'urgence.',
    callNow: 'Appeler maintenant',
    chatNow: 'Discuter maintenant',
    textNow: 'Envoyer un SMS',
    visitWebsite: 'Visiter le site web',
    available: 'Disponible',
    phone: 'Téléphone',
    chat: 'Chat',
    text: 'SMS',
    reassuranceMessage: 'Vous n\'êtes pas seul(e)',
    reassuranceSubtext: 'Il y a des personnes qui veulent vous aider. N\'hésitez pas à demander de l\'aide.',
    closeButton: 'Fermer',
    noResults: 'Aucun résultat trouvé pour votre recherche.',
    yourLanguageCountries: 'Pays dans votre langue',
    otherCountries: 'Autres pays',
    yourLocationBadge: 'Votre localisation',
    yourLanguageBadge: 'Votre langue',
  },
};
