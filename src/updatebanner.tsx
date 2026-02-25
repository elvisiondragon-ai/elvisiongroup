/*
How to use this component:
This file is often used. 

To UNHIDE the banner:
1. Add the following import to src/App.tsx:
   import UpdateBanner from "./updatebanner";
2. Add the following component tag inside the AppLoader in src/App.tsx:
   <UpdateBanner />

To HIDE the banner:
- Remove the import and the component tag from src/App.tsx.
*/

import React, { useState, useEffect } from 'react';
import { App } from '@capacitor/app';

// BANNER RULES
// - If the user is on the web, do nothing.
// - If the user is on Native Android and their version is not "3.0.0" or "3.0", show a blocking fullscreen update REQUIRED screen.
const UPDATE_URL = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/apk/elvision-v3.apk';
const REQUIRED_VERSION = '3.0.0'; // We accept '3.0.0' or '3.0'

const UpdateBanner: React.FC = () => {
  const [isMandatoryUpdate, setIsMandatoryUpdate] = useState(false);
  const [currentVer, setCurrentVer] = useState('');

  useEffect(() => {
    const checkNativeVersion = async () => {
      try {
        const info = await App.getInfo();
        console.log('📱 Native App Info:', info);
        // info.version is usually "1.0", "2.0", "3.0.0" etc
        setCurrentVer(info.version);

        if (info.version !== REQUIRED_VERSION && info.version !== '3.0') {
          console.warn(`⚠️ User is on outdated APK version (${info.version}). Forcing update to V3.`);
          setIsMandatoryUpdate(true);
        }
      } catch (err) {
        // Not running in Capacitor (e.g. standard Web browser) -> do not force update
        console.log('🌐 Running in standard web browser. No APK update required.');
      }
    };

    checkNativeVersion();
  }, []);

  const handleDownloadClick = () => {
    window.location.href = UPDATE_URL;
  };

  // Only show the banner if it is a mandatory native update
  if (!isMandatoryUpdate) {
    return null;
  }

  // Fullscreen blocking UI
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0a0a0a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999, // Extremely high z-index to block absolutely everything
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{
        backgroundColor: '#1f2937', // dark gray card
        padding: '32px',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        border: '1px solid #374151'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#f3f4f6' }}>
          Update Wajib V3
        </h2>
        <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '8px' }}>
          Versi aplikasi yang Anda gunakan ({currentVer}) sudah usang.
        </p>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
          Demi keamanan dan pembaruan fitur terbaru, silakan unduh versi V3 untuk melanjutkan.
        </p>
        <button
          onClick={handleDownloadClick}
          style={{
            backgroundColor: '#3b82f6', // blue-500
            color: 'white',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Download elvision-v3.apk
        </button>
      </div>
    </div>
  );
};

export default UpdateBanner;
