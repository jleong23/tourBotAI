// useGoogleMapsLoader.js
import { useEffect, useState } from "react";

export default function useGoogleMapsLoader(apiKey) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  return loaded;
}
