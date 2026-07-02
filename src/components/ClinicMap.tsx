import React, { useEffect, useRef, useState } from "react";
import { MapPin, Search, Navigation, Check, Loader2, RefreshCw, Eye, Share2 } from "lucide-react";
import { ClinicInfo } from "../types";

interface ClinicMapProps {
  clinicInfo: ClinicInfo;
  onChange: (updated: ClinicInfo) => void;
}

// Default coordinates centered in Middle East/North Africa area (or general center)
const DEFAULT_LAT = 24.7136; // Riyadh
const DEFAULT_LNG = 46.6753;

const getPopupHTML = (info: ClinicInfo) => {
  return `
    <div style="font-family: inherit; direction: rtl; text-align: right; min-width: 190px; padding: 4px;" class="text-slate-950">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #0f172a;">${info.name || "عيادتنا"}</div>
      ${info.specialty ? `<div style="font-size: 11px; color: #0d9488; font-weight: 600; margin-bottom: 6px;">${info.specialty}</div>` : ""}
      <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.4;">
        <strong>العنوان: </strong>${info.address || "الموقع الجغرافي المحدد"}
      </div>
      ${info.phone ? `
        <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          <a href="tel:${info.phone}" 
             style="display: flex; align-items: center; justify-content: center; gap: 6px; background-color: #0d9488; color: white; text-decoration: none; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 6px; text-align: center; transition: background 0.2s; white-space: nowrap;"
             onmouseover="this.style.backgroundColor='#0f766e'"
             onmouseout="this.style.backgroundColor='#0d9488'">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             اتصال: ${info.phone}
          </a>
        </div>
      ` : ""}
    </div>
  `;
};

export default function ClinicMap({ clinicInfo, onChange }: ClinicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const nextZoomRef = useRef<number | null>(null);
  const circleRef = useRef<any>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [mapStyle, setMapStyle] = useState<"dark" | "street">("dark");
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  // Map Tile Layers
  const TILE_LAYERS = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  const ATTRIBUTIONS = {
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    street: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  };

  // Helper to load Leaflet CDN assets dynamically
  const loadLeafletAssets = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).L) {
        resolve((window as any).L);
        return;
      }

      // Check if CSS link is already there
      if (!document.getElementById("leaflet-css-cdn")) {
        const link = document.createElement("link");
        link.id = "leaflet-css-cdn";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Check if JS script is already there
      if (!document.getElementById("leaflet-js-cdn")) {
        const script = document.createElement("script");
        script.id = "leaflet-js-cdn";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve((window as any).L);
        script.onerror = () => reject(new Error("Failed to load Leaflet library"));
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(checkInterval);
            resolve((window as any).L);
          }
        }, 100);
      }
    });
  };

  // Initialize Map
  useEffect(() => {
    let active = true;

    loadLeafletAssets()
      .then((L) => {
        if (!active || !mapContainerRef.current) return;

        // Clean up previous map if exists
        if (circleRef.current) {
          circleRef.current.remove();
          circleRef.current = null;
        }
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          markerRef.current = null;
        }

        const lat = clinicInfo.latitude || DEFAULT_LAT;
        const lng = clinicInfo.longitude || DEFAULT_LNG;

        // Create Leaflet Map
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: clinicInfo.latitude ? 14 : 6,
          zoomControl: true,
        });

        mapRef.current = map;

        // Add Tile Layer
        const tileUrl = TILE_LAYERS[mapStyle];
        const attribution = ATTRIBUTIONS[mapStyle];
        L.tileLayer(tileUrl, { attribution }).addTo(map);

        // Custom Beautiful Pulsing SVG Marker
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="relative flex items-center justify-center w-10 h-10">
              <span class="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-30 animate-ping"></span>
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 border-teal-400 shadow-lg text-teal-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        // Create Marker
        const marker = L.marker([lat, lng], {
          icon: customIcon,
          draggable: true,
        }).addTo(map);

        markerRef.current = marker;

        // Add Bind Popup with Clinic details
        marker.bindPopup(getPopupHTML(clinicInfo));

        // Handle Marker Drag
        marker.on("dragend", () => {
          if (circleRef.current) {
            circleRef.current.remove();
            circleRef.current = null;
          }
          const position = marker.getLatLng();
          onChange({
            ...clinicInfo,
            latitude: position.lat,
            longitude: position.lng,
          });
        });

        // Handle Map Click to Pin Location
        map.on("click", (e: any) => {
          if (circleRef.current) {
            circleRef.current.remove();
            circleRef.current = null;
          }
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          
          onChange({
            ...clinicInfo,
            latitude: lat,
            longitude: lng,
          });

          // Pan to clicked location
          map.panTo([lat, lng]);
        });

        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Leaflet:", err);
      });

    return () => {
      active = false;
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mapStyle]);

  // Re-center marker and map if coordinate props change externally, and update popup info on change
  useEffect(() => {
    if (isLoaded && mapRef.current && markerRef.current) {
      const lat = clinicInfo.latitude || DEFAULT_LAT;
      const lng = clinicInfo.longitude || DEFAULT_LNG;
      const currentMarkerLatLng = markerRef.current.getLatLng();
      
      if (currentMarkerLatLng.lat !== lat || currentMarkerLatLng.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        
        const zoom = nextZoomRef.current || 14;
        mapRef.current.setView([lat, lng], zoom);
        nextZoomRef.current = null; // Reset zoom flag
      }

      // Update popup content with latest details (name, specialty, phone, address, etc.)
      markerRef.current.setPopupContent(getPopupHTML(clinicInfo));
    }
  }, [clinicInfo, isLoaded]);

  // Geocode address using OSM Nominatim API
  const handleGeocode = async () => {
    if (!clinicInfo.address || clinicInfo.address.trim() === "") {
      setGeocodingError("يرجى كتابة عنوان العيادة أولاً لتحديد موقعه.");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          clinicInfo.address
        )}&limit=1`
      );

      if (!response.ok) throw new Error("Network response error");
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        if (circleRef.current) {
          circleRef.current.remove();
          circleRef.current = null;
        }

        onChange({
          ...clinicInfo,
          latitude: lat,
          longitude: lng,
        });

        setGeocodingError(null);
      } else {
        setGeocodingError(
          "لم نتمكن من العثور على هذا العنوان بدقة. يرجى تعديل النص أو تحديد الموقع يدوياً بالنقر على الخريطة."
        );
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      setGeocodingError("حدث خطأ أثناء الاتصال بخدمة الخرائط. يرجى النقر على الخريطة لتحديد الموقع يدوياً.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeocodingError("متصفحك لا يدعم جلب الموقع الجغرافي (Geolocation).");
      return;
    }

    setIsLocating(true);
    setGeocodingError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy || 50;
        
        nextZoomRef.current = 16;
        onChange({
          ...clinicInfo,
          latitude: lat,
          longitude: lng,
        });

        // Add semi-transparent accuracy circle around the user's location
        const L = (window as any).L;
        if (L && mapRef.current) {
          if (circleRef.current) {
            circleRef.current.remove();
          }
          
          const circle = L.circle([lat, lng], {
            radius: accuracy,
            color: "#0d9488", // Teal color border
            fillColor: "#0d9488", // Teal color fill
            fillOpacity: 0.15, // Semi-transparent fill
            weight: 1.5, // Thin border weight
            dashArray: "4 4", // Dashed border line style
          }).addTo(mapRef.current);

          circleRef.current = circle;
        }
        
        setIsLocating(false);
        setGeocodingError(null);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        
        let msg = "حدث خطأ أثناء جلب موقعك الحالي.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "تم رفض صلاحية الوصول للموقع الجغرافي. يرجى تفعيل الصلاحية في المتصفح أو تحديد الموقع يدوياً.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "معلومات الموقع الجغرافي غير متوفرة حالياً.";
        } else if (error.code === error.TIMEOUT) {
          msg = "انتهت مهلة جلب الموقع الجغرافي للعيادة.";
        }
        setGeocodingError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleShareLocation = async () => {
    const lat = clinicInfo.latitude || DEFAULT_LAT;
    const lng = clinicInfo.longitude || DEFAULT_LNG;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const shareText = `موقع عيادة ${clinicInfo.name || "العيادة"}:\n📍 العنوان: ${clinicInfo.address || "العنوان المكتوب"}\n\n📌 رابط خرائط جوجل للملاحة والموقع:\n${mapUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `موقع عيادة ${clinicInfo.name || "العيادة"}`,
          text: shareText,
          url: mapUrl,
        });
      } catch (error) {
        // User cancelling share is expected and shouldn't trigger an error alert
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error("Failed to copy:", err);
        setGeocodingError("لم نتمكن من مشاركة الموقع أو نسخه تلقائياً.");
      }
    }
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === "dark" ? "street" : "dark"));
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-400" />
            <span>خريطة العيادة التفاعلية 📍</span>
          </h5>
          <p className="text-xs text-slate-400 mt-1">
            حدد موقع العيادة الجغرافي بدقة ليتمكن الشات بوت من توجيه المرضى ومشاركة الموقع معهم.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Style */}
          <button
            type="button"
            onClick={toggleMapStyle}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="تغيير مظهر الخريطة"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>{mapStyle === "dark" ? "مظهر الشوارع" : "المظهر الداكن"}</span>
          </button>

          {/* Auto Detect */}
          <button
            type="button"
            disabled={isGeocoding || isLocating}
            onClick={handleGeocode}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeocoding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>تحديد من العنوان</span>
          </button>

          {/* Locate Me */}
          <button
            type="button"
            disabled={isGeocoding || isLocating}
            onClick={handleLocateMe}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="استخدم الـ Geolocation لتحديد إحداثيات موقع العيادة الحالي تلقائياً"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
            ) : (
              <Navigation className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
            )}
            <span>{isLocating ? "جاري تحديد الموقع..." : "تحديد موقعي الحالي"}</span>
          </button>

          {/* Share Location */}
          <button
            type="button"
            onClick={handleShareLocation}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="مشاركة موقع العيادة الجغرافي"
          >
            {shareSuccess ? (
              <Check className="w-3.5 h-3.5 text-teal-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span>{shareSuccess ? "تم نسخ الرابط!" : "مشاركة الموقع"}</span>
          </button>
        </div>
      </div>

      {/* Map Element */}
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-slate-800/80 bg-slate-950">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 space-y-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <p className="text-xs text-slate-400">جاري تحميل الخريطة التفاعلية...</p>
          </div>
        )}

        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>

      {/* Feedback & Coordinates status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
        <div className="flex items-center gap-1 text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span>تلميح: يمكنك سحب الدبوس أو النقر في أي مكان لتعديل الموقع بدقة.</span>
        </div>
        
        {clinicInfo.latitude && clinicInfo.longitude ? (
          <div className="font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            Lat: {clinicInfo.latitude.toFixed(6)}, Lng: {clinicInfo.longitude.toFixed(6)}
          </div>
        ) : (
          <div className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            الموقع الحالي تقريبي (يرجى النقر للتأكيد)
          </div>
        )}
      </div>

      {geocodingError && (
        <p className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/20 p-2.5 rounded-lg">
          {geocodingError}
        </p>
      )}
    </div>
  );
}
