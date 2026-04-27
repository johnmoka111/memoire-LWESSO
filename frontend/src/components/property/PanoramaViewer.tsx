import React, { useEffect, useRef } from 'react';

interface PanoramaViewerProps {
  imageUrl: string;
}

declare const pannellum: any;

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewerRef.current && typeof pannellum !== 'undefined') {
      try {
        pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: imageUrl,
          autoLoad: true,
          compass: true,
          title: "Visite 360° certifiée par l'agent",
          author: "KivuMarket+ Anti-Fraude",
          hfov: 110,
          vaov: 90,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          autoRotate: -2,
        });
      } catch (error) {
        console.error("Pannellum initialization error:", error);
      }
    }
  }, [imageUrl]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
      <div 
        ref={viewerRef} 
        className="w-full h-[500px] bg-slate-900"
      />
      <div className="absolute top-4 left-4 bg-kivu-green text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        Vue 360° vérifiée
      </div>
    </div>
  );
};

export default PanoramaViewer;
