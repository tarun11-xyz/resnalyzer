import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "enhanced-aspect-7pp0d",
  appId: "1:208934622727:web:7c0feda094d24e5511fca2",
  apiKey: "AIzaSyCC29jqafhf6srDJoIXdiUC9J285fcLMVo",
  authDomain: "enhanced-aspect-7pp0d.firebaseapp.com",
  storageBucket: "enhanced-aspect-7pp0d.firebasestorage.app",
  messagingSenderId: "208934622727",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Ensure we use the custom databaseId if required, but default database is what we deploy rules to by default. 
// Note: We'll initialize with default, since the setup usually configures default. Wait, the config says "firestoreDatabaseId": "resnalyzer". 
// But the deployment deployed rules to default. 
export const db = getFirestore(app, "resnalyzer"); 

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (role: 'candidate' | 'recruiter') => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in db
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create user if they don't exist
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: role,
        createdAt: new Date()
      });
    } else {
      // Existing user: we could check if role matches or reject, but for now we'll just log them in
      const data = userSnap.data();
      if (data.role !== role) {
        console.warn(`User signed in as ${data.role} but clicked ${role} login. Using existing role.`);
      }
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};
