```javascript
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function MyComponent() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    setIsMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && isMounted) {
        setUser(firebaseUser);
        try {
          const querySnapshot = await getDocs(collection(db, 'users', firebaseUser.uid));
          const data = querySnapshot.docs.map(doc => doc.data());
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => {
      setIsMounted(false);
      unsubscribe(); 
    };
  }, []);

  // ... rest of the component
}
```