import { DEPARTMENTS } from './hospitalData';

// Comprehensive Symptom & intent mapping database for Manipal Hospital HAL Road Bengaluru
const SYMPTOM_MAP = [
  {
    keywords: ['vomit', 'vomiting', 'nausea', 'stomach ache', 'stomach pain', 'abdominal pain', 'diarrhea', 'loose motion', 'acidity', 'indigestion', 'food poisoning', 'gas', 'ulcer', 'gastro', 'gut'],
    deptId: 'DEPT-002', // OPD / General Medicine
    recommendation: 'For symptoms like vomiting, nausea, stomach pain, or digestive discomfort, please visit Outpatient Department (OPD) Consultation on 1st Floor, Wing C. If vomiting is severe or accompanied by dehydration, visit Emergency Block B immediately.'
  },
  {
    keywords: ['chest pain', 'heart attack', 'cardiac', 'breathless', 'palpitations', 'heart', 'bp', 'blood pressure'],
    deptId: 'DEPT-005', // Cardiology
    recommendation: 'For heart-related symptoms or chest discomfort, visit Cardiology & Cath Lab on 2nd Floor, Wing D. If urgent or severe, proceed directly to Emergency Block B.'
  },
  {
    keywords: ['accident', 'bleeding', 'emergency', 'trauma', 'unconscious', 'severe pain', 'snake bite', 'poison', 'burn', 'choking', 'faint'],
    deptId: 'DEPT-001', // Emergency & Trauma
    recommendation: 'Emergency & Trauma (Block B) provides 24/7 immediate critical care. Proceed there right away.'
  },
  {
    keywords: ['x-ray', 'xray', 'mri', 'ct scan', 'ultrasound', 'scan', 'imaging', 'radiology', 'sonography'],
    deptId: 'DEPT-003', // Radiology
    recommendation: 'All imaging services including 3T MRI, CT Scans, Ultrasound, and X-Rays are located in Radiology & Imaging (Ground Floor, Block B).'
  },
  {
    keywords: ['blood test', 'urine test', 'lab', 'pathology', 'report', 'test result', 'blood work', 'sample', 'cbc', 'sugar test'],
    deptId: 'DEPT-004', // Laboratory
    recommendation: 'Central Diagnostics Lab & sample collection counter is located on Ground Floor, Tower A.'
  },
  {
    keywords: ['bone', 'fracture', 'joint pain', 'back pain', 'knee', 'spine', 'ortho', 'sprain', 'ligament', 'arthritis'],
    deptId: 'DEPT-006', // Orthopaedics
    recommendation: 'For bone, joint, or spine concerns, visit Orthopaedics on the 3rd Floor, Wing E.'
  },
  {
    keywords: ['child', 'baby', 'kid', 'infant', 'pediatric', 'paediatric', 'vaccination', 'vaccine', 'newborn'],
    deptId: 'DEPT-008', // Paediatrics
    recommendation: 'Paediatric care and child immunisation are available on the 2nd Floor, Wing C.'
  },
  {
    keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'paralysis', 'nerve', 'brain', 'neurology', 'neuro', 'numbness', 'stroke'],
    deptId: 'DEPT-009', // Neurology
    recommendation: 'For brain, nerve, stroke, or severe headache care, visit Neurology on the 3rd Floor, Wing D.'
  },
  {
    keywords: ['skin', 'rash', 'itching', 'eczema', 'allergy', 'hives', 'boil', 'fungal', 'acne', 'dermatology'],
    deptId: 'DEPT-002', // OPD / Dermatology
    recommendation: 'For skin rashes, allergies, or dermatological consultations, visit Outpatient Clinics (OPD) on 1st Floor, Wing C.'
  },
  {
    keywords: ['ear pain', 'sore throat', 'nasal', 'sinus', 'tonsil', 'hearing', 'nosebleed', 'throat', 'ent', 'cold', 'cough', 'flu'],
    deptId: 'DEPT-002', // OPD / ENT & General Medicine
    recommendation: 'For throat infection, cold, cough, ear pain, or ENT concerns, visit Outpatient Clinics (OPD) on 1st Floor, Wing C.'
  },
  {
    keywords: ['eye pain', 'vision', 'blur', 'red eye', 'cataract', 'eye', 'conjunctivitis'],
    deptId: 'DEPT-002', // OPD / Ophthalmology
    recommendation: 'For eye irritation, vision tests, or ophthalmology checkups, visit Outpatient Department (OPD) on 1st Floor, Wing C.'
  },
  {
    keywords: ['toothache', 'teeth', 'gum pain', 'dental', 'cavity'],
    deptId: 'DEPT-002', // OPD / Dental
    recommendation: 'For tooth pain or dental procedures, visit Dental OPD on 1st Floor, Wing C.'
  },
  {
    keywords: ['pregnancy', 'period pain', 'menstrual', 'gynae', 'gynecology', 'maternity', 'pregnant'],
    deptId: 'DEPT-002', // OPD / Gynaecology
    recommendation: 'For maternity, pregnancy care, or gynaecological checkups, visit Outpatient Department (OPD) on 1st Floor, Wing C.'
  },
  {
    keywords: ['kidney', 'urine pain', 'burning urination', 'kidney stone', 'bladder'],
    deptId: 'DEPT-002', // OPD / Urology
    recommendation: 'For urinary tract or kidney stone concerns, visit Nephrology & Urology OPD on 1st Floor, Wing C.'
  },
  {
    keywords: ['anxiety', 'stress', 'depression', 'panic', 'insomnia', 'sleep', 'mental health'],
    deptId: 'DEPT-002', // OPD / Behavioral Health
    recommendation: 'For mental health support, stress, or sleep consultations, visit Psychiatry OPD on 1st Floor, Wing C.'
  },
  {
    keywords: ['medicine', 'pharmacy', 'chemist', 'pills', 'prescription', 'drugstore', 'meds', 'tablet'],
    deptId: 'DEPT-007', // Pharmacy
    recommendation: 'Manipal 24/7 In-House Pharmacy is located on the Ground Floor, Tower A near the Main Entrance.'
  },
  {
    keywords: ['food', 'lunch', 'coffee', 'tea', 'snack', 'cafeteria', 'canteen', 'eat', 'restaurant', 'juice'],
    deptId: 'DEPT-012', // Cafeteria
    recommendation: 'The Garden Court Cafeteria serves hot meals, coffee, and refreshments on the Ground Floor, Tower A.'
  },
  {
    keywords: ['physio', 'rehab', 'exercise', 'muscle pain', 'physical therapy'],
    deptId: 'DEPT-011', // Physiotherapy
    recommendation: 'Physiotherapy & Rehabilitation Center is on 1st Floor, Block B.'
  },
  {
    keywords: ['doctor consultation', 'opd', 'general checkup', 'fever', 'consultation', 'checkup', 'sick', 'unwell'],
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
    keywords: ['contact', 'phone number', 'helpline', 'emergency number', 'bengaluru', 'call'],
    answer: '📞 **Manipal Hospital Emergency Helplines**:\n• Toll-Free Emergency: **1800 102 5555**\n• Direct Line: **(080) 2502 4444**\n• Address: 98, HAL Old Airport Rd, Kodihalli, Bengaluru'
  }
];

export function processAiQuery(userText) {
  const query = userText.toLowerCase().trim();

  // 1. Direct greeting check
  if (['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good afternoon'].includes(query)) {
    return {
      text: "Hello! I am **Navi AI**, your assistant for **Manipal Hospital, HAL Old Airport Road, Bengaluru**. 🏥\n\nHow can I help you navigate or find care today?",
      suggestions: ["I am vomiting / stomach pain", "Where is the Pharmacy?", "I have a severe headache", "Visiting hours"]
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

  // 5. Intelligent Medical Fallback for general symptom questions
  const defaultOpd = DEPARTMENTS.find(d => d.id === 'DEPT-002'); // OPD
  return {
    text: "For general symptoms or feeling unwell, please visit our **Outpatient Department (OPD)** on the 1st Floor, Wing C for a doctor consultation. If you are experiencing acute severe distress or a medical emergency, head directly to **Emergency & Trauma** (Block B).",
    targetDepartment: defaultOpd,
    suggestions: ["Navigate to OPD", "Emergency Care", "Pharmacy location", "Visiting hours"]
  };
}
