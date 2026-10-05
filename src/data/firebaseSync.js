import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { HOSPITALS, ADMIN_ROLES, rehydrateCustomLocations } from './hospitalData';

// Push custom hospitals and roles to Firebase
export async function pushHospitalsToCloud() {
  if (!db) return;
  const customHospitals = {};
  const customRoles = {};
  
  Object.keys(HOSPITALS).forEach(hid => {
    if (hid !== 'H1' && hid !== 'H2') customHospitals[hid] = HOSPITALS[hid];
  });
  
  Object.keys(ADMIN_ROLES).forEach(roleId => {
    const r = ADMIN_ROLES[roleId];
    if (r.hospitalId !== 'H1' && r.hospitalId !== 'H2' && r.role !== 'super') {
      customRoles[roleId] = r;
    }
  });

  try {
    await setDoc(doc(db, 'global', 'hospitals'), { hospitals: customHospitals, roles: customRoles });
  } catch (e) {
    console.error('Error pushing hospitals to cloud', e);
  }
}

// Push a saved map graph to Firebase
export async function pushMapToCloud(hid, graph) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'maps', hid), { graph });
  } catch (e) {
    console.error('Error pushing map to cloud', e);
  }
}

// Pull ALL custom hospitals and maps from Firebase on startup
export async function pullAllFromCloud() {
  if (!db) return false;
  try {
    // 1. Pull hospitals
    const hospDoc = await getDoc(doc(db, 'global', 'hospitals'));
    if (hospDoc.exists()) {
      const data = hospDoc.data();
      if (data.hospitals) Object.assign(HOSPITALS, data.hospitals);
      if (data.roles) {
        Object.entries(data.roles).forEach(([oldKey, r]) => {
          const key = r.role === 'super' ? 'super' : r.hospitalId;
          if (!r.pin) r.pin = oldKey; // Restore the PIN from the old key if missing
          ADMIN_ROLES[key] = r;
        });
      }
      // Sync back to local storage for immediate access next time
      localStorage.setItem('arogyanav_custom_hospitals', JSON.stringify(data));
    }

    // 2. Pull all maps
    const mapsSnap = await getDocs(collection(db, 'maps'));
    mapsSnap.forEach(docSnap => {
      const hid = docSnap.id;
      const graph = docSnap.data().graph;
      localStorage.setItem('arogyanav_map_graph_v2_' + hid, JSON.stringify(graph));
    });
    
    // Now that all maps are saved, rehydrate custom locations for QR scanner
    rehydrateCustomLocations();
    
    return true; // Successfully synced
  } catch (e) {
    console.error('Error pulling from cloud', e);
    return false;
  }
}

