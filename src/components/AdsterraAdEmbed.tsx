import React, { useId, useMemo } from 'react';
import { Sparkles, ExternalLink, Settings, ShieldCheck, Zap } from 'lucide-react';

interface AdsterraAdEmbedProps {
  adsterraKey?: string;
  adsterraScriptCode?: string;
  width?: number;
  height?: number;
  format?: string;
  smartlinkUrl?: string;
  title?: string;
  titleBn?: string;
  isBn?: boolean;
  onOpenAdManager?: () => void;
  onAdClick?: () => void;
  className?: string;
}

export const AdsterraAdEmbed: React.FC<AdsterraAdEmbedProps> = ({
  adsterraKey = 'e4d77b8cf650b91e921d74a00508b1a3',
  adsterraScriptCode,
  width = 728,
  height = 90,
  format = 'iframe',
  smartlinkUrl = 'https://www.highperformancegate.com/smartlink/ascado_direct',
  title = 'Sponsored Adsterra Promotion',
  titleBn = 'অ্যাডস্টেরা স্পন্সরড প্রমোশন',
  isBn = false,
  onOpenAdManager,
  onAdClick,
  className = ''
}) => {
  const iframeId = useId();

  // Construct standard Adsterra HTML iframe payload
  const htmlContent = useMemo(() => {
    if (adsterraScriptCode && adsterraScriptCode.trim()) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; font-family: sans-serif; }
              a { text-decoration: none; }
            </style>
          </head>
          <body>
            ${adsterraScriptCode}
          </body>
        </html>
      `;
    }

    const key = adsterraKey || 'e4d77b8cf650b91e921d74a00508b1a3';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .ad-container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; }
          </style>
        </head>
        <body>
          <div class="ad-container">
            <script type="text/javascript">
              atOptions = {
                'key' : '${key}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/${key}/invoke.js"></script>
          </div>
        </body>
      </html>
    `;
  }, [adsterraKey, adsterraScriptCode, width, height]);

  // If format is smartlink direct link
  if (format === 'smartlink') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-lg ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isBn ? 'অ্যাডস্টেরা স্মার্টলিংক' : 'Adsterra Smartlink'}
                </span>
                <span className="text-[11px] text-indigo-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {isBn ? 'যাচাইকৃত মনিটাইজেশন' : 'Verified Partner'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                {isBn ? titleBn : title}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBn ? 'স্পন্সরড অফারটি দেখতে বা অংশগ্রহণে নিচের বাটনে ক্লিক করুন' : 'Click below to explore special sponsored offers directly'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <a
              href={smartlinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onAdClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition transform hover:scale-105"
            >
              <span>{isBn ? 'অফারটি দেখুন' : 'Explore Offer'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onOpenAdManager && (
              <button
                onClick={onOpenAdManager}
                title={isBn ? 'অ্যাডস্টেরা সেটিংস' : 'Adsterra Settings'}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Banner Embed (Iframe Sandbox with Responsive Frame)
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs p-2 sm:p-3 flex flex-col items-center justify-center ${className}`}>
      {/* Header Info Bar */}
      <div className="w-full flex items-center justify-between text-[10px] text-slate-600 mb-1.5 px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{isBn ? 'অ্যাডস্টেরা ব্যানার' : 'Adsterra Display Network'}</span>
          <span className="text-slate-500">({width}x{height})</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAdManager && (
            <button
              onClick={onOpenAdManager}
              className="text-slate-600 hover:text-emerald-700 flex items-center gap-1 text-[10px] font-bold transition"
            >
              <Settings className="w-3 h-3" />
              <span>{isBn ? 'বিজ্ঞাপন কোড পরিবর্তন' : 'Edit Adsterra Code'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sandboxed Iframe Ad Box */}
      <div
        className="w-full flex items-center justify-center overflow-x-auto bg-slate-50/50 rounded-xl border border-slate-100 py-1"
        style={{ minHeight: `${Math.min(height, 260)}px` }}
      >
        <iframe
          id={`adsterra-${iframeId}`}
          title={`Adsterra Ad ${width}x${height}`}
          srcDoc={htmlContent}
          width={width}
          height={height}
          scrolling="no"
          frameBorder="0"
          className="max-w-full rounded-lg"
          style={{
            maxWidth: '100%',
            height: `${height}px`,
            border: 'none',
            overflow: 'hidden'
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>
    </div>
  );
};
