'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FaGlobe, FaArrowRight, FaCompass } from 'react-icons/fa';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const countriesList = [
  { name: 'Saudi Arabia', code: 'SA', lat: 23.8859, lng: 45.0792, icon: '🕌', desc: 'The spiritual heart of Islam, containing Mecca and Medina.', color: '#10b981', iso: '682' },
  { name: 'Turkey', code: 'TR', lat: 38.9637, lng: 35.2433, icon: '🕌', desc: 'Historic bridge displaying magnificent Ottoman architecture.', color: '#0ea5e9', iso: '792' },
  { name: 'Morocco', code: 'MA', lat: 31.7917, lng: -7.0926, icon: '🕌', desc: 'Vibrant cities with stunning Andalusian-Moorish riads.', color: '#f97316', iso: '504' },
  { name: 'Malaysia', code: 'MY', lat: 4.2105, lng: 101.9758, icon: '🕌', desc: 'Southeast Asian center of tropical beauty and Islamic harmony.', color: '#fbbf24', iso: '458' },
  { name: 'Indonesia', code: 'ID', lat: -0.7893, lng: 113.9213, icon: '🕌', desc: 'The world\'s largest Muslim population across thousands of islands.', color: '#f43f5e', iso: '360' },
  { name: 'Egypt', code: 'EG', lat: 26.8206, lng: 30.8025, icon: '🕌', desc: 'Land of history and the iconic City of a Thousand Minarets.', color: '#b45309', iso: '818' },
  { name: 'United Arab Emirates', code: 'AE', lat: 23.4241, lng: 53.8478, icon: '🕌', desc: 'Modern oasis blending futuristic skyline with grand mosques.', color: '#a855f7', iso: '784' },
  { name: 'Spain', code: 'ES', lat: 37.3891, lng: -5.9845, icon: '🕌', desc: 'Home of the historic Al-Andalus and rich Islamic heritage.', color: '#ef4444', iso: '724' }
];

export default function InteractiveGlobe() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [worldData, setWorldData] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countriesList[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use refs for values that change on every frame/animation loop or need to be read in the animation loop
  const rotationRef = useRef({ x: -20, y: 0 });
  const hoveredCountryRef = useRef(null);
  const selectedCountryRef = useRef(countriesList[0]);

  // Synchronize state with refs
  useEffect(() => {
    selectedCountryRef.current = selectedCountry;
  }, [selectedCountry]);

  useEffect(() => {
    hoveredCountryRef.current = hoveredCountry;
  }, [hoveredCountry]);

  const dragRef = useRef({ isDown: false, startX: 0, startY: 0, startRotX: -20, startRotY: 0 });
  const animRef = useRef(null);
  const lastActiveTime = useRef(0);
  const rotationSpeed = 0.12; // Degrees per frame

  useEffect(() => {
    lastActiveTime.current = Date.now();
  }, []);

  // Fetch World Boundaries TopoJSON
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(res => {
        if (!res.ok) throw new Error('Network error fetching world map data');
        return res.json();
      })
      .then(topoData => {
        const countriesGeo = topojson.feature(topoData, topoData.objects.countries);
        setWorldData(countriesGeo);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load world atlas TopoJSON:', err);
        setIsLoading(false);
      });
  }, []);

  // Main Canvas Rendering
  useEffect(() => {
    if (!worldData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMoveGlobal = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMoveGlobal);

    const render = () => {
      let currentRotY;
      let currentRotX;

      // Auto-rotation if user hasn't interacted recently
      if (Date.now() - lastActiveTime.current > 4000) {
        rotationRef.current.y += rotationSpeed;
        currentRotY = rotationRef.current.y;
        currentRotX = rotationRef.current.x;
      } else {
        currentRotY = dragRef.current.startRotY;
        currentRotX = dragRef.current.startRotX;
      }

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const size = Math.min(w, h);
      const globeRadius = size * 0.44; // Scale it up to take most of the canvas area

      ctx.clearRect(0, 0, w, h);

      // 1. Create Orthographic Projection
      const projection = d3.geoOrthographic()
        .scale(globeRadius)
        .translate([w / 2, h / 2])
        .rotate([currentRotY, currentRotX, 0])
        .clipAngle(90);

      const path = d3.geoPath().projection(projection).context(ctx);

      // 2. Draw Space Glow / Atmosphere Behind Globe
      const glowGrad = ctx.createRadialGradient(w/2, h/2, globeRadius * 0.95, w/2, h/2, globeRadius * 1.2);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      glowGrad.addColorStop(0.4, 'rgba(5, 150, 105, 0.05)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(w/2, h/2, globeRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Ocean Sphere
      ctx.fillStyle = 'rgba(2, 28, 22, 0.85)'; // Dark Islamic Emerald Ocean
      ctx.beginPath();
      ctx.arc(w/2, h/2, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Grid Lines (Graticule) on Ocean
      const graticule = d3.geoGraticule()();
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 4. Draw World Land & Boundaries
      ctx.beginPath();
      path(worldData);
      ctx.fillStyle = 'rgba(6, 78, 59, 0.6)'; // Rich Emerald Land
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)'; // Light border lines
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 5. Draw Muslim Countries (Highlighted)
      const muslimCountryIsos = countriesList.reduce((acc, c) => {
        acc[c.iso] = c;
        return acc;
      }, {});

      worldData.features.forEach(feature => {
        const countryMeta = muslimCountryIsos[feature.id];
        if (countryMeta) {
          ctx.beginPath();
          path(feature);
          
          const isSelected = selectedCountryRef.current && selectedCountryRef.current.iso === feature.id;
          const isHovered = hoveredCountryRef.current && hoveredCountryRef.current.iso === feature.id;

          if (isHovered || isSelected) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)'; // Vibrant glowing Gold/Amber
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
            ctx.lineWidth = 1.2;
          } else {
            ctx.fillStyle = 'rgba(217, 119, 6, 0.18)'; // Gold land highlight
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
            ctx.lineWidth = 0.8;
          }
          ctx.fill();
          ctx.stroke();
        }
      });

      // 6. Draw Connected Paths (Great Circles on Sphere Surface)
      for (let i = 0; i < countriesList.length; i++) {
        for (let j = i + 1; j < countriesList.length; j++) {
          const from = countriesList[i];
          const to = countriesList[j];

          const geojsonLine = {
            type: 'LineString',
            coordinates: [[from.lng, from.lat], [to.lng, to.lat]]
          };

          // Draw the great circle path
          ctx.beginPath();
          path(geojsonLine);

          const isHoveredRoute = hoveredCountryRef.current && 
            (from.name === hoveredCountryRef.current.name || to.name === hoveredCountryRef.current.name);

          if (isHoveredRoute) {
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)';
            ctx.lineWidth = 1.6;
          } else {
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
            ctx.lineWidth = 0.8;
          }
          ctx.stroke();
        }
      }

      // 7. Draw Country Pin Markers
      let currentHovered = null;

      countriesList.forEach(c => {
        // Calculate visibility: point must be in the visible hemisphere
        const centerLng = -currentRotY;
        const centerLat = -currentRotX;
        const geoDistance = d3.geoDistance([c.lng, c.lat], [centerLng, centerLat]);
        
        // D3 distance is in radians, if distance > PI/2 it is on the backside
        if (geoDistance > Math.PI / 2) return;

        // Project coordinate
        const projected = projection([c.lng, c.lat]);
        if (!projected) return;
        const [px, py] = projected;

        // Distance check for hovering
        const dx = mouseX - px;
        const dy = mouseY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isHovered = dist < 12;
        const isSelected = selectedCountryRef.current && selectedCountryRef.current.name === c.name;

        if (isHovered) {
          currentHovered = c;
        }

        // Pulse glow
        const pulse = 1 + 0.15 * Math.sin(Date.now() / 150);
        const radius = isHovered || isSelected ? 11 : 6;

        const pinGrad = ctx.createRadialGradient(px, py, 1, px, py, radius * pulse);
        pinGrad.addColorStop(0, isHovered || isSelected ? 'rgba(245, 158, 11, 0.95)' : 'rgba(16, 185, 129, 0.9)');
        pinGrad.addColorStop(0.3, isHovered || isSelected ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)');
        pinGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = pinGrad;
        ctx.beginPath();
        ctx.arc(px, py, radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isHovered || isSelected ? '#fbbf24' : '#10b981';
        ctx.beginPath();
        ctx.arc(px, py, isHovered || isSelected ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Overlay text label for hovered/selected pin
        if (isHovered || isSelected) {
          ctx.font = 'bold 11px sans-serif';
          const labelText = `${c.icon} ${c.name}`;
          const labelWidth = ctx.measureText(labelText).width;

          ctx.fillStyle = 'rgba(2, 44, 34, 0.88)';
          ctx.strokeStyle = isHovered ? '#fbbf24' : '#10b981';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.roundRect(px - labelWidth / 2 - 8, py - 28, labelWidth + 16, 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f0fdf4';
          ctx.fillText(labelText, px - labelWidth / 2, py - 15);
        }
      });

      // Update hovered state safely
      if (currentHovered !== hoveredCountryRef.current) {
        setHoveredCountry(currentHovered);
        hoveredCountryRef.current = currentHovered;
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMoveGlobal);
      cancelAnimationFrame(animRef.current);
    };
  }, [worldData]);

  // Handle Dragging / Rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastActiveTime.current = Date.now();
    
    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotX: rotationRef.current.x,
      startRotY: rotationRef.current.y
    };
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDown) return;
    
    lastActiveTime.current = Date.now();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    const sensitivity = 0.25; // rotation speed scale
    let nextRotX = dragRef.current.startRotX - dy * sensitivity;
    let nextRotY = dragRef.current.startRotY + dx * sensitivity;
    
    // Constraint polar tilt
    nextRotX = Math.max(-50, Math.min(50, nextRotX));

    rotationRef.current.x = nextRotX;
    rotationRef.current.y = nextRotY;
    dragRef.current.startRotX = nextRotX;
    dragRef.current.startRotY = nextRotY;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    dragRef.current.isDown = false;
  };

  // Click on pin to select
  const handleCanvasClick = () => {
    if (hoveredCountry) {
      setSelectedCountry(hoveredCountry);
    }
  };

  // Mobile Touch Support
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    lastActiveTime.current = Date.now();
    
    dragRef.current = {
      isDown: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startRotX: rotationRef.current.x,
      startRotY: rotationRef.current.y
    };
  };

  const handleTouchMove = (e) => {
    if (!dragRef.current.isDown || e.touches.length !== 1) return;
    
    lastActiveTime.current = Date.now();
    const dx = e.touches[0].clientX - dragRef.current.startX;
    const dy = e.touches[0].clientY - dragRef.current.startY;
    
    const sensitivity = 0.3;
    let nextRotX = dragRef.current.startRotX - dy * sensitivity;
    let nextRotY = dragRef.current.startRotY + dx * sensitivity;
    
    nextRotX = Math.max(-50, Math.min(50, nextRotX));

    rotationRef.current.x = nextRotX;
    rotationRef.current.y = nextRotY;
    dragRef.current.startRotX = nextRotX;
    dragRef.current.startRotY = nextRotY;
    dragRef.current.startX = e.touches[0].clientX;
    dragRef.current.startY = e.touches[0].clientY;
  };

  return (
    <div style={globeStyles.container}>
      <div style={globeStyles.contentGrid}>
        
        {/* Fullsize Globe Canvas */}
        <div 
          ref={containerRef} 
          style={globeStyles.globeWrapper}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        >
          {isLoading && (
            <div style={globeStyles.loadingOverlay}>
              <div style={globeStyles.loader}></div>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Projecting realistic borders...</p>
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            style={{ 
              display: 'block', 
              cursor: isDragging ? 'grabbing' : (hoveredCountry ? 'pointer' : 'grab'),
              width: '100%',
              height: '100%'
            }} 
          />
          <div style={globeStyles.dragPrompt}>
            <FaCompass style={{ marginRight: '6px', animation: 'spin 4s linear infinite' }} />
            Drag to rotate globe • Click country pins to view
          </div>
        </div>

        {/* Dynamic Details Panel Overlay */}
        <div style={globeStyles.detailsPanel} className="glass-panel globe-details-panel-floating">
          <div style={globeStyles.panelHeader}>
            <span style={globeStyles.panelBadge}>
              <FaGlobe style={{ marginRight: '6px' }} />
              D3 ORTHOGRAPHIC REALISTIC PROJECTION
            </span>
          </div>

          {selectedCountry ? (
            <div style={globeStyles.selectedInfo}>
              <div style={globeStyles.selectedHeader}>
                <span style={{ fontSize: '32px', marginRight: '12px' }}>{selectedCountry.icon}</span>
                <div>
                  <h2 style={globeStyles.selectedName}>{selectedCountry.name}</h2>
                  <span style={globeStyles.selectedMeta}>ISO Numerical: {selectedCountry.iso} | Coordinates: {selectedCountry.lat.toFixed(1)}°N, {selectedCountry.lng.toFixed(1)}°E</span>
                </div>
              </div>

              <p style={globeStyles.selectedDesc}>{selectedCountry.desc}</p>

              <div style={globeStyles.connectionsMiniGrid}>
                <h4 style={globeStyles.miniTitle}>Connected flight paths:</h4>
                <div style={globeStyles.routeBadges}>
                  {countriesList.filter(c => c.name !== selectedCountry.name).map((c, index) => (
                    <span 
                      key={index} 
                      className="globe-route-badge"
                      onClick={() => setSelectedCountry(c)}
                    >
                      ✈️ {c.name}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <a 
                  href="/signup" 
                  className="btn-primary" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    padding: '12px 20px', 
                    fontSize: '14px', 
                    textDecoration: 'none',
                    width: '100%'
                  }}
                >
                  Explore Itineraries & Local Guides <FaArrowRight size={12} />
                </a>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Click any country boundary on the rotating globe to display cultural highlights and connect itineraries.</p>
          )}
        </div>

      </div>
    </div>
  );
}

// Full-screen styles for realistic globe
const globeStyles = {
  container: {
    padding: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  contentGrid: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  globeWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 44, 34, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(16, 185, 129, 0.1)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  dragPrompt: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '6px 14px',
    borderRadius: '100px',
    background: 'rgba(2, 44, 34, 0.85)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    zIndex: 5,
  },
  detailsPanel: {
    position: 'absolute',
    right: '30px',
    bottom: '30px',
    width: '360px',
    zIndex: 10,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(6, 78, 59, 0.35)',
    border: '1px solid rgba(217, 119, 6, 0.25)',
    borderRadius: 'var(--radius-md)',
    backdropFilter: 'blur(24px)',
    boxShadow: 'var(--shadow-lg)',
  },
  panelHeader: {
    marginBottom: '20px',
  },
  panelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: '100px',
    background: 'rgba(217, 119, 6, 0.1)',
    border: '1px solid rgba(217, 119, 6, 0.25)',
    color: 'var(--secondary)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  selectedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  selectedHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  selectedMeta: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    display: 'block',
    marginTop: '2px',
  },
  selectedDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  connectionsMiniGrid: {
    marginTop: '8px',
  },
  miniTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  routeBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    maxHeight: '110px',
    overflowY: 'auto',
  },
  routeBadge: {
    fontSize: '11px',
    padding: '4px 10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '100px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'var(--secondary)',
      color: 'var(--secondary)',
    }
  }
};
