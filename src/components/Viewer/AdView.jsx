import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, increment, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const AdView = () => {
  const { adId, viewerId } = useParams();

  useEffect(() => {
    processView();
  }, [adId, viewerId]);

  const processView = async () => {
    try {
      // Get device fingerprint
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;

      // Fetch ad details
      const adDoc = await getDoc(doc(db, 'ads', adId));
      if (!adDoc.exists()) {
        // Ad not found, just redirect to home
        window.location.href = '/';
        return;
      }

      const adData = { id: adDoc.id, ...adDoc.data() };

      // Check if ad is active and has budget
      if (!adData.isActive || adData.remainingBudget <= 0) {
        // Ad inactive, redirect to target anyway
        window.location.href = adData.targetLink;
        return;
      }

      // Check if this device has already viewed this ad (regardless of viewer)
      const viewQuery = query(
        collection(db, 'views'),
        where('adId', '==', adId),
        where('deviceId', '==', deviceId)
      );
      const viewSnapshot = await getDocs(viewQuery);

      if (!viewSnapshot.empty) {
        // Already viewed, just redirect without recording
        window.location.href = adData.targetLink;
        return;
      }

      // Check if ad has enough budget
      if (adData.remainingBudget < adData.bidPerView) {
        // Budget exhausted, redirect without recording
        window.location.href = adData.targetLink;
        return;
      }

      // Record the view with sharedBy field (do this in background)
      const recordView = async () => {
        await addDoc(collection(db, 'views'), {
          adId,
          sharedBy: viewerId, // The viewer who shared the link
          deviceId,
          timestamp: new Date().toISOString()
        });

        // Update ad statistics
        await updateDoc(doc(db, 'ads', adId), {
          viewCount: increment(1),
          remainingBudget: increment(-adData.bidPerView)
        });

        // Update viewer earnings
        await updateDoc(doc(db, 'users', viewerId), {
          earnings: increment(adData.bidPerView)
        });

        // Check if budget is exhausted
        if (adData.remainingBudget - adData.bidPerView <= 0) {
          await updateDoc(doc(db, 'ads', adId), {
            isActive: false
          });
        }
      };

      // Start recording in background (don't wait for it)
      recordView().catch(err => console.error('Error recording view:', err));

      // Redirect immediately
      window.location.href = adData.targetLink;
    } catch (error) {
      console.error('Error processing view:', error);
      // On error, try to redirect to home
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default AdView;
