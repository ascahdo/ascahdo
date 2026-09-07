import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const AdsterraGlobalScripts: React.FC = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const loadConfig = async () => {
      try {
        const res = await api.getAdsterraConfig();
        if (isMounted && res && res.isEnabled) {
          setConfig(res);
        }
      } catch (err) {
        // Silently catch if not reachable
      }
    };

    loadConfig();

    const handleUpdate = () => {
      loadConfig();
    };

    window.addEventListener('ascado_adsterra_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ascado_adsterra_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!config || !config.isEnabled) return;

    // Inject Popunder script if provided
    if (config.popunderScript && config.popunderScript.trim()) {
      const scriptId = 'adsterra-popunder-script';
      if (!document.getElementById(scriptId)) {
        try {
          const scriptEl = document.createElement('script');
          scriptEl.id = scriptId;
          scriptEl.type = 'text/javascript';

          // Extract src if it is a script tag with src
          const srcMatch = config.popunderScript.match(/src=["']([^"']+)["']/);
          if (srcMatch && srcMatch[1]) {
            scriptEl.src = srcMatch[1];
          } else {
            scriptEl.text = config.popunderScript.replace(/<\/?script[^>]*>/gi, '');
          }
          document.head.appendChild(scriptEl);
        } catch (e) {
          console.warn('Adsterra Popunder Script injection skipped:', e);
        }
      }
    }

    // Inject Social Bar script if provided
    if (config.socialBarScript && config.socialBarScript.trim()) {
      const scriptId = 'adsterra-socialbar-script';
      if (!document.getElementById(scriptId)) {
        try {
          const scriptEl = document.createElement('script');
          scriptEl.id = scriptId;
          scriptEl.type = 'text/javascript';
          const srcMatch = config.socialBarScript.match(/src=["']([^"']+)["']/);
          if (srcMatch && srcMatch[1]) {
            scriptEl.src = srcMatch[1];
          } else {
            scriptEl.text = config.socialBarScript.replace(/<\/?script[^>]*>/gi, '');
          }
          document.body.appendChild(scriptEl);
        } catch (e) {
          console.warn('Adsterra Social Bar Script injection skipped:', e);
        }
      }
    }
  }, [config]);

  return null;
};
