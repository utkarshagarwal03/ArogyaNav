import {
  DEPARTMENTS, H2_DEPARTMENTS,
  HOSPITAL_INFO, HOSPITAL2_INFO,
} from './hospitalData';

// ── Symptom → department shortName mapping (hospital-agnostic keywords) ────────
// We match by shortName so it works for both H1 and H2 departments dynamically.
const SYMPTOM_MAP = [
  { keywords: ['vomit', 'vomiting', 'nausea', 'stomach ache', 'stomach pain', 'abdominal pain', 'diarrhea', 'loose motion', 'acidity', 'indigestion', 'food poisoning', 'gas', 'ulcer', 'gastro', 'gut', 'fever', 'sick', 'unwell', 'doctor consultation', 'opd', 'general checkup', 'consultation', 'checkup'],
    shortNames: ['OPD', 'Emergency'], primary: 'OPD',
    rec: 'For stomach, fever, or general symptoms, visit the **OPD (Outpatient Department)** on the 1st Floor. If severe, head directly to **Emergency**.' },
  { keywords: ['chest pain', 'heart attack', 'cardiac', 'breathless', 'palpitations', 'heart', 'bp', 'blood pressure', 'angina', 'heart failure'],
    shortNames: ['Cardiology', 'Emergency'], primary: 'Cardiology',
    rec: 'For heart or chest symptoms, visit the **Cardiology** department. If urgent or severe, go directly to **Emergency**.' },
  { keywords: ['accident', 'bleeding', 'emergency', 'trauma', 'unconscious', 'severe pain', 'snake bite', 'poison', 'burn', 'choking', 'faint', 'critical'],
    shortNames: ['Emergency'], primary: 'Emergency',
    rec: '**Emergency & Trauma** provides 24/7 immediate critical care. Proceed there right away.' },
  { keywords: ['x-ray', 'xray', 'mri', 'ct scan', 'ultrasound', 'scan', 'imaging', 'radiology', 'sonography'],
    shortNames: ['Radiology'], primary: 'Radiology',
    rec: 'All imaging services (MRI, CT, Ultrasound, X-Ray) are in the **Radiology** department on Ground Floor.' },
  { keywords: ['blood test', 'urine test', 'lab', 'pathology', 'report', 'test result', 'blood work', 'sample', 'cbc', 'sugar test'],
    shortNames: ['Lab'], primary: 'Lab',
    rec: '**Diagnostics & Lab** sample collection is on Ground Floor. Walk in without appointment.' },
  { keywords: ['bone', 'fracture', 'joint pain', 'back pain', 'knee', 'spine', 'ortho', 'sprain', 'ligament', 'arthritis'],
    shortNames: ['Orthopaedics'], primary: 'Orthopaedics',
    rec: 'For bone, joint, or spine concerns visit **Orthopaedics** department.' },
  { keywords: ['child', 'baby', 'kid', 'infant', 'pediatric', 'paediatric', 'vaccination', 'vaccine', 'newborn', 'nicu'],
    shortNames: ['Paediatrics'], primary: 'Paediatrics',
    rec: 'For child health, immunisation, or neonatal care visit the **Paediatrics & NICU** department.' },
  { keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'paralysis', 'nerve', 'brain', 'neurology', 'neuro', 'numbness', 'stroke'],
    shortNames: ['Neurology'], primary: 'Neurology',
    rec: 'For brain, nerve, or stroke care visit the **Neurology** department.' },
  { keywords: ['skin', 'rash', 'itching', 'eczema', 'allergy', 'hives', 'boil', 'fungal', 'acne', 'dermatology'],
    shortNames: ['Dermatology'], primary: 'Dermatology',
    rec: 'For skin rashes, allergies, or cosmetic concerns visit **Dermatology** on 1st Floor.' },
  { keywords: ['ear pain', 'ear ache', 'sore throat', 'nasal', 'sinus', 'tonsil', 'hearing', 'nosebleed', 'throat', 'ent', 'cold', 'cough', 'flu'],
    shortNames: ['ENT'], primary: 'ENT',
    rec: 'For cold, cough, ear pain, or throat concerns visit the **ENT** department.' },
  { keywords: ['eye pain', 'vision', 'blur', 'red eye', 'cataract', 'eye', 'conjunctivitis', 'optical'],
    shortNames: ['Eye Care'], primary: 'Eye Care',
    rec: 'For eye irritation, vision tests, or cataract care visit **Eye Care / Ophthalmology**.' },
  { keywords: ['toothache', 'teeth', 'gum pain', 'dental', 'cavity', 'root canal', 'braces'],
    shortNames: ['Dental'], primary: 'Dental',
    rec: 'For tooth pain or dental procedures, visit the **Dental** department on 1st Floor.' },
  { keywords: ['pregnancy', 'period pain', 'menstrual', 'gynae', 'gynecology', 'maternity', 'pregnant', 'delivery', 'obstetrics'],
    shortNames: ['Maternity', 'Gynaecology'], primary: 'Maternity',
    rec: 'For pregnancy or gynaecological care, visit **Obstetrics & Maternity** on 2nd Floor.' },
  { keywords: ['dialysis', 'kidney failure', 'renal', 'kidney stone', 'kidney pain', 'nephrology'],
    shortNames: ['Dialysis'], primary: 'Dialysis',
    rec: 'For kidney care or dialysis, visit **Nephrology & Dialysis** on 2nd Floor.' },
  { keywords: ['cancer', 'oncology', 'chemo', 'chemotherapy', 'radiation', 'tumor', 'biopsy', 'lump'],
    shortNames: ['Oncology'], primary: 'Oncology',
    rec: 'For cancer treatment or oncology consultations, visit the **Oncology & Cancer Centre**.' },
  { keywords: ['surgery', 'operation', 'robotic surgery', 'laparoscopic', 'ot complex', 'surgical'],
    shortNames: ['Surgery'], primary: 'Surgery',
    rec: 'For surgical evaluation and pre-op holding, visit the **Surgical OT Complex**.' },
  { keywords: ['blood bank', 'plasma', 'donor', 'blood donor', 'platelet', 'blood unit'],
    shortNames: ['Blood Bank'], primary: 'Blood Bank',
    rec: 'The **Blood Bank & Plasma Centre** is available 24/7 at Basement Level.' },
  { keywords: ['organ transplant', 'liver transplant', 'kidney transplant', 'transplant'],
    shortNames: ['Transplant'], primary: 'Transplant',
    rec: 'For organ transplant evaluation, visit the **Transplant & Organ Care** unit.' },
  { keywords: ['billing', 'insurance', 'claim', 'tpa', 'cashless', 'payment', 'bill'],
    shortNames: ['Billing'], primary: 'Billing',
    rec: 'For cashless approvals, insurance claims, and billing, visit the **Billing & Insurance Desk** on Ground Floor.' },
  { keywords: ['anxiety', 'stress', 'depression', 'panic', 'insomnia', 'sleep', 'mental health', 'psychiatry', 'counseling'],
    shortNames: ['Psychiatry'], primary: 'Psychiatry',
    rec: 'For mental health support or counseling, visit **Psychiatry & Behavioral Health**.' },
  { keywords: ['medicine', 'pharmacy', 'chemist', 'pills', 'prescription', 'meds', 'tablet'],
    shortNames: ['Pharmacy'], primary: 'Pharmacy',
    rec: 'The 24/7 **Pharmacy** is on Ground Floor near the Main Entrance.' },
  { keywords: ['food', 'lunch', 'coffee', 'snack', 'cafeteria', 'canteen', 'eat', 'juice'],
    shortNames: ['Cafeteria'], primary: 'Cafeteria',
    rec: 'The **Cafeteria** serves hot meals, coffee, and refreshments on Ground Floor.' },
  { keywords: ['physio', 'rehab', 'exercise', 'muscle pain', 'physical therapy'],
    shortNames: ['Physio'], primary: 'Physio',
    rec: '**Physiotherapy & Rehabilitation** is on 1st Floor.' },
  { keywords: ['wheelchair', 'stretcher', 'mobility', 'handicap', 'disabled', 'assistance'],
    shortNames: ['Wheelchair Desk', 'Parking'], primary: 'Wheelchair Desk',
    rec: 'Free **wheelchairs** and attendant support are available at the Ground Floor entrance.' },
  { keywords: ['parking', 'car park', 'vehicle', 'valet'],
    shortNames: ['Parking'], primary: 'Parking',
    rec: 'Multi-level **visitor parking** is available at Basement Level. Valet is at the main gate.' },
  { keywords: ['icu', 'intensive care', 'critical care', 'ventilator'],
    shortNames: ['ICU'], primary: 'ICU',
    rec: 'The **ICU & Critical Care** unit is on 2nd Floor for critical monitoring and ventilator support.' },
];

// ── Hospital-specific FAQ lists ────────────────────────────────────────────────
const FAQ_H1 = [
  { keywords: ['visiting hours', 'visitor time', 'timing', 'visit time'],
    answer: '🕒 **Manipal Hospital Visiting Hours:**\n• General Wards: 4:00 PM – 7:00 PM daily\n• ICU & Cath Lab: 11:00 AM – 12:00 PM & 5:00 PM – 6:00 PM (1 visitor).' },
  { keywords: ['contact', 'phone', 'helpline', 'emergency number', 'call'],
    answer: '📞 **Manipal Hospital Helplines:**\n• Toll-Free: **1800 102 5555**\n• Direct: **(080) 2502 4444**\n• Address: 98, HAL Old Airport Rd, Kodihalli, Bengaluru' },
  { keywords: ['registration', 'opd counter', 'token', 'book appointment'],
    answer: '📝 **Registration:** First-time patients register at the **Central Atrium Help Desk (Ground Floor, Tower A)**.' },
];

const FAQ_H2 = [
  { keywords: ['visiting hours', 'visitor time', 'timing', 'visit time'],
    answer: '🕒 **Apollo Hospital Visiting Hours:**\n• General Wards: 4:00 PM – 7:00 PM daily\n• ICU & Critical Care: 10:00 AM – 11:00 AM & 5:00 PM – 6:00 PM (1 visitor).' },
  { keywords: ['contact', 'phone', 'helpline', 'emergency number', 'call'],
    answer: '📞 **Apollo Hospitals Helplines:**\n• Toll-Free: **1800 599 1066**\n• Direct: **(044) 2829 3333**\n• Address: 21, Greams Lane, Off Greams Rd, Thousand Lights, Chennai' },
  { keywords: ['registration', 'opd counter', 'token', 'book appointment'],
    answer: '📝 **Registration:** New patients register at the **Main Entrance & Registration Desk (Ground Floor, Block A)**.' },
];

// ── Resolve which hospital a location belongs to ──────────────────────────────
function resolveHospital(currentLocation) {
  if (currentLocation?.id?.startsWith('H2-')) return 'H2';
  return 'H1';
}

// ── Main AI query processor ───────────────────────────────────────────────────
export function processAiQuery(userText, allDoctors = [], currentLocation = null) {
  const query = userText.toLowerCase().trim();

  const hospitalId   = resolveHospital(currentLocation);
  const isApollo     = hospitalId === 'H2';
  const departments  = isApollo ? H2_DEPARTMENTS : DEPARTMENTS;
  const hospitalInfo = isApollo ? HOSPITAL2_INFO : HOSPITAL_INFO;
  const faqList      = isApollo ? FAQ_H2 : FAQ_H1;

  // Filter doctors to the active hospital
  const doctors = allDoctors.filter(d => {
    if (isApollo) return d.id.startsWith('H2-');
    return !d.id.startsWith('H2-');
  });

  const hospitalName = hospitalInfo.name;
  const exampleDoc   = doctors[0]?.name || (isApollo ? 'Dr. Arjun Nair' : 'Dr. Rajesh Sharma');

  // 1. Greeting
  if (['hi', 'hello', 'hey', 'start', 'help', 'good morning', 'good afternoon'].includes(query)) {
    return {
      text: `Hello! I am **Navi AI**, your smart hospital assistant for **${hospitalName}**. 🏥\n\nAsk about symptoms, find departments, or check doctor availability!`,
      suggestions: [`Is ${exampleDoc} available?`, 'I have chest pain', 'Where is Pharmacy?', 'Visiting hours'],
    };
  }

  // 2. Named doctor check
  if (doctors.length > 0) {
    const matchedDoc = doctors.find(d => {
      const nameLower = d.name.toLowerCase();
      const lastName  = nameLower.split(' ').pop();
      const firstName = nameLower.replace('dr.', '').trim().split(' ')[0];
      return query.includes(nameLower) ||
        (lastName && lastName.length > 3 && query.includes(lastName)) ||
        (firstName && firstName.length > 3 && query.includes(firstName));
    });

    if (matchedDoc) {
      const dept = departments.find(d => d.id === matchedDoc.deptId);
      const otherAvailable = doctors.filter(d =>
        d.deptId === matchedDoc.deptId && d.id !== matchedDoc.id && d.status === 'available'
      );

      if (matchedDoc.status === 'available') {
        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🟢 **Available Today**\n• Department: **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n\nDoctor is currently available for consultation.`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, 'Show doctor attendance', 'Visiting hours'],
        };
      } else if (matchedDoc.status === 'in_surgery') {
        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🟡 **In Surgery / Consultation**\n• Department: **${dept?.name}** (${dept?.floor}, ${dept?.wing})\n\nDoctor is currently in a surgery or OPD consultation. You can wait in the department lounge.`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, 'Visiting hours'],
        };
      } else {
        const altText = otherAvailable.length > 0
          ? `\n\nOther available specialists in **${dept?.name}**:\n${otherAvailable.map(d => `• 🟢 **${d.name}** (${d.spec})`).join('\n')}`
          : `\n\nNo other specialists are currently on duty in this department.`;
        return {
          text: `👨‍⚕️ **${matchedDoc.name}** (${matchedDoc.spec})\n• Status: 🔴 **On Leave Today**${altText}`,
          targetDepartment: dept,
          suggestions: [`Navigate to ${dept?.shortName}`, 'Emergency Care', 'Visiting hours'],
        };
      }
    }
  }

  // 3. Symptom / department keyword match
  for (const item of SYMPTOM_MAP) {
    if (item.keywords.some(kw => query.includes(kw))) {
      // Find matching dept by shortName within this hospital's departments
      const dept = departments.find(d =>
        d.shortName === item.primary ||
        item.shortNames.includes(d.shortName)
      );
      if (!dept) continue;

      const deptDocs      = doctors.filter(d => d.deptId === dept.id);
      const availableDocs = deptDocs.filter(d => d.status === 'available');
      const docInfo = availableDocs.length > 0
        ? `\n\n👨‍⚕️ **Available Doctors On Duty:**\n${availableDocs.map(d => `• 🟢 **${d.name}** (${d.spec})`).join('\n')}`
        : '';

      return {
        text: `Based on your query, here is the recommended department at **${hospitalName}**:\n\n📍 **${dept.name}** (${dept.floor}, ${dept.wing})\n${item.rec}${docInfo}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept.shortName}`, 'Show all departments', 'Visiting hours'],
      };
    }
  }

  // 4. FAQ check
  for (const faq of faqList) {
    if (faq.keywords.some(kw => query.includes(kw))) {
      return {
        text: faq.answer,
        suggestions: ['Find Emergency', 'Where is Pharmacy?', 'OPD Consultation'],
      };
    }
  }

  // 5. Department name direct match
  for (const dept of departments) {
    if (query.includes(dept.shortName.toLowerCase()) || query.includes(dept.name.toLowerCase())) {
      const deptDocs      = doctors.filter(d => d.deptId === dept.id);
      const availableDocs = deptDocs.filter(d => d.status === 'available');
      const docInfo = availableDocs.length > 0
        ? `\n• Available Doctors: ${availableDocs.map(d => d.name).join(', ')}`
        : '';
      return {
        text: `📍 **${dept.name}**\n• Location: ${dept.floor}, ${dept.wing}\n• ${dept.description}${docInfo}`,
        targetDepartment: dept,
        suggestions: [`Navigate to ${dept.shortName}`, 'Show other departments'],
      };
    }
  }

  // 6. Fallback to OPD
  const defaultOpd = departments.find(d => d.shortName === 'OPD') || departments[0];
  return {
    text: `For general symptoms or feeling unwell, please visit the **OPD (Outpatient Department)** for a doctor consultation at **${hospitalName}**. If experiencing acute distress, head directly to **Emergency & Trauma**.`,
    targetDepartment: defaultOpd,
    suggestions: ['Navigate to OPD', 'Emergency Care', 'Pharmacy location', 'Visiting hours'],
  };
}
