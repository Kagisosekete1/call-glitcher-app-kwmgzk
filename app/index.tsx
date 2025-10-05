
import React, { useState } from 'react';
import { Redirect } from 'expo-router';
import SplashScreen from '../components/SplashScreen';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen 
        onFinish={() => {
          console.log('Splash screen finished, redirecting to auth');
          setShowSplash(false);
        }} 
      />
    );
  }

  // For demo purposes, redirect directly to tabs
  // In a real app, you'd check authentication status here
  return <Redirect href="/auth/login" />;
}
