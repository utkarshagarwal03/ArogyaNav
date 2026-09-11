import { DEPARTMENTS } from './hospitalData';

// Comprehensive Symptom & intent mapping database for Manipal Hospital HAL Road Bengaluru
const SYMPTOM_MAP = [
  {
    keywords: ['vomit', 'vomiting', 'nausea', 'stomach ache', 'stomach pain', 'abdominal pain', 'diarrhea', 'loose motion', 'acidity', 'indigestion', 'food poisoning', 'gas', 'ulcer', 'gastro', 'gut', 'fever'],
    deptId: 'DEPT-002', // OPD / General Medicine
    recommendation: 'For symptoms like vomiting, nausea, stomach pain, fever, or digestive discomfort, visit Outpatient Department (OPD) Consultation on 1st Floor, Wing C. If vomiting is severe or accompanied by extreme weakness, proceed directly to Emergency Block B.'
  },
  {
    keywords: ['chest pain', 'heart attack', 'cardiac', 'breathless', 'palpitations', 'heart', 'bp', 'blood pressure', 'angina'],
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
    recommendation: 'Central Diagnostics Lab & sample collection counter is located on Ground Floor, Block B.'
  },
  {
    keywords: ['bone', 'fracture', 'joint pain', 'back pain', 'knee', 'spine', 'ortho', 'sprain', 'ligament', 'arthritis'],
    deptId: 'DEPT-006', // Orthopaedics
    recommendation: 'For bone, joint, or spine concerns, visit Orthopaedics & Spine Center on 3rd Floor, Wing E.'
  },
  {
    keywords: ['child', 'baby', 'kid', 'infant', 'pediatric', 'paediatric', 'vaccination', 'vaccine', 'newborn'],
    deptId: 'DEPT-008', // Paediatrics
    recommendation: 'Paediatric care and child immunisation are available at Paediatrics & NICU Suite on 2nd Floor, Wing C.'
  },
  {
    keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'paralysis', 'nerve', 'brain', 'neurology', 'neuro', 'numbness', 'stroke'],
    deptId: 'DEPT-009', // Neurology
    recommendation: 'For brain, nerve, stroke, or severe headache care, visit Neurology on 3rd Floor, Wing D.'
  },
  {
    keywords: ['skin', 'rash', 'itching', 'eczema', 'allergy', 'hives', 'boil', 'fungal', 'acne', 'dermatology'],
    deptId: 'DEPT-017', // Dermatology
    recommendation: 'For skin rashes, allergies, or dermatological consultations, visit Dermatology & Skin Center on 1st Floor, Wing C.'
  },
  {
    keywords: ['ear pain', 'ear ache', 'sore throat', 'nasal', 'sinus', 'tonsil', 'hearing', 'nosebleed', 'throat', 'ent', 'cold', 'cough', 'flu'],
    deptId: 'DEPT-015', // ENT
    recommendation: 'For throat infection, cold, cough, ear pain, or ENT concerns, visit ENT Care Suite on 1st Floor, Wing C.'
  },
  {
    keywords: ['eye pain', 'vision', 'blur', 'red eye', 'cataract', 'eye', 'conjunctivitis', 'optical'],
    deptId: 'DEPT-016', // Ophthalmology
    recommendation: 'For eye irritation, vision tests, or ophthalmology checkups, visit Ophthalmology & Eye Care on 1st Floor, Wing C.'
  },
  {
    keywords: ['toothache', 'teeth', 'gum pain', 'dental', 'cavity', 'root canal', 'braces'],
    deptId: 'DEPT-018', // Dental
    recommendation: 'For tooth pain or dental procedures, visit Dental & Maxillofacial Care on 1st Floor, Wing C.'
  },
  {
    keywords: ['pregnancy', 'period pain', 'menstrual', 'gynae', 'gynecology', 'maternity', 'pregnant', 'delivery'],
    deptId: 'DEPT-019', // Gynaecology
    recommendation: 'For maternity, pregnancy care, or gynaecological checkups, visit Obstetrics & Gynaecology on 2nd Floor, Wing C.'
  },
  {
    keywords: ['dialysis', 'kidney failure', 'renal', 'kidney stone', 'kidney pain', 'nephrology'],
    deptId: 'DEPT-014', // Nephrology & Dialysis
    recommendation: 'For kidney care or hemodialysis, visit Nephrology & Dialysis Center on 2nd Floor, Wing D.'
  },
  {
    keywords: ['cancer', 'oncology', 'chemo', 'chemotherapy', 'radiation', 'tumor', 'biopsy', 'lump'],
    deptId: 'DEPT-013', // Oncology
    recommendation: 'For cancer treatment, chemotherapy, or oncology consultations, visit Oncology & Cancer Care on 3rd Floor, Wing E.'
  },
  {
    keywords: ['surgery', 'operation', 'robotic surgery', 'laparoscopic', 'ot complex'],
    deptId: 'DEPT-010', // Robotic Surgery
    recommendation: 'For surgical evaluation and pre-op holding, visit Robotic & General Surgery OT Complex on 4th Floor, Wing F.'
  },
  {
    keywords: ['blood bank', 'plasma', 'donor', 'blood donor', 'platelet', 'blood unit'],
    deptId: 'DEPT-021', // Blood Bank
    recommendation: 'The Central Blood Bank & Plasma Unit is operational 24/7 at Basement Level B1.'
  },
  {
    keywords: ['organ transplant', 'liver transplant', 'kidney transplant', 'transplant', 'donation'],
    deptId: 'DEPT-022', // Organ Transplant
    recommendation: 'For organ transplant evaluation and recovery ICU, visit Organ Transplant Unit on 4th Floor, Wing F.'
  },
  {
    keywords: ['billing', 'insurance', 'claim', 'tpa', 'cashless', 'payment desk', 'bill refund'],
    deptId: 'DEPT-024', // Billing & Insurance
    recommendation: 'For cashless approvals, insurance claim processing, and billing, visit Billing, Insurance & TPA Desk on Ground Floor, Tower A.'
  },
  {
    keywords: ['anxiety', 'stress', 'depression', 'panic', 'insomnia', 'sleep', 'mental health', 'psychiatry'],
    deptId: 'DEPT-020', // Psychiatry
    recommendation: 'For mental health support, counseling, or sleep consultations, visit Psychiatry & Behavioral Health on 1st Floor, Wing C.'
  },
  {
    keywords: ['medicine', 'pharmacy', 'chemist', 'pills', 'prescription', 'drugstore', 'meds', 'tablet'],
    deptId: 'DEPT-007', // Pharmacy
    recommendation: 'Manipal 24/7 In-House Pharmacy is located on Ground Floor, Tower A near the Main Entrance.'
  },
  {
    keywords: ['food', 'lunch', 'coffee', 'tea', 'snack', 'cafeteria', 'canteen', 'eat', 'restaurant', 'juice'],
    deptId: 'DEPT-012', // Cafeteria
    recommendation: 'The Garden Court Cafeteria serves hot meals, coffee, and refreshments on Ground Floor, Block B.'
  },
  {
    keywords: ['physio', 'rehab', 'exercise', 'muscle pain', 'physical therapy'],
    deptId: 'DEPT-011', // Physiotherapy
    recommendation: 'Physiotherapy & Rehabilitation Center is located on 1st Floor, Block B.'
  },
  {
    keywords: ['wheelchair', 'stretchers', 'mobility', 'handicap', 'disabled', 'assistance desk'],
    deptId: 'DEPT-025', // Wheelchair Desk
    recommendation: 'Free wheelchairs and mobility support attendants are available at Wheelchair Desk on Ground Floor, Tower A Portico.'
  },
  {
    keywords: ['doctor consultation', 'opd', 'general checkup', 'consultation', 'checkup', 'sick', 'unwell'],
    deptId: 'DEPT-002', // OPD
    recommendation: 'OPD specialist consultation clinics are located on 1st Floor, Wing C.'
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

export function processAiQuery(userText, doctors = []) {
  const query = userText.toLowerCase().trim();

  // 1. Direct greeting check
  if (['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good afternoon'].includes(query)) {
    return {
      text: "Hello! I am **Navi AI**, your assistant for **Manipal Hospital, HAL Old Airport Road, Bengaluru**. 🏥\n\nHow can I help you navigate or find care today?",
      suggestions: ["Is Dr. Rajesh Sharma available?", "I am vomiting / stomach pain", "Where is Pharmacy?", "Visiting hours"]
    };
  }

  // 2. Specific Named Doctor Check (e.g. "meet Dr. Rajesh", "Dr. Anita Deshmukh available?", "is Dr. Priya on leave?")
  if (doctors.length > 0) {
    const matchedDoc = doctors.find(d => {
      const nameLower = d.name.toLowerCase();
      const lastName  = nameLower.split(' ').pop();
      const firstName = nameLower.replace('dr.', '').trim().split(' ')[0];
      return query.includes(nameLower) || (lastName && lastName.length > 3 && query.includes(lastName)) || (firstName && firstName.length > 3 && query.includes(firstName));
    });

    if (matchedDoc) {
      const dept = DEPARTMENTS.find(d => d.id === matchedDoc.deptId);
      const otherAvailable = doctors.filter(d => d.deptId === matchedDoc.deptId && d.id !== matchedDoc.id && d.status === 'available');

      if (matchedDoc.status === 'available') {
        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🟢 **Available Today**\n• Department: **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n\nDoctor is currently available for consultation.`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, "Show doctor attendance", "Visiting hours"]
        };
      } else if (matchedDoc.status === 'in_surgery') {
        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🟡 **In Surgery / Consultation**\n• Department: **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n\nDoctor is currently attending a surgery or consultation. You can navigate to the department waiting lounge.`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, "Visiting hours"]
        };
      } else {
        // On Leave
        const altText = otherAvailable.length > 0
          ? `\n\nOther available specialists in **${dept?.name}**:\n${otherAvailable.map(d => `• 🟢 **${d.name}** (${d.spec})`).join('\n')}`
          : `\n\nNo other specialists are currently on duty in this department.`;

        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🔴 **On Leave Today**${altText}`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, "Emergency Care", "Visiting hours"]
        };
      }
    }
  }

  // 3. Symptom / Department search
  for (const item of SYMPTOM_MAP) {
    if (item.keywords.some(kw => query.includes(kw))) {
      const dept = DEPARTMENTS.find(d => d.id === item.deptId);
      const deptDocs = doctors.filter(d => d.deptId === dept?.id);
      const availableDocs = deptDocs.filter(d => d.status === 'available');

      let docInfo = '';
      if (availableDocs.length > 0) {
        docInfo = `\n\n👨‍⚕️ **Available Doctors On Duty**:\n${availableDocs.map(d => `• 🟢 **${d.name}** (${d.spec})`).join('\n')}`;
      }

      return {
        text: `Based on your query, here is the recommended department at Manipal Hospital:\n\n📍 **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n${item.recommendation}${docInfo}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept?.shortName}`, "Show all departments", "Visiting hours"]
      };
    }
  }

  // 4. FAQ check
  for (const faq of FAQ_LIST) {
    if (faq.keywords.some(kw => query.includes(kw))) {
      return {
        text: faq.answer,
        suggestions: ["Find Emergency", "Where is Pharmacy?", "OPD Consultation"]
      };
    }
  }

  // 5. Department direct name match
  for (const dept of DEPARTMENTS) {
    if (query.includes(dept.shortName.toLowerCase()) || query.includes(dept.name.toLowerCase())) {
      const deptDocs = doctors.filter(d => d.deptId === dept.id);
      const availableDocs = deptDocs.filter(d => d.status === 'available');

      let docInfo = '';
      if (availableDocs.length > 0) {
        docInfo = `\n• Available Doctors: ${availableDocs.map(d => d.name).join(', ')}`;
      }

      return {
        text: `📍 **${dept.name}**\n• Location: ${dept.floor}, ${dept.wing}\n• Details: ${dept.description}${docInfo}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept.shortName}`, "Show other departments"]
      };
    }
  }

  // 6. Intelligent Medical Fallback
  const defaultOpd = DEPARTMENTS.find(d => d.id === 'DEPT-002'); // OPD
  return {
    text: "For general symptoms or feeling unwell, please visit our **Outpatient Department (OPD)** on the 1st Floor, Wing C for a doctor consultation. If you are experiencing acute severe distress or a medical emergency, head directly to **Emergency & Trauma** (Block B).",
    targetDepartment: defaultOpd,
    suggestions: ["Navigate to OPD", "Emergency Care", "Pharmacy location", "Visiting hours"]
  };
}
