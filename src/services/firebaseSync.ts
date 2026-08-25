import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, COLLECTIONS, handleFirestoreError, OperationType } from '../firebase';
import { Shop, Worker, ClaimRequest } from '../types';

/**
 * Subscribe to real-time Shops from Firestore
 */
export function subscribeToShops(
  onUpdate: (shops: Shop[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const shopsRef = collection(db, COLLECTIONS.SHOPS);
    const unsubscribe = onSnapshot(
      shopsRef,
      (snapshot) => {
        const shopsList: Shop[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            shopsList.push({ ...data, id: docSnap.id } as Shop);
          }
        });
        if (shopsList.length > 0) {
          onUpdate(shopsList);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.SHOPS);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTIONS.SHOPS);
    return () => {};
  }
}

/**
 * Subscribe to real-time Workers from Firestore
 */
export function subscribeToWorkers(
  onUpdate: (workers: Worker[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const workersRef = collection(db, COLLECTIONS.WORKERS);
    const unsubscribe = onSnapshot(
      workersRef,
      (snapshot) => {
        const workersList: Worker[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            workersList.push({ ...data, id: docSnap.id } as Worker);
          }
        });
        if (workersList.length > 0) {
          onUpdate(workersList);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.WORKERS);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTIONS.WORKERS);
    return () => {};
  }
}

/**
 * Subscribe to real-time Referral Claims from Firestore
 */
export function subscribeToClaims(
  onUpdate: (claims: ClaimRequest[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const claimsRef = collection(db, COLLECTIONS.CLAIMS);
    const unsubscribe = onSnapshot(
      claimsRef,
      (snapshot) => {
        const claimsList: ClaimRequest[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            claimsList.push({ ...data, id: docSnap.id } as ClaimRequest);
          }
        });
        if (claimsList.length > 0) {
          onUpdate(claimsList);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTIONS.CLAIMS);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTIONS.CLAIMS);
    return () => {};
  }
}

/**
 * Add or update a shop in Firestore
 */
export async function syncShopToCloud(shop: Shop): Promise<boolean> {
  try {
    const shopDocRef = doc(db, COLLECTIONS.SHOPS, shop.id);
    // Sanitize shop payload to make sure it's JSON serializable
    const cleanShop = JSON.parse(JSON.stringify(shop));
    await setDoc(shopDocRef, {
      ...cleanShop,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SHOPS}/${shop.id}`);
    return false;
  }
}

/**
 * Delete a shop from Firestore
 */
export async function deleteShopFromCloud(shopId: string): Promise<boolean> {
  try {
    const shopDocRef = doc(db, COLLECTIONS.SHOPS, shopId);
    await deleteDoc(shopDocRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.SHOPS}/${shopId}`);
    return false;
  }
}

/**
 * Add or update a worker in Firestore
 */
export async function syncWorkerToCloud(worker: Worker): Promise<boolean> {
  try {
    const workerDocRef = doc(db, COLLECTIONS.WORKERS, worker.id);
    const cleanWorker = JSON.parse(JSON.stringify(worker));
    await setDoc(workerDocRef, {
      ...cleanWorker,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.WORKERS}/${worker.id}`);
    return false;
  }
}

/**
 * Delete a worker from Firestore
 */
export async function deleteWorkerFromCloud(workerId: string): Promise<boolean> {
  try {
    const workerDocRef = doc(db, COLLECTIONS.WORKERS, workerId);
    await deleteDoc(workerDocRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.WORKERS}/${workerId}`);
    return false;
  }
}

/**
 * Add or update a claim request in Firestore
 */
export async function syncClaimToCloud(claim: ClaimRequest): Promise<boolean> {
  try {
    const claimDocRef = doc(db, COLLECTIONS.CLAIMS, claim.id);
    const cleanClaim = JSON.parse(JSON.stringify(claim));
    await setDoc(claimDocRef, {
      ...cleanClaim,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.CLAIMS}/${claim.id}`);
    return false;
  }
}
