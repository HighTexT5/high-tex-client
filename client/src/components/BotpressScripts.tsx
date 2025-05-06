'use client';

import Script from 'next/script';

export default function BotpressScripts() {
  return (
    <>
      <Script 
        src="https://cdn.botpress.cloud/webchat/v2.4/inject.js" 
        strategy="afterInteractive" 
      />
      <Script 
        src="https://files.bpcontent.cloud/2025/05/06/19/20250506192554-ZZOZ4FKA.js" 
        strategy="afterInteractive" 
        onReady={() => {
          // This will run once the second script has loaded and is ready
          if (typeof window !== 'undefined' && window.botpressWebChat) {
            window.botpressWebChat.init({});
          }
        }}
      />
    </>
  );
}

// Need to add this to make TypeScript happy
declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: any) => void;
    };
  }
}