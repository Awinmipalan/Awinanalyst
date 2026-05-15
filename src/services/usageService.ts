import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';                
import { db, auth } from '../context/AuthContext';                

const MAX_DAILY = 2;                

export const checkAndIncrementUsage = async (): Promise<boolean> => {                
  const user = auth.currentUser;                
  if (!user) return false;                

  const adminRef = doc(db, 'admins', user.uid);
  const adminSnap = await getDoc(adminRef);
  if (adminSnap.exists()) return true;

  const today = new Date().toISOString().split('T')[0];                
  const usageRef = doc(db, 'users', user.uid, 'usage', 'daily');                
  
  const docSnap = await getDoc(usageRef);                
  
  if (docSnap.exists()) {                
    const data = docSnap.data();                
    if (data.lastAccessDate === today) {                
      if (data.dailyCount >= MAX_DAILY) return false;                
      await updateDoc(usageRef, { dailyCount: data.dailyCount + 1 });                
    } else {                
      await updateDoc(usageRef, { dailyCount: 1, lastAccessDate: today });                
    }                
  } else {                
    await setDoc(usageRef, { dailyCount: 1, lastAccessDate: today });                
  }                
  return true;                
};                
