// Manipal Hospital, HAL Old Airport Road, Bengaluru location data & layout mapping
export const HOSPITAL_INFO = {
  name: "Manipal Hospital",
  campus: "HAL Old Airport Road, Bengaluru",
  address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017",
  mapsLink: "https://maps.google.com/?q=Manipal+Hospital+HAL+Old+Airport+Road+Bengaluru",
  osmLink: "https://www.openstreetmap.org/search?query=Manipal%20Hospital%20Old%20Airport%20Road%20Bengaluru",
  helpline: "1800 102 5555 / (080) 2502 4444",
  productionUrl: "https://arogya-nav.vercel.app", // Live production domain for wall QR codes
};

export const HOSPITAL_LOCATIONS = {
  "LOC-A1": { id: "LOC-A1", name: "Main Entrance Portico (Tower A)", floor: "Ground Floor", wing: "Tower A" },
  "LOC-A2": { id: "LOC-A2", name: "Central Atrium & Help Desk", floor: "Ground Floor", wing: "Tower A" },
  "LOC-B1": { id: "LOC-B1", name: "Emergency Casualty Gate (Block B)", floor: "Ground Floor", wing: "Block B" },
  "LOC-C2": { id: "LOC-C2", name: "OPD Consultation Corridor", floor: "1st Floor", wing: "Wing C" },
  "LOC-D3": { id: "LOC-D3", name: "Cath Lab & ICU Lobby", floor: "2nd Floor", wing: "Wing D" },
};

export const INITIAL_DOCTORS = [
  { id: "DOC-001", name: "Dr. Rajesh Sharma", spec: "Senior Cardiologist", deptId: "DEPT-005", status: "available" },
  { id: "DOC-002", name: "Dr. Priya Sundaram", spec: "Interventional Cardiology", deptId: "DEPT-005", status: "in_surgery" },
  { id: "DOC-003", name: "Dr. Ramesh Kumar", spec: "Emergency Specialist", deptId: "DEPT-001", status: "available" },
  { id: "DOC-004", name: "Dr. Sunita Patil", spec: "General Physician (OPD)", deptId: "DEPT-002", status: "available" },
  { id: "DOC-005", name: "Dr. Anand Kulkarni", spec: "Senior Consultant (OPD)", deptId: "DEPT-002", status: "on_leave" },
  { id: "DOC-006", name: "Dr. Vikram Rao", spec: "Orthopaedic Surgeon", deptId: "DEPT-006", status: "available" },
  { id: "DOC-007", name: "Dr. Anita Deshmukh", spec: "Senior Paediatrician", deptId: "DEPT-008", status: "available" },
  { id: "DOC-008", name: "Dr. Suresh Reddy", spec: "Neurologist & Stroke Specialist", deptId: "DEPT-009", status: "in_surgery" },
  { id: "DOC-009", name: "Dr. Meera Nambiar", spec: "Radiologist", deptId: "DEPT-003", status: "available" },
  { id: "DOC-010", name: "Dr. Deepak Mehta", spec: "Robotic Surgeon", deptId: "DEPT-010", status: "available" },
  { id: "DOC-011", name: "Dr. Kavita Verma", spec: "Chief Physiotherapist", deptId: "DEPT-011", status: "available" },
  { id: "DOC-012", name: "Dr. Aris Ali", spec: "Pathologist", deptId: "DEPT-004", status: "available" },
];

export const DEPARTMENTS = [
  { id: "DEPT-001", name: "Emergency & Trauma", shortName: "Emergency", floor: "Ground Floor", wing: "Block B", icon: "🚨", color: "#fde8ee", description: "24/7 emergency critical care" },
  { id: "DEPT-002", name: "Outpatient Department (OPD)", shortName: "OPD", floor: "1st Floor", wing: "Wing C", icon: "🩺", color: "#EAF2FB", description: "General specialist consultations" },
  { id: "DEPT-003", name: "Radiology & Imaging (MRI/CT)", shortName: "Radiology", floor: "Ground Floor", wing: "Block B", icon: "🩻", color: "#e6faf5", description: "X-Ray, 3T MRI, CT Scan" },
  { id: "DEPT-004", name: "Central Diagnostics Lab", shortName: "Lab", floor: "Ground Floor", wing: "Tower A", icon: "🧪", color: "#fff8e6", description: "Blood sample collection & lab" },
  { id: "DEPT-005", name: "Cardiology & Cath Lab", shortName: "Cardiology", floor: "2nd Floor", wing: "Wing D", icon: "❤️", color: "#fde8ee", description: "Heart care & interventional cardiology" },
  { id: "DEPT-006", name: "Orthopaedics & Joint Care", shortName: "Orthopaedics", floor: "3rd Floor", wing: "Wing E", icon: "🦴", color: "#f3e8ff", description: "Bone, joint & spine center" },
  { id: "DEPT-007", name: "Manipal Pharmacy (24/7)", shortName: "Pharmacy", floor: "Ground Floor", wing: "Tower A", icon: "💊", color: "#e6faf5", description: "In-house 24/7 medications" },
  { id: "DEPT-008", name: "Paediatrics & Child Health", shortName: "Paediatrics", floor: "2nd Floor", wing: "Wing C", icon: "👶", color: "#fff8e6", description: "Child health & immunisation" },
  { id: "DEPT-009", name: "Neurology & Neurosurgery", shortName: "Neurology", floor: "3rd Floor", wing: "Wing D", icon: "🧠", color: "#f3e8ff", description: "Brain & stroke care unit" },
  { id: "DEPT-010", name: "Robotic & General Surgery", shortName: "Surgery", floor: "4th Floor", wing: "Wing F", icon: "🔬", color: "#EAF2FB", description: "Advanced surgical suites" },
  { id: "DEPT-011", name: "Physiotherapy & Rehab", shortName: "Physio", floor: "1st Floor", wing: "Block B", icon: "🏃", color: "#e6faf5", description: "Physical therapy & recovery" },
  { id: "DEPT-012", name: "Garden Court Cafeteria", shortName: "Cafeteria", floor: "Ground Floor", wing: "Tower A", icon: "🍽️", color: "#fff8e6", description: "Fresh meals & refreshments" },
];

export function generateRoute(fromLocation, toDept) {
  const routes = {
    "LOC-A1": {
      "DEPT-001": {
        steps: [
          { instruction: "Enter through Manipal Main Portico Gate A", direction: "straight", distance: "10m" },
          { instruction: "Walk past the Central Atrium reception desk", direction: "straight", distance: "20m" },
          { instruction: "Turn left at Block B Emergency Corridor", direction: "left", distance: "15m" },
          { instruction: "Follow the red floor line to Emergency & Trauma", direction: "arrived", distance: "0m" },
        ],
        totalDistance: "45m",
        estimatedTime: "2 min",
      },
      "DEPT-007": {
        steps: [
          { instruction: "Enter through Manipal Main Portico Gate A", direction: "straight", distance: "10m" },
          { instruction: "Walk straight past the Central Atrium", direction: "straight", distance: "25m" },
          { instruction: "Manipal 24/7 Pharmacy is on your left", direction: "arrived", distance: "0m" },
        ],
        totalDistance: "35m",
        estimatedTime: "1 min",
      },
    },
    "LOC-A2": {
      "DEPT-002": {
        steps: [
          { instruction: "From Central Atrium, head to Elevator C Lobby", direction: "straight", distance: "15m" },
          { instruction: "Take Elevator C to the 1st Floor", direction: "straight", distance: "0m" },
          { instruction: "Exit elevator and turn right into Wing C", direction: "right", distance: "10m" },
          { instruction: "OPD consultation desk is straight ahead", direction: "arrived", distance: "15m" },
        ],
        totalDistance: "40m",
        estimatedTime: "2 min",
      },
    },
  };

  const locRoutes = routes[fromLocation?.id];
  if (locRoutes && locRoutes[toDept?.id]) return locRoutes[toDept.id];

  // Dynamic route generator for Manipal Hospital HAL Road
  const floorDiff = toDept.floor !== fromLocation?.floor;
  return {
    steps: [
      { instruction: `Start from ${fromLocation?.name || "your current location"}`, direction: "straight", distance: "0m" },
      { instruction: "Follow signs towards the central corridor", direction: "straight", distance: "20m" },
      ...(floorDiff ? [{ instruction: `Take Lift B/C to the ${toDept.floor}`, direction: "straight", distance: "0m" }] : []),
      { instruction: `Turn towards ${toDept.wing}`, direction: "right", distance: "25m" },
      { instruction: `Follow signs for ${toDept.name}`, direction: "straight", distance: "15m" },
      { instruction: `You have arrived at ${toDept.name}`, direction: "arrived", distance: "0m" },
    ],
    totalDistance: floorDiff ? "~110m" : "~60m",
    estimatedTime: floorDiff ? "4-5 min" : "2-3 min",
  };
}
