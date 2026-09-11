import { DEPARTMENTS } from './hospitalData';

// Symptom & intent mapping database for Manipal Hospital HAL Road Bengaluru
const SYMPTOM_MAP = [
  {
    keywords: ['chest pain', 'heart attack', 'cardiac', 'breathless', 'palpitations', 'heart'],
    deptId: 'DEPT-005', // Cardiology
    recommendation: 'For heart-related symptoms or chest discomfort, visit Cardiology & Cath Lab on 2nd Floor, Wing D. If urgent, proceed directly to Emergency Block B.'
  },
  {
    keywords: ['accident', 'bleeding', 'emergency', 'trauma', 'unconscious', 'severe pain', 'snake bite', 'poison', 'burn'],
    deptId: 'DEPT-001', // Emergency & Trauma
    recommendation: 'Emergency & Trauma (Block B) provides 24/7 immediate critical care. Proceed there right away.'
  },
  {
    keywords: ['x-ray', 'xray', 'mri', 'ct scan', 'ultrasound', 'scan', 'imaging', 'radiology'],
    deptId: 'DEPT-003', // Radiology
    recommendation: 'All imaging services including 3T MRI, CT Scans, and X-Rays are located in Radiology & Imaging (Ground Floor, Block B).'
  },
  {
    keywords: ['blood test', 'urine test', 'lab', 'pathology', 'report', 'test result', 'blood work', 'sample'],
    deptId: 'DEPT-004', // Laboratory
    recommendation: 'Central Diagnostics Lab & sample collection counter is located on Ground Floor, Tower A.'
  },
  {
    keywords: ['bone', 'fracture', 'joint pain', 'back pain', 'knee', 'spine', 'ortho', 'sprain', 'ligament'],
    deptId: 'DEPT-006', // Orthopaedics
    recommendation: 'For bone, joint, or spine concerns, visit Orthopaedics on the 3rd Floor, Wing E.'
  },
  {
    keywords: ['child', 'baby', 'kid', 'infant', 'pediatric', 'paediatric', 'vaccination', 'vaccine'],
    deptId: 'DEPT-008', // Paediatrics
    recommendation: 'Paediatric care and child immunisation are available on the 2nd Floor, Wing C.'
  },
  {
    keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'paralysis', 'nerve', 'brain', 'neurology', 'neuro'],
    deptId: 'DEPT-009', // Neurology
    recommendation: 'For brain, nerve, or stroke care, visit Neurology on the 3rd Floor, Wing D.'
  },
  {
    keywords: ['medicine', 'pharmacy', 'chemist', 'pills', 'prescription', 'drugstore', 'meds'],
    deptId: 'DEPT-007', // Pharmacy
    recommendation: 'Manipal 24/7 In-House Pharmacy is located on the Ground Floor, Tower A near the Main Entrance.'
  },
  {
    keywords: ['food', 'lunch', 'coffee', 'tea', 'snack', 'cafeteria', 'canteen', 'eat', 'restaurant'],
    deptId: 'DEPT-012', // Cafeteria
    recommendation: 'The Garden Court Cafeteria serves hot meals, coffee, and refreshments on the Ground Floor, Tower A.'
  },
  {
    keywords: ['physio', 'rehab', 'exercise', 'muscle pain', 'physical therapy'],
    deptId: 'DEPT-011', // Physiotherapy
    recommendation: 'Physiotherapy & Rehabilitation Center is on 1st Floor, Block B.'
  },
  {
    keywords: ['doctor consultation', 'opd', 'general checkup', 'fever', 'cold', 'cough', 'consultation'],
    deptId: 'DEPT-002', // OPD
    recommendation: 'OPD specialist consultation clinics are located on the 1st Floor, Wing C.'
  },
];

// Hospital FAQs
const FAQ_LIST = [
  {
    keywords: ['visiting hours', 'visitor time', 'timing', 'visit time'],
    answer: '🕒 **Manipal Hospital Visiting Hours**:\n• General Wards: 4:00 PM – 7:00 PM daily\n• ICU & Cath Lab: 11:00 AM – 12:00 PM & 5:00 PM – 6:00 PM (1 visitor allowed).'
  },
  {
    keywords: ['wheelchair', 'stretchers', 'handicap', 'disabled', 'assistance'],
    answer: '♿ **Wheelchair & Attendant Support**:\nFree wheelchairs and attendant assistance are available at **Main Portico Gate A** and **Block B Entrance**.'
  },
  {
    keywords: ['parking', 'car park', 'vehicle'],
    answer: '🅿️ **Parking at HAL Road**:\nMulti-level visitor parking is available at Basement Levels B1 & B2. Valet parking is located at Gate 1.'
  },
  {
    keywords: ['registration', 'opd counter', 'token', 'book appointment'],
    answer: '📝 **Registration**:\nFirst-time patients can register at the **Central Atrium Help Desk (Ground Floor, Tower A)**.'
  },
  {
    keywords: ['contact', 'phone number', 'helpline', 'emergency number', 'bengaluru'],
    answer: '📞 **Manipal Hospital Emergency Helplines**:\n• Toll-Free Emergency: **1800 102 5555**\n• Direct Line: **(080) 2502 4444**\n• Address: 98, HAL Old Airport Rd, Kodihalli, Bengaluru'
  }
];

export function processAiQuery(userText) {
  const query = userText.toLowerCase().trim();

  // 1. Direct greeting check
  if (['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good afternoon'].includes(query)) {
    return {
      text: "Hello! I am **Navi AI**, your assistant for **Manipal Hospital, HAL Old Airport Road, Bengaluru**. 🏥\n\nHow can I help you navigate or find care today?",
      suggestions: ["Where is the Pharmacy?", "I have a severe headache", "Visiting hours", "Find Emergency Care"]
    };
  }

  // 2. Symptom / Department search
  for (const item of SYMPTOM_MAP) {
    if (item.keywords.some(kw => query.includes(kw))) {
      const dept = DEPARTMENTS.find(d => d.id === item.deptId);
      return {
        text: `Based on your query, here is the recommended department at Manipal Hospital:\n\n📍 **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n${item.recommendation}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept?.shortName}`, "Show all departments", "Visiting hours"]
      };
    }
  }

  // 3. FAQ check
  for (const faq of FAQ_LIST) {
    if (faq.keywords.some(kw => query.includes(kw))) {
      return {
        text: faq.answer,
        suggestions: ["Find Emergency", "Where is Pharmacy?", "OPD Consultation"]
      };
    }
  }

  // 4. Department direct name match
  for (const dept of DEPARTMENTS) {
    if (query.includes(dept.shortName.toLowerCase()) || query.includes(dept.name.toLowerCase())) {
      return {
        text: `📍 **${dept.name}**\n• Location: ${dept.floor}, ${dept.wing}\n• Details: ${dept.description}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept.shortName}`, "Show other departments"]
      };
    }
  }

  // 5. General Fallback
  return {
    text: "I can help you locate any department at Manipal Hospital HAL Road! Try asking:\n• *'Where is Radiology?'*\n• *'I have joint pain'*\n• *'What are the visiting hours?'*",
    suggestions: ["Pharmacy location", "Emergency Care", "Blood test lab", "Visiting hours"]
  };
}
