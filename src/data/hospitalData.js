// Manipal Hospital, HAL Old Airport Road, Bengaluru — Super-Speciality Campus Layout
export const HOSPITAL_INFO = {
  name: "Manipal Hospital",
  campus: "HAL Old Airport Road, Bengaluru",
  address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017",
  mapsLink: "https://maps.google.com/?q=Manipal+Hospital+HAL+Old+Airport+Road+Bengaluru",
  osmLink: "https://www.openstreetmap.org/search?query=Manipal%20Hospital%20Old%20Airport%20Road%20Bengaluru",
  helpline: "1800 102 5555 / (080) 2502 4444",
  productionUrl: "https://arogya-nav.vercel.app",
};

// 25+ Hospital Wall Checkpoints Across 6 Floors/Wings
export const HOSPITAL_LOCATIONS = {
  "LOC-A1": { id: "LOC-A1", name: "Main Entrance Portico (Tower A)", floor: "Ground Floor", wing: "Tower A" },
  "LOC-A2": { id: "LOC-A2", name: "Central Atrium & Help Desk", floor: "Ground Floor", wing: "Tower A" },
  "LOC-A3": { id: "LOC-A3", name: "Billing & Insurance TPA Desk", floor: "Ground Floor", wing: "Tower A" },
  "LOC-A4": { id: "LOC-A4", name: "Manipal 24/7 Main Pharmacy", floor: "Ground Floor", wing: "Tower A" },
  "LOC-B1": { id: "LOC-B1", name: "Emergency Casualty Gate (Block B)", floor: "Ground Floor", wing: "Block B" },
  "LOC-B2": { id: "LOC-B2", name: "Radiology & Imaging Lounge", floor: "Ground Floor", wing: "Block B" },
  "LOC-B3": { id: "LOC-B3", name: "Central Diagnostics & Lab Counter", floor: "Ground Floor", wing: "Block B" },
  "LOC-B4": { id: "LOC-B4", name: "Garden Court Cafeteria", floor: "Ground Floor", wing: "Block B" },
  "LOC-C1": { id: "LOC-C1", name: "Wing C OPD Registration Desk", floor: "1st Floor", wing: "Wing C" },
  "LOC-C2": { id: "LOC-C2", name: "General Medicine & Gastro Corridor", floor: "1st Floor", wing: "Wing C" },
  "LOC-C3": { id: "LOC-C3", name: "ENT, Eye & Dental Care Suite", floor: "1st Floor", wing: "Wing C" },
  "LOC-C4": { id: "LOC-C4", name: "Dermatology & Skin Clinic", floor: "1st Floor", wing: "Wing C" },
  "LOC-C5": { id: "LOC-C5", name: "Physiotherapy & Hydrotherapy Suite", floor: "1st Floor", wing: "Block B" },
  "LOC-D1": { id: "LOC-D1", name: "Wing D Elevator Lobby", floor: "2nd Floor", wing: "Wing D" },
  "LOC-D2": { id: "LOC-D2", name: "Cath Lab & Cardiac ICU Lobby", floor: "2nd Floor", wing: "Wing D" },
  "LOC-D3": { id: "LOC-D3", name: "Paediatrics & NICU Suite", floor: "2nd Floor", wing: "Wing C" },
  "LOC-D4": { id: "LOC-D4", name: "Nephrology & Dialysis Center", floor: "2nd Floor", wing: "Wing D" },
  "LOC-E1": { id: "LOC-E1", name: "Wing E Elevator Lobby", floor: "3rd Floor", wing: "Wing E" },
  "LOC-E2": { id: "LOC-E2", name: "Neurology & Stroke ICU Suite", floor: "3rd Floor", wing: "Wing D" },
  "LOC-E3": { id: "LOC-E3", name: "Orthopaedics & Spine Center", floor: "3rd Floor", wing: "Wing E" },
  "LOC-E4": { id: "LOC-E4", name: "Oncology & Chemotherapy Suite", floor: "3rd Floor", wing: "Wing E" },
  "LOC-E5": { id: "LOC-E5", name: "Urology & Male Health Suite", floor: "3rd Floor", wing: "Wing E" },
  "LOC-F1": { id: "LOC-F1", name: "Wing F Surgical Holding Area", floor: "4th Floor", wing: "Wing F" },
  "LOC-F2": { id: "LOC-F2", name: "Robotic OT Complex Entrance", floor: "4th Floor", wing: "Wing F" },
  "LOC-F3": { id: "LOC-F3", name: "Organ Transplant Recovery ICU", floor: "4th Floor", wing: "Wing F" },
  "LOC-BASE-1": { id: "LOC-BASE-1", name: "Basement B1 Visitor Parking Desk", floor: "Basement B1", wing: "Basement" },
  "LOC-BASE-2": { id: "LOC-BASE-2", name: "Central Blood Bank & Plasma Unit", floor: "Basement B1", wing: "Basement" },
};

// 25 Multi-Speciality Departments
export const DEPARTMENTS = [
  { id: "DEPT-001", name: "Emergency & Trauma Center", shortName: "Emergency", floor: "Ground Floor", wing: "Block B", icon: "🚨", color: "#fde8ee", description: "24/7 critical emergency care & ambulances" },
  { id: "DEPT-002", name: "Outpatient Department (OPD)", shortName: "OPD", floor: "1st Floor", wing: "Wing C", icon: "🩺", color: "#EAF2FB", description: "General specialist consultation suites" },
  { id: "DEPT-003", name: "Radiology & Imaging (MRI/CT)", shortName: "Radiology", floor: "Ground Floor", wing: "Block B", icon: "🩻", color: "#e6faf5", description: "X-Ray, 3T MRI, 128-Slice CT Scan, Ultrasound" },
  { id: "DEPT-004", name: "Central Diagnostics & Lab", shortName: "Lab", floor: "Ground Floor", wing: "Block B", icon: "🧪", color: "#fff8e6", description: "Blood collection, pathology & lab reports" },
  { id: "DEPT-005", name: "Cardiology & Cath Lab", shortName: "Cardiology", floor: "2nd Floor", wing: "Wing D", icon: "❤️", color: "#fde8ee", description: "Heart care, angioplasty & Cardiac ICU" },
  { id: "DEPT-006", name: "Orthopaedics & Spine Center", shortName: "Orthopaedics", floor: "3rd Floor", wing: "Wing E", icon: "🦴", color: "#f3e8ff", description: "Bone fracture, joint replacement & spine care" },
  { id: "DEPT-007", name: "Manipal 24/7 Pharmacy", shortName: "Pharmacy", floor: "Ground Floor", wing: "Tower A", icon: "💊", color: "#e6faf5", description: "In-house 24/7 prescription medications" },
  { id: "DEPT-008", name: "Paediatrics & NICU Suite", shortName: "Paediatrics", floor: "2nd Floor", wing: "Wing C", icon: "👶", color: "#fff8e6", description: "Child health, immunisation & neonatal ICU" },
  { id: "DEPT-009", name: "Neurology & Stroke Unit", shortName: "Neurology", floor: "3rd Floor", wing: "Wing D", icon: "🧠", color: "#f3e8ff", description: "Brain, spine, nerve care & stroke ICU" },
  { id: "DEPT-010", name: "Robotic & General Surgery OT", shortName: "Surgery", floor: "4th Floor", wing: "Wing F", icon: "🔬", color: "#EAF2FB", description: "Da Vinci robotic surgical suites & OT" },
  { id: "DEPT-011", name: "Physiotherapy & Rehab", shortName: "Physio", floor: "1st Floor", wing: "Block B", icon: "🏃", color: "#e6faf5", description: "Physical therapy, hydrotherapy & rehab" },
  { id: "DEPT-012", name: "Garden Court Cafeteria", shortName: "Cafeteria", floor: "Ground Floor", wing: "Block B", icon: "🍽️", color: "#fff8e6", description: "Hot meals, coffee, snacks & beverages" },
  { id: "DEPT-013", name: "Oncology & Cancer Care", shortName: "Oncology", floor: "3rd Floor", wing: "Wing E", icon: "🎗️", color: "#fde8ee", description: "Chemotherapy, radiation & surgical oncology" },
  { id: "DEPT-014", name: "Nephrology & Dialysis Center", shortName: "Dialysis", floor: "2nd Floor", wing: "Wing D", icon: "💧", color: "#EAF2FB", description: "24/7 hemodialysis & kidney care unit" },
  { id: "DEPT-015", name: "ENT (Ear, Nose, Throat)", shortName: "ENT", floor: "1st Floor", wing: "Wing C", icon: "👂", color: "#e6faf5", description: "Sinus, allergy, throat & audiometry care" },
  { id: "DEPT-016", name: "Ophthalmology & Eye Care", shortName: "Eye Care", floor: "1st Floor", wing: "Wing C", icon: "👁️", color: "#fff8e6", description: "Cataract, retina, LASIK & vision testing" },
  { id: "DEPT-017", name: "Dermatology & Skin Center", shortName: "Dermatology", floor: "1st Floor", wing: "Wing C", icon: "🧴", color: "#f3e8ff", description: "Skin rashes, allergy & cosmetic procedures" },
  { id: "DEPT-018", name: "Dental & Maxillofacial Care", shortName: "Dental", floor: "1st Floor", wing: "Wing C", icon: "🦷", color: "#EAF2FB", description: "Root canal, implants & maxillofacial surgery" },
  { id: "DEPT-019", name: "Obstetrics & Gynaecology", shortName: "Gynaecology", floor: "2nd Floor", wing: "Wing C", icon: "🤰", color: "#fde8ee", description: "Maternity care, birthing suites & gynae" },
  { id: "DEPT-020", name: "Psychiatry & Behavioral Health", shortName: "Psychiatry", floor: "1st Floor", wing: "Wing C", icon: "🧘", color: "#e6faf5", description: "Counseling, mental health & sleep therapy" },
  { id: "DEPT-021", name: "Central Blood Bank & Plasma", shortName: "Blood Bank", floor: "Basement B1", wing: "Basement", icon: "🩸", color: "#fde8ee", description: "24/7 blood components, plasma & platelet bank" },
  { id: "DEPT-022", name: "Organ Transplant Unit", shortName: "Transplant", floor: "4th Floor", wing: "Wing F", icon: "🫀", color: "#EAF2FB", description: "Liver, kidney & heart transplant ICU" },
  { id: "DEPT-023", name: "Visitor Parking & Valet Desk", shortName: "Parking", floor: "Basement B1", wing: "Basement", icon: "🅿️", color: "#fff8e6", description: "Multi-level basement parking & valet desk" },
  { id: "DEPT-024", name: "Billing, Insurance & TPA", shortName: "Billing", floor: "Ground Floor", wing: "Tower A", icon: "💳", color: "#f3e8ff", description: "Cashless insurance approval, TPA & bills" },
  { id: "DEPT-025", name: "Wheelchair & Mobility Desk", shortName: "Wheelchair Desk", floor: "Ground Floor", wing: "Tower A", icon: "♿", color: "#e6faf5", description: "Free wheelchair allocation & attendant support" },
];

// 30+ Doctors Roster Across All Departments
export const INITIAL_DOCTORS = [
  { id: "DOC-001", name: "Dr. Rajesh Sharma", spec: "Senior Cardiologist", deptId: "DEPT-005", status: "available" },
  { id: "DOC-002", name: "Dr. Priya Sundaram", spec: "Interventional Cardiology", deptId: "DEPT-005", status: "in_surgery" },
  { id: "DOC-003", name: "Dr. Ramesh Kumar", spec: "Emergency Medicine Chief", deptId: "DEPT-001", status: "available" },
  { id: "DOC-004", name: "Dr. Sunita Patil", spec: "Senior General Physician", deptId: "DEPT-002", status: "available" },
  { id: "DOC-005", name: "Dr. Anand Kulkarni", spec: "OPD Consultant", deptId: "DEPT-002", status: "on_leave" },
  { id: "DOC-006", name: "Dr. Vikram Rao", spec: "Spine & Joint Replacement", deptId: "DEPT-006", status: "available" },
  { id: "DOC-007", name: "Dr. Anita Deshmukh", spec: "Chief Paediatrician", deptId: "DEPT-008", status: "available" },
  { id: "DOC-008", name: "Dr. Suresh Reddy", spec: "Stroke & Neuro Specialist", deptId: "DEPT-009", status: "in_surgery" },
  { id: "DOC-009", name: "Dr. Meera Nambiar", spec: "Head Radiologist", deptId: "DEPT-003", status: "available" },
  { id: "DOC-010", name: "Dr. Deepak Mehta", spec: "Robotic Surgery Director", deptId: "DEPT-010", status: "available" },
  { id: "DOC-011", name: "Dr. Kavita Verma", spec: "Rehab Specialist", deptId: "DEPT-011", status: "available" },
  { id: "DOC-012", name: "Dr. Aris Ali", spec: "Pathologist", deptId: "DEPT-004", status: "available" },
  { id: "DOC-013", name: "Dr. Sandeep Hegde", spec: "Medical Oncologist", deptId: "DEPT-013", status: "available" },
  { id: "DOC-014", name: "Dr. Rashmi Iyer", spec: "Surgical Oncologist", deptId: "DEPT-013", status: "in_surgery" },
  { id: "DOC-015", name: "Dr. Alok Nath", spec: "Nephrologist", deptId: "DEPT-014", status: "available" },
  { id: "DOC-016", name: "Dr. Shalini Gowda", spec: "ENT Specialist", deptId: "DEPT-015", status: "available" },
  { id: "DOC-017", name: "Dr. Varun Murthy", spec: "Cataract & Retina Surgeon", deptId: "DEPT-016", status: "available" },
  { id: "DOC-018", name: "Dr. Divya Sengupta", spec: "Dermatologist", deptId: "DEPT-017", status: "available" },
  { id: "DOC-019", name: "Dr. Karthik Bhat", spec: "Maxillofacial Surgeon", deptId: "DEPT-018", status: "available" },
  { id: "DOC-020", name: "Dr. Nalini Rao", spec: "Obstetrician & Gynaecologist", deptId: "DEPT-019", status: "in_surgery" },
  { id: "DOC-021", name: "Dr. Tarun Saxena", spec: "Consultant Psychiatrist", deptId: "DEPT-020", status: "available" },
  { id: "DOC-022", name: "Dr. Brijesh Mishra", spec: "Transplant ICU Director", deptId: "DEPT-022", status: "available" },
  { id: "DOC-023", name: "Dr. Geeta Pillai", spec: "Neonatologist (NICU)", deptId: "DEPT-008", status: "available" },
  { id: "DOC-024", name: "Dr. Hemanth Kumar", spec: "Trauma Surgeon", deptId: "DEPT-001", status: "available" },
  { id: "DOC-025", name: "Dr. Niharika Shah", spec: "Gastrenterologist", deptId: "DEPT-002", status: "available" },
  { id: "DOC-026", name: "Dr. Pradeep Nair", spec: "Urologist & Andrologist", deptId: "DEPT-002", status: "available" },
  { id: "DOC-027", name: "Dr. Ritu Singhania", spec: "Endocrinologist", deptId: "DEPT-002", status: "available" },
  { id: "DOC-028", name: "Dr. Sharat Menon", spec: "Pulmonologist", deptId: "DEPT-002", status: "available" },
  { id: "DOC-029", name: "Dr. Tanvi Joshi", spec: "Rheumatologist", deptId: "DEPT-006", status: "available" },
  { id: "DOC-030", name: "Dr. Vivek Chawla", spec: "Vascular Surgeon", deptId: "DEPT-005", status: "on_leave" },
];

export function generateRoute(fromLocation, toDept) {
  // Pre-configured specific routes for popular checkpoints
  const routes = {
    "LOC-A1": {
      "DEPT-001": {
        steps: [
          { instruction: "Enter through Manipal Main Portico Gate A", direction: "straight", distance: "10m" },
          { instruction: "Walk past Central Atrium Help Desk", direction: "straight", distance: "20m" },
          { instruction: "Turn left into Block B Emergency Corridor", direction: "left", distance: "15m" },
          { instruction: "Follow the red line on the floor to Emergency & Trauma", direction: "arrived", distance: "0m" },
        ],
        totalDistance: "45m",
        estimatedTime: "2 min",
      },
      "DEPT-007": {
        steps: [
          { instruction: "Enter through Manipal Main Portico Gate A", direction: "straight", distance: "10m" },
          { instruction: "Walk straight past the Central Atrium", direction: "straight", distance: "25m" },
          { instruction: "Manipal 24/7 Main Pharmacy is on your left", direction: "arrived", distance: "0m" },
        ],
        totalDistance: "35m",
        estimatedTime: "1 min",
      },
      "DEPT-013": {
        steps: [
          { instruction: "Enter through Manipal Main Portico Gate A", direction: "straight", distance: "10m" },
          { instruction: "Take Elevator Bank E to 3rd Floor", direction: "straight", distance: "0m" },
          { instruction: "Exit elevator and turn right into Wing E", direction: "right", distance: "15m" },
          { instruction: "Oncology & Cancer Care Suite is on your left", direction: "arrived", distance: "20m" },
        ],
        totalDistance: "45m",
        estimatedTime: "3 min",
      },
    },
    "LOC-A2": {
      "DEPT-002": {
        steps: [
          { instruction: "From Central Atrium, head to Elevator C Lobby", direction: "straight", distance: "15m" },
          { instruction: "Take Elevator C to 1st Floor", direction: "straight", distance: "0m" },
          { instruction: "Exit elevator and turn right into Wing C", direction: "right", distance: "10m" },
          { instruction: "OPD Consultation Counter is straight ahead", direction: "arrived", distance: "15m" },
        ],
        totalDistance: "40m",
        estimatedTime: "2 min",
      },
    },
  };

  const locRoutes = routes[fromLocation?.id];
  if (locRoutes && locRoutes[toDept?.id]) return locRoutes[toDept.id];

  // Robust dynamic route generator for all 25+ checkpoints & departments across 6 floors
  const floorDiff = toDept.floor !== fromLocation?.floor;
  return {
    steps: [
      { instruction: `Start from ${fromLocation?.name || "your current location"} (${fromLocation?.floor || "Ground Floor"})`, direction: "straight", distance: "0m" },
      { instruction: "Follow hallway signage towards the central corridor", direction: "straight", distance: "20m" },
      ...(floorDiff ? [{ instruction: `Take Elevator Bank B/C/E to the ${toDept.floor}`, direction: "straight", distance: "0m" }] : []),
      { instruction: `Turn into ${toDept.wing} corridor`, direction: "right", distance: "25m" },
      { instruction: `Follow signs for ${toDept.name}`, direction: "straight", distance: "15m" },
      { instruction: `You have arrived at ${toDept.name}`, direction: "arrived", distance: "0m" },
    ],
    totalDistance: floorDiff ? "~120m" : "~60m",
    estimatedTime: floorDiff ? "4-5 min" : "2-3 min",
  };
}
