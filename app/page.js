'use client'

import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { useState, useRef } from 'react'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Screen Capture Test',
  description: 'How does screen capture work?',
}


export default function Home() {

  const [screenshot, setScreenshot] = useState(null);
  const videoRef = useRef();

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      videoRef.current.srcObject = stream;

      const captureStream = videoRef.current.captureStream();
      const track = captureStream.getVideoTracks()[0];

      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);

      const screenshotUrl = canvas.toDataURL();
      setScreenshot(screenshotUrl);

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };


  return (
    <main className={`${inter.className} ${styles.main}`}>
      Testing...

      <div>
        <button onClick={handleScreenshot}>Take Screenshot</button>
        {screenshot && <img src={screenshot} alt="Screenshot" />}
        <video ref={videoRef} style={{ display: 'none' }} />
      </div>
    </main>
  )
}
