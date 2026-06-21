'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../services/api';
import { 
  FaMapMarkedAlt, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaCompass, 
  FaSignOutAlt, 
  FaPlus, 
  FaTrash, 
  FaSearch, 
  FaUser, 
  FaInfoCircle, 
  FaGlobe, 
  FaPassport, 
  FaBuilding, 
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon
} from 'react-icons/fa';

const countryFunFacts = {
  'saudi-arabia': 'Mecca contains the Kaaba, the most sacred site in Islam, while Medina is home to Al-Masjid an-Nabawi (the Prophet\'s Mosque), established by the Prophet Muhammad (PBUH) himself.',
  'turkey': 'Istanbul is the only city in the world that spans across two continents (Europe and Asia), divided by the scenic Bosphorus Strait. It is home to the Hagia Sophia and the Sultan Ahmed (Blue) Mosque.',
  'morocco': 'The University of al-Qarawiyyin in Fez, founded in 859 AD by a Muslim woman named Fatima al-Fihri, is recognized by UNESCO as the oldest continuously operating university in the world.',
  'malaysia': 'Malaysia is home to the stunning Putra Mosque (Pink Mosque), which is constructed with rose-tinted granite and sits gracefully on the edge of the artificial Putrajaya Lake.',
  'indonesia': 'Indonesia contains over 17,000 islands and holds the world\'s largest Muslim population. The Istiqlal Mosque in Jakarta is the largest mosque in Southeast Asia, sitting right opposite the Jakarta Cathedral.',
  'egypt': 'Cairo is known as the "City of a Thousand Minarets" due to its rich historic Islamic architecture, especially the historic Al-Azhar Mosque and University founded in 970 AD.',
  'united-arab-emirates': 'The Sheikh Zayed Grand Mosque in Abu Dhabi features 82 domes, over 1,000 columns, and the world\'s largest hand-knotted carpet, crafted by 1,200 artisans.',
  'spain': 'The Alhambra in Granada is a peak achievement of Moorish Islamic architecture in Europe, displaying intricate geometric tiling, flowing fountains, and calligraphy reading "No victor but Allah".',
  'japan': 'Tokyo Camii is the largest mosque in Japan, constructed in a magnificent Ottoman Turkish architectural style with materials and artisans sent directly from Turkey.'
};

const calculateQibla = (lat, lng) => {
  if (lat === undefined || lng === undefined) return null;
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const meccaLatRad = (meccaLat * Math.PI) / 180;
  const meccaLngRad = (meccaLng * Math.PI) / 180;

  const dLng = meccaLngRad - lngRad;

  const y = Math.sin(dLng) * Math.cos(meccaLatRad);
  const x = Math.cos(latRad) * Math.sin(meccaLatRad) -
            Math.sin(latRad) * Math.cos(meccaLatRad) * Math.cos(dLng);

  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  bearing = (bearing + 360) % 360;

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(bearing / 22.5) % 16;
  const cardinal = directions[idx];

  return {
    bearing: bearing.toFixed(1),
    cardinal: cardinal
  };
};

const estimatePrayerTimes = (lat, lng) => {
  if (lat === undefined || lng === undefined) return null;
  
  let fajr = 4.8;
  let sunrise = 6.0;
  let dhuhr = 12.3;
  let asr = 15.6;
  let maghrib = 18.2;
  let isha = 19.5;

  const lngOffset = ((lng % 15) * 4) / 60;
  const latAbs = Math.abs(lat);
  const seasonalShift = (latAbs / 60) * 1.2;

  fajr = (fajr - seasonalShift + lngOffset + 24) % 24;
  sunrise = (sunrise - seasonalShift / 2 + lngOffset + 24) % 24;
  dhuhr = (dhuhr + lngOffset + 24) % 24;
  asr = (asr + seasonalShift / 4 + lngOffset + 24) % 24;
  maghrib = (maghrib + seasonalShift + lngOffset + 24) % 24;
  isha = (isha + seasonalShift * 1.2 + lngOffset + 24) % 24;

  const formatTime = (decimalHours) => {
    const h = Math.floor(decimalHours);
    const m = Math.floor((decimalHours - h) * 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${ampm}`;
  };

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha)
  };
};

export default function DashboardPage() {
  const { user, loading: authLoading, logout, theme, toggleTheme } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState('explorer');

  // Core Data States
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [guides, setGuides] = useState([]);

  // Selections
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityDetails, setCityDetails] = useState({
    places: [],
    mosques: [],
    restaurants: [],
    hotels: [],
    transports: []
  });
  const [countryInfo, setCountryInfo] = useState({
    visa: null,
    cultureNotes: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [isDashboardDataLoading, setIsDashboardDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getCountryFunFact = (name) => {
    if (!name) return null;
    const key = name.toLowerCase().replace(/\s+/g, '-');
    return countryFunFacts[key] || null;
  };

  // Modals state
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [showCultureNoteModal, setShowCultureNoteModal] = useState(false);

  // Form states
  const [countryForm, setCountryForm] = useState({ name: '', code: '', continent: '', description: '', currency: '', safetyLevel: 'medium' });
  const [cityForm, setCityForm] = useState({ name: '', country: '', description: '', popularFor: '', bestTimeToVisit: '' });
  const [itineraryForm, setItineraryForm] = useState({ title: '', country: '', budget: '', startDate: '', endDate: '' });
  const [expenseForm, setExpenseForm] = useState({ itinerary: '', category: 'other', amount: '', currency: 'USD', note: '' });
  const [visaForm, setVisaForm] = useState({ passportCountry: 'India', visaType: '', applicationMode: 'embassy', documentsRequired: '', processingTime: '', feeAmount: 0, feeCurrency: 'EUR', officialWebsite: '', notes: '' });
  const [cultureNoteForm, setCultureNoteForm] = useState({ title: '', category: 'local_customs', content: '', tags: '', cityId: '' });
  const [editingVisaId, setEditingVisaId] = useState(null);
  const [editingCultureNoteId, setEditingCultureNoteId] = useState(null);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Country-specific theme selector
  useEffect(() => {
    let activeCountry = null;
    if (selectedCountry) {
      activeCountry = selectedCountry;
    } else if (selectedCity) {
      const countryId = typeof selectedCity.country === 'object' 
        ? selectedCity.country._id 
        : selectedCity.country;
      activeCountry = countries.find(c => c._id === countryId);
    }

    if (activeCountry) {
      const themeName = activeCountry.name.toLowerCase().replace(/\s+/g, '-');
      document.documentElement.setAttribute('data-country-theme', themeName);
    } else {
      document.documentElement.removeAttribute('data-country-theme');
    }

    return () => {
      document.documentElement.removeAttribute('data-country-theme');
    };
  }, [selectedCountry, selectedCity, countries]);

  // Fetching Functions wrapped in useCallback to avoid dependencies warnings
  const fetchCountries = useCallback(async () => {
    try {
      const res = await api.countries.list();
      if (res.success) setCountries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const res = await api.cities.getAll();
      if (res.success) setCities(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchItineraries = useCallback(async () => {
    try {
      const res = await api.itineraries.list();
      if (res.success) setItineraries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await api.expenses.list();
      if (res.success) setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchGuides = useCallback(async () => {
    try {
      const res = await api.guides.list();
      if (res.success) {
        const rawGuides = res.data || [];
        const uniqueGuidesMap = {};
        
        rawGuides.forEach(g => {
          const userId = g.user?._id || g.user || g._id;
          if (!uniqueGuidesMap[userId]) {
            uniqueGuidesMap[userId] = {
              ...g,
              servedCities: g.city ? [g.city] : [],
            };
          } else {
            // Append city if not already in the served cities list
            if (g.city) {
              const currentCities = uniqueGuidesMap[userId].servedCities || [];
              if (!currentCities.some(c => c._id === g.city._id)) {
                currentCities.push(g.city);
              }
              uniqueGuidesMap[userId].servedCities = currentCities;
            }
            // Merge languages
            if (g.languages) {
              const currentLangs = uniqueGuidesMap[userId].languages || [];
              g.languages.forEach(l => {
                if (!currentLangs.includes(l)) currentLangs.push(l);
              });
              uniqueGuidesMap[userId].languages = currentLangs;
            }
          }
        });
        
        setGuides(Object.values(uniqueGuidesMap));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial Fetching in parallel
  useEffect(() => {
    if (user) {
      const loadAllData = async () => {
        setIsDashboardDataLoading(true);
        try {
          await Promise.all([
            fetchCountries(),
            fetchCities(),
            fetchItineraries(),
            fetchExpenses(),
            fetchGuides()
          ]);
        } catch (err) {
          console.error('Error loading dashboard data:', err);
        } finally {
          setIsDashboardDataLoading(false);
        }
      };
      loadAllData();
    }
  }, [user, fetchCountries, fetchCities, fetchItineraries, fetchExpenses, fetchGuides]);

  // Fetch Details for selected City
  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    setError('');
    try {
      let fetchedPlaces = [];
      let fetchedMosques = [];
      let fetchedRestaurants = [];
      let fetchedHotels = [];
      let fetchedTransports = [];

      try {
        const placeRes = await api.places.list(city._id);
        if (placeRes.success) fetchedPlaces = placeRes.data || [];
      } catch (err) { console.warn('Places API failed', err); }

      try {
        const mosqueRes = await api.mosques.list(city._id);
        if (mosqueRes.success) fetchedMosques = mosqueRes.data || [];
      } catch (err) { console.warn('Mosques API failed', err); }

      try {
        const restaurantRes = await api.restaurants.list(city._id);
        if (restaurantRes.success) fetchedRestaurants = restaurantRes.data || [];
      } catch (err) { console.warn('Restaurants API failed', err); }

      try {
        const hotelRes = await api.hotels.list(city._id);
        if (hotelRes.success) fetchedHotels = hotelRes.data || [];
      } catch (err) { console.warn('Hotels API failed', err); }

      try {
        const transportRes = await api.transports.list(city._id);
        if (transportRes.success) fetchedTransports = transportRes.data || [];
      } catch (err) { console.warn('Transports API failed', err); }

      setCityDetails({
        places: fetchedPlaces,
        mosques: fetchedMosques,
        restaurants: fetchedRestaurants,
        hotels: fetchedHotels,
        transports: fetchedTransports
      });
    } catch (err) {
      setError('Could not retrieve city attractions.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Country Info (Visa, Culture Notes)
  const handleSelectCountry = async (country) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Clear selected city
    setLoading(true);
    try {
      let visa = null;
      let notes = [];
      try {
        const visaRes = await api.visaInfo.get(country._id);
        if (visaRes.success) visa = visaRes.data;
      } catch (e) { console.warn('Visa fetch failed', e); }

      try {
        const notesRes = await api.cultureNotes.get(country._id);
        if (notesRes.success) notes = notesRes.data || [];
      } catch (e) { console.warn('Notes fetch failed', e); }

      setCountryInfo({ visa, cultureNotes: Array.isArray(notes) ? notes : [notes].filter(Boolean) });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Creation Submissions
  const handleCreateCountry = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.countries.create({
        ...countryForm,
        languages: countryForm.languages ? countryForm.languages.split(',').map(l => l.trim()) : []
      });
      if (res.success) {
        setSuccess('Country added successfully!');
        setCountryForm({ name: '', code: '', continent: '', description: '', currency: '', safetyLevel: 'medium' });
        setShowCountryModal(false);
        fetchCountries();
      }
    } catch (err) {
      setError(err.message || 'Failed to create country.');
    }
  };

  const handleCreateCity = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.cities.create({
        ...cityForm,
        popularFor: cityForm.popularFor ? cityForm.popularFor.split(',').map(item => item.trim()) : []
      });
      if (res.success) {
        setSuccess('City added successfully!');
        setCityForm({ name: '', country: '', description: '', popularFor: '', bestTimeToVisit: '' });
        setShowCityModal(false);
        fetchCities();
      }
    } catch (err) {
      setError(err.message || 'Failed to create city.');
    }
  };

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.itineraries.create(itineraryForm);
      if (res.success) {
        setSuccess('Itinerary created successfully!');
        setItineraryForm({ title: '', country: '', budget: '', startDate: '', endDate: '' });
        setShowItineraryModal(false);
        fetchItineraries();
      }
    } catch (err) {
      setError(err.message || 'Failed to create itinerary.');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.expenses.create({
        ...expenseForm,
        amount: Number(expenseForm.amount)
      });
      if (res.success) {
        setSuccess('Expense logged successfully!');
        setExpenseForm({ itinerary: '', category: 'other', amount: '', currency: 'USD', note: '' });
        setShowExpenseModal(false);
        fetchExpenses();
      }
    } catch (err) {
      setError(err.message || 'Failed to log expense.');
    }
  };

  const handleDeleteItinerary = async (id) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      const res = await api.itineraries.delete(id);
      if (res.success) {
        fetchItineraries();
        fetchExpenses();
      }
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to remove this expense record?')) return;
    try {
      const res = await api.expenses.delete(id);
      if (res.success) {
        fetchExpenses();
      }
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleSaveVisaInfo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        country: selectedCountry._id,
        passportCountry: visaForm.passportCountry,
        visaType: visaForm.visaType,
        applicationMode: visaForm.applicationMode,
        documentsRequired: visaForm.documentsRequired ? visaForm.documentsRequired.split(',').map(d => d.trim()) : [],
        processingTime: visaForm.processingTime,
        fee: {
          amount: Number(visaForm.feeAmount),
          currency: visaForm.feeCurrency
        },
        officialWebsite: visaForm.officialWebsite,
        notes: visaForm.notes
      };

      let res;
      if (editingVisaId) {
        res = await api.visaInfo.update(editingVisaId, payload);
      } else {
        res = await api.visaInfo.create(payload);
      }

      if (res.success) {
        setSuccess(editingVisaId ? 'Visa info updated successfully!' : 'Visa info created successfully!');
        setShowVisaModal(false);
        setEditingVisaId(null);
        setVisaForm({ passportCountry: 'India', visaType: '', applicationMode: 'embassy', documentsRequired: '', processingTime: '', feeAmount: 0, feeCurrency: 'EUR', officialWebsite: '', notes: '' });
        // Refresh country info
        handleSelectCountry(selectedCountry);
      }
    } catch (err) {
      setError(err.message || 'Failed to save visa info.');
    }
  };

  const handleDeleteVisaInfo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visa information?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.visaInfo.delete(id);
      if (res.success) {
        setSuccess('Visa information deleted successfully!');
        // Refresh country info
        handleSelectCountry(selectedCountry);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete visa info.');
    }
  };

  const handleEditVisaInfoClick = (visa) => {
    setEditingVisaId(visa._id);
    setVisaForm({
      passportCountry: visa.passportCountry || 'India',
      visaType: visa.visaType || '',
      applicationMode: visa.applicationMode || 'embassy',
      documentsRequired: visa.documentsRequired ? visa.documentsRequired.join(', ') : '',
      processingTime: visa.processingTime || '',
      feeAmount: visa.fee?.amount || 0,
      feeCurrency: visa.fee?.currency || 'EUR',
      officialWebsite: visa.officialWebsite || '',
      notes: visa.notes || ''
    });
    setShowVisaModal(true);
  };

  const handleSaveCultureNote = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        country: selectedCountry._id,
        title: cultureNoteForm.title,
        category: cultureNoteForm.category,
        content: cultureNoteForm.content,
        tags: cultureNoteForm.tags ? cultureNoteForm.tags.split(',').map(t => t.trim()) : [],
        city: cultureNoteForm.cityId || undefined
      };

      let res;
      if (editingCultureNoteId) {
        res = await api.cultureNotes.update(editingCultureNoteId, payload);
      } else {
        res = await api.cultureNotes.create(payload);
      }

      if (res.success) {
        setSuccess(editingCultureNoteId ? 'Culture note updated successfully!' : 'Culture note created successfully!');
        setShowCultureNoteModal(false);
        setEditingCultureNoteId(null);
        setCultureNoteForm({ title: '', category: 'local_customs', content: '', tags: '', cityId: '' });
        // Refresh country info
        handleSelectCountry(selectedCountry);
      }
    } catch (err) {
      setError(err.message || 'Failed to save culture note.');
    }
  };

  const handleDeleteCultureNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this culture note?')) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.cultureNotes.delete(id);
      if (res.success) {
        setSuccess('Culture note deleted successfully!');
        // Refresh country info
        handleSelectCountry(selectedCountry);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete culture note.');
    }
  };

  const handleEditCultureNoteClick = (note) => {
    setEditingCultureNoteId(note._id);
    setCultureNoteForm({
      title: note.title || '',
      category: note.category || 'local_customs',
      content: note.content || '',
      tags: note.tags ? note.tags.join(', ') : '',
      cityId: note.city?._id || note.city || ''
    });
    setShowCultureNoteModal(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="resp-dashboard">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px' }}>🕌</span>
          <h2 style={styles.brandText}>TravelCity</h2>
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <FaSun color="#f59e0b" size={16} /> : <FaMoon color="#4f46e5" size={16} />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="btn-secondary"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </header>

      {/* Sidebar Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`resp-sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
        <Link href="/" style={{ ...styles.brand, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <span style={styles.brandIcon}>🕌</span>
          <div>
            <h2 style={styles.brandText}>TravelCity</h2>
            <span style={styles.brandTag}>Muslim Explorer Portal</span>
          </div>
        </Link>

        <div className="db-user-card">
          <div style={styles.avatar}>
            <FaUser size={20} color="var(--primary)" />
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user.name || 'Traveler'}</p>
            <span style={styles.userRole}>{user.role || 'Explorer'}</span>
          </div>
        </div>

        <nav style={styles.menu}>
          <button
            onClick={() => { setActiveTab('explorer'); setIsSidebarOpen(false); }}
            className={`db-menu-item ${activeTab === 'explorer' ? 'db-menu-item-active' : ''}`}
          >
            <FaMapMarkedAlt size={18} />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => { setActiveTab('itineraries'); setIsSidebarOpen(false); }}
            className={`db-menu-item ${activeTab === 'itineraries' ? 'db-menu-item-active' : ''}`}
          >
            <FaCalendarAlt size={18} />
            <span>Itineraries</span>
          </button>

          <button
            onClick={() => { setActiveTab('expenses'); setIsSidebarOpen(false); }}
            className={`db-menu-item ${activeTab === 'expenses' ? 'db-menu-item-active' : ''}`}
          >
            <FaCreditCard size={18} />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => { setActiveTab('guides'); setIsSidebarOpen(false); }}
            className={`db-menu-item ${activeTab === 'guides' ? 'db-menu-item-active' : ''}`}
          >
            <FaCompass size={18} />
            <span>Local Guides</span>
          </button>
        </nav>

        {/* Theme Toggle Button in Sidebar */}
        <button 
          onClick={toggleTheme} 
          className="btn-secondary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '10px',
            width: '100%',
            justifyContent: 'flex-start'
          }}
        >
          {theme === 'dark' ? <FaSun color="#f59e0b" size={18} /> : <FaMoon color="#4f46e5" size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button onClick={handleLogout} className="db-logout-btn">
          <FaSignOutAlt size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Workspace */}
      <main className="resp-main">
        {/* Top Header */}
        <header style={styles.contentHeader}>
          <div>
            <h1 style={styles.tabTitle}>
              {activeTab === 'explorer' && 'Destination Explorer'}
              {activeTab === 'itineraries' && 'My Itineraries'}
              {activeTab === 'expenses' && 'Expense Management'}
              {activeTab === 'guides' && 'Certified Local Guides'}
            </h1>
            <p style={styles.tabSubtitle}>
              {activeTab === 'explorer' && 'Browse through cities, landmarks, and entry requirements'}
              {activeTab === 'itineraries' && 'Plan your travel days and allocate project budgets'}
              {activeTab === 'expenses' && 'Log your transportation, hotel, and dining receipts'}
              {activeTab === 'guides' && 'Connect with verified regional guides for customized tours'}
            </p>
          </div>

          <div style={styles.headerActions}>
            {activeTab === 'explorer' && user.role === 'admin' && (
              <>
                <button className="btn-secondary" onClick={() => setShowCountryModal(true)}>
                  <FaPlus /> Add Country
                </button>
                <button className="btn-primary" onClick={() => setShowCityModal(true)}>
                  <FaPlus /> Add City
                </button>
              </>
            )}
            {activeTab === 'itineraries' && (
              <button className="btn-primary" onClick={() => setShowItineraryModal(true)}>
                <FaPlus /> Build Itinerary
              </button>
            )}
            {activeTab === 'expenses' && (
              <button className="btn-primary" onClick={() => setShowExpenseModal(true)}>
                <FaPlus /> Log Expense
              </button>
            )}
          </div>
        </header>

        {error && <div style={styles.errorBanner}>{error}</div>}
        {success && <div style={styles.successBanner}>{success}</div>}

        {/* Tab Contents */}
        <div style={styles.tabBody}>
          {/* EXPLORER TAB */}
          {activeTab === 'explorer' && (
            <div style={styles.explorerLayout} className="explorer-layout-flex">
              {/* Sidebar with countries & cities */}
              <div style={styles.explorerNav} className="explorer-nav-panel">
                <div className="glass-panel" style={styles.explorerSectionCard}>
                  <h3 style={styles.sectionHeader}>Countries</h3>
                  <div style={styles.scrollList}>
                    {isDashboardDataLoading ? (
                      <>
                        <div className="skeleton-box skeleton-item" />
                        <div className="skeleton-box skeleton-item" />
                        <div className="skeleton-box skeleton-item" />
                      </>
                    ) : countries.length === 0 ? (
                      <p style={styles.emptyText}>No countries created yet.</p>
                    ) : (
                      countries.map((c) => (
                        <button
                          key={c._id}
                          onClick={() => handleSelectCountry(c)}
                          className={`db-list-item-btn ${selectedCountry?._id === c._id ? 'db-list-item-btn-active' : ''}`}
                        >
                          <FaGlobe color="var(--primary)" />
                          <div style={{ textAlign: 'left' }}>
                            <p style={styles.listItemName}>{c.name}</p>
                            <span style={styles.listItemSub}>{c.continent} • {c.code}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {selectedCountry && (
                  <div className="glass-panel animate-fade-in" style={{ ...styles.explorerSectionCard, marginTop: '20px' }}>
                    <h3 style={styles.sectionHeader}>Cities in {selectedCountry.name}</h3>
                    <div style={styles.scrollList}>
                      {isDashboardDataLoading ? (
                        <>
                          <div className="skeleton-box skeleton-item" />
                          <div className="skeleton-box skeleton-item" />
                        </>
                      ) : cities.filter(city => city.country === selectedCountry._id || (city.country?._id === selectedCountry._id)).length === 0 ? (
                        <p style={styles.emptyText}>No cities added in this country.</p>
                      ) : (
                        cities
                          .filter(city => city.country === selectedCountry._id || (city.country?._id === selectedCountry._id))
                          .map((ct) => (
                            <button
                              key={ct._id}
                              onClick={() => handleSelectCity(ct)}
                              className={`db-list-item-btn ${selectedCity?._id === ct._id ? 'db-list-item-btn-active' : ''}`}
                            >
                              <FaMapMarkerAlt color="var(--secondary)" />
                              <div style={{ textAlign: 'left' }}>
                                <p style={styles.listItemName}>{ct.name}</p>
                                <span style={styles.listItemSub}>Best Time: {ct.bestTimeToVisit || 'All year'}</span>
                              </div>
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail view area */}
              <div style={styles.explorerDetails}>
                {selectedCity ? (
                  <div className="glass-panel animate-fade-in" style={styles.detailCard}>
                    <div style={styles.detailHeader}>
                      <div>
                        <h2 style={styles.detailTitle}>{selectedCity.name}</h2>
                        <p style={styles.detailMeta}>Country: {selectedCountry?.name}</p>
                      </div>
                      <span style={styles.visitBadge}>Best to visit: {selectedCity.bestTimeToVisit || 'Spring/Autumn'}</span>
                    </div>

                    <p style={styles.detailDesc}>{selectedCity.description || 'No description available for this city.'}</p>
                    
                    {selectedCity.popularFor && selectedCity.popularFor.length > 0 && (
                      <div style={styles.tagGroup}>
                        {selectedCity.popularFor.map((tag, idx) => (
                          <span key={idx} style={styles.tag}>✨ {tag}</span>
                        ))}
                      </div>
                    )}

                    {selectedCity.muslimPopulationNote && (
                      <div style={styles.infoAlert}>
                        <FaInfoCircle color="var(--primary)" size={16} />
                        <p><strong>Note:</strong> {selectedCity.muslimPopulationNote}</p>
                      </div>
                    )}

                    {/* Islamic Companion Services Card */}
                    {(selectedCity.latitude !== undefined || selectedCity.lat !== undefined) && (
                      <div 
                        style={{
                          marginTop: '16px',
                          background: 'rgba(6, 78, 59, 0.12)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                        className="glass-panel animate-fade-in"
                      >
                        <h4 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', margin: 0 }}>
                          🕌 Islamic Traveler Companion
                        </h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                          {/* Qibla Direction */}
                          {calculateQibla(selectedCity.latitude || selectedCity.lat, selectedCity.longitude || selectedCity.lng) && (() => {
                            const qibla = calculateQibla(selectedCity.latitude || selectedCity.lat, selectedCity.longitude || selectedCity.lng);
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: '20px' }}>🧭</div>
                                <div>
                                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qibla Direction</span>
                                  <strong style={{ fontSize: '12px', color: 'var(--secondary)' }}>{qibla.bearing}° {qibla.cardinal}</strong>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Coordinates */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ fontSize: '18px' }}>📍</div>
                            <div>
                              <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coordinates</span>
                              <strong style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{(selectedCity.latitude || selectedCity.lat || 0).toFixed(2)}°, {(selectedCity.longitude || selectedCity.lng || 0).toFixed(2)}°</strong>
                            </div>
                          </div>
                        </div>

                        {/* Estimated Prayer Times */}
                        {estimatePrayerTimes(selectedCity.latitude || selectedCity.lat, selectedCity.longitude || selectedCity.lng) && (() => {
                          const times = estimatePrayerTimes(selectedCity.latitude || selectedCity.lat, selectedCity.longitude || selectedCity.lng);
                          return (
                            <div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Estimated Daily Prayer Times:</span>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 2px', borderRadius: '4px' }}>
                                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>Fajr</span>
                                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>{times.fajr}</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 2px', borderRadius: '4px' }}>
                                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>Dhuhr</span>
                                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>{times.dhuhr}</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 2px', borderRadius: '4px' }}>
                                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>Asr</span>
                                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>{times.asr}</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 2px', borderRadius: '4px' }}>
                                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>Maghrib</span>
                                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>{times.maghrib}</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4px 2px', borderRadius: '4px' }}>
                                  <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>Isha</span>
                                  <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>{times.isha}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <div style={styles.tabsDivider}></div>

                    <h3 style={styles.detailsSubHeader}>🗺️ Tourist Places & Attractions</h3>
                    {loading ? (
                      <p>Loading attractions...</p>
                    ) : cityDetails.places.length === 0 ? (
                      <p style={styles.emptyText}>No local places listed. Admin can add places via the API.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.places.map((place) => (
                          <div key={place._id} style={styles.attractionCard} className="glass-panel">
                            {place.images && place.images.length > 0 && (
                              <img 
                                src={place.images[0]} 
                                alt={place.name} 
                                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} 
                              />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <h4 style={{ margin: 0 }}>{place.name}</h4>
                              {place.category && (
                                <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', color: 'var(--secondary)', textTransform: 'uppercase', flexShrink: 0 }}>
                                  {place.category}
                                </span>
                              )}
                            </div>
                            <p style={styles.attractionDesc}>{place.description}</p>
                            <div style={styles.attractionDetails}>
                              <span>🎫 Fee: {place.entryFee > 0 ? `$${place.entryFee}` : 'Free'}</span>
                              <span>🕒 Hours: {place.openingHours || 'Varies'}</span>
                            </div>
                            {place.address && <p style={styles.attractionAddress}>📍 {place.address}</p>}
                            {place.tags && place.tags.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {place.tags.map((t, idx) => (
                                  <span key={idx} style={{ fontSize: '9px', color: 'var(--text-muted)' }}>#{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.tabsDivider}></div>
                    <h3 style={styles.detailsSubHeader}>🕌 Local Mosques & Prayer Spaces</h3>
                    {loading ? (
                      <p>Loading mosques...</p>
                    ) : cityDetails.mosques.length === 0 ? (
                      <p style={styles.emptyText}>No mosques registered in this city yet.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.mosques.map((mosque) => (
                          <div key={mosque._id} style={styles.attractionCard} className="glass-panel">
                            {mosque.images && mosque.images.length > 0 && (
                              <img src={mosque.images[0]} alt={mosque.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ margin: 0 }}>{mosque.name}</h4>
                              {mosque.sect && (
                                <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(16,185,129,0.1)', borderRadius: '100px', color: 'var(--primary)', textTransform: 'uppercase', flexShrink: 0 }}>
                                  {mosque.sect}
                                </span>
                              )}
                            </div>
                            {mosque.description && <p style={styles.attractionDesc}>{mosque.description}</p>}
                            <div style={styles.attractionDetails}>
                              <span>👥 Capacity: {mosque.capacity || 'Varies'}</span>
                              {mosque.jummahTime && <span>🕌 Jummah: {mosque.jummahTime}</span>}
                            </div>
                            {mosque.address && <p style={styles.attractionAddress}>📍 {mosque.address}</p>}
                            {mosque.facilities && mosque.facilities.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {mosque.facilities.map((f, idx) => (
                                  <span key={idx} style={{ fontSize: '9px', padding: '1px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                    {f.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.tabsDivider}></div>
                    <h3 style={styles.detailsSubHeader}>🍽️ Halal & Vegetarian Dining Options</h3>
                    {loading ? (
                      <p>Loading restaurants...</p>
                    ) : cityDetails.restaurants.length === 0 ? (
                      <p style={styles.emptyText}>No halal restaurants documented in this city.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.restaurants.map((rest) => (
                          <div key={rest._id} style={styles.attractionCard} className="glass-panel">
                            {rest.images && rest.images.length > 0 && (
                              <img src={rest.images[0]} alt={rest.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <h4 style={{ margin: 0 }}>{rest.name}</h4>
                              <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(245,158,11,0.15)', borderRadius: '100px', color: '#fbbf24', textTransform: 'uppercase', flexShrink: 0 }}>
                                {rest.halalStatus?.replace('_', ' ') || 'Unknown'}
                              </span>
                            </div>
                            <div style={styles.attractionDetails}>
                              <span>💰 Price: {rest.priceRange || 'mid'}</span>
                              {rest.rating > 0 && <span>⭐ Rating: {rest.rating}/5</span>}
                            </div>
                            <p style={styles.attractionDesc}><strong>Cuisine:</strong> {rest.cuisine?.join(', ') || 'Various'}</p>
                            {rest.popularDishes && rest.popularDishes.length > 0 && (
                              <p style={styles.attractionDesc}><strong>Dishes:</strong> {rest.popularDishes.join(', ')}</p>
                            )}
                            {rest.address && <p style={styles.attractionAddress}>📍 {rest.address}</p>}
                            {rest.phone && <p style={styles.attractionAddress}>📞 {rest.phone}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.tabsDivider}></div>
                    <h3 style={styles.detailsSubHeader}>🏨 Muslim-Friendly Accommodations</h3>
                    {loading ? (
                      <p>Loading hotels...</p>
                    ) : cityDetails.hotels.length === 0 ? (
                      <p style={styles.emptyText}>No hotels registered in this city yet.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.hotels.map((hotel) => (
                          <div key={hotel._id} style={styles.attractionCard} className="glass-panel">
                            {hotel.images && hotel.images.length > 0 && (
                              <img src={hotel.images[0]} alt={hotel.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <h4 style={{ margin: 0 }}>{hotel.name}</h4>
                              <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(6,78,59,0.2)', borderRadius: '100px', color: 'var(--primary)', fontWeight: 'bold', flexShrink: 0 }}>
                                Score: {hotel.muslimFriendlyScore || 0}/10
                              </span>
                            </div>
                            <div style={styles.attractionDetails}>
                              <span>⭐ Stars: {'⭐'.repeat(hotel.starRating || 0)}</span>
                              <span>💵 From: ${hotel.pricePerNight || 0}/night</span>
                            </div>
                            {hotel.address && <p style={styles.attractionAddress}>📍 {hotel.address}</p>}
                            {hotel.amenities && hotel.amenities.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {hotel.amenities.map((a, idx) => (
                                  <span key={idx} style={{ fontSize: '9px', padding: '1px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                    {a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={styles.tabsDivider}></div>
                    <h3 style={styles.detailsSubHeader}>🚌 Inter-city Transit & Connections</h3>
                    {loading ? (
                      <p>Loading transport options...</p>
                    ) : cityDetails.transports.length === 0 ? (
                      <p style={styles.emptyText}>No outbound transit connections logged from this city.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.transports.map((tr) => (
                          <div key={tr._id} style={styles.attractionCard} className="glass-panel">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ textTransform: 'capitalize', margin: 0 }}>🚀 {tr.type || 'Transit'}</h4>
                              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold' }}>
                                {tr.estimatedCost} {tr.currency || 'USD'}
                              </span>
                            </div>
                            <p style={styles.attractionDesc}><strong>Provider:</strong> {tr.provider || 'Local Transit'}</p>
                            <div style={styles.attractionDetails}>
                              <span>🕒 Duration: {tr.estimatedDuration || 'Varies'}</span>
                              {tr.toCity && <span>📍 Destination: {typeof tr.toCity === 'object' ? tr.toCity.name : cities.find(c => c._id === tr.toCity)?.name || 'Next City'}</span>}
                            </div>
                            {tr.notes && <p style={styles.attractionDesc}>📝 {tr.notes}</p>}
                            {tr.bookingUrl && (
                              <a href={tr.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center', display: 'flex', fontSize: '11px', padding: '6px' }}>
                                Book Tickets Online
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : selectedCountry ? (
                  <div className="glass-panel animate-fade-in" style={styles.detailCard}>
                    <h2 style={styles.detailTitle}>{selectedCountry.name}</h2>
                    <p style={styles.detailMeta}>Continent: {selectedCountry.continent} | Currency: {selectedCountry.currency || 'USD'}</p>
                    <p style={styles.detailDesc}>{selectedCountry.description || 'No additional country details provided.'}</p>
                    
                    <div style={styles.countryMetaData}>
                      <div style={styles.metaBox}>
                        <strong>Safety Level:</strong>
                        <span style={{ color: selectedCountry.safetyLevel === 'high' ? 'var(--success)' : 'var(--warning)' }}>
                          {selectedCountry.safetyLevel?.toUpperCase() || 'MEDIUM'}
                        </span>
                      </div>
                      <div style={styles.metaBox}>
                        <strong>Best Time to Visit:</strong>
                        <span>{selectedCountry.bestTimeToVisit || 'Anytime'}</span>
                      </div>
                    </div>

                    <div style={styles.tabsDivider}></div>

                    {/* Fun Fact / Trivia Card */}
                    {selectedCountry && getCountryFunFact(selectedCountry.name) && (
                      <div 
                        style={{
                          background: 'rgba(217, 119, 6, 0.08)',
                          border: '1px dashed rgba(217, 119, 6, 0.4)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          marginBottom: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }} 
                        className="animate-fade-in"
                      >
                        <h4 style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🕌 Cultural Insight & Trivia
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
                          "{getCountryFunFact(selectedCountry.name)}"
                        </p>
                      </div>
                    )}

                    {/* Visa and Culture information */}
                    <div style={styles.countryAdditions} className="country-additions-flex">
                      <div style={styles.additionCol}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ ...styles.detailsSubHeader, margin: 0 }}><FaPassport /> Visa Information</h3>
                          {user.role === 'admin' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {countryInfo.visa ? (
                                <>
                                  <button 
                                    className="btn-secondary" 
                                    style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => handleEditVisaInfoClick(countryInfo.visa)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="btn-secondary" 
                                    style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--accent-red, #ef4444)', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    onClick={() => handleDeleteVisaInfo(countryInfo.visa._id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <button 
                                  className="btn-primary" 
                                  style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  onClick={() => {
                                    setEditingVisaId(null);
                                    setVisaForm({ passportCountry: 'India', visaType: '', applicationMode: 'embassy', documentsRequired: '', processingTime: '', feeAmount: 0, feeCurrency: 'EUR', officialWebsite: '', notes: '' });
                                    setShowVisaModal(true);
                                  }}
                                >
                                  + Add Visa
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {countryInfo.visa ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }} className="glass-panel">
                            <p style={{ margin: 0 }}><strong>Visa Type:</strong> {countryInfo.visa.visaType || 'Tourist'}</p>
                            <p style={{ margin: 0 }}><strong>Passport Country:</strong> {countryInfo.visa.passportCountry || 'Any'}</p>
                            <p style={{ margin: 0 }}><strong>Application Mode:</strong> {countryInfo.visa.applicationMode?.toUpperCase() || 'EMBASSY'}</p>
                            <p style={{ margin: 0 }}><strong>Processing Time:</strong> {countryInfo.visa.processingTime || 'N/A'}</p>
                            {countryInfo.visa.fee && (
                              <p style={{ margin: 0 }}><strong>Visa Fee:</strong> {countryInfo.visa.fee.amount} {countryInfo.visa.fee.currency || 'USD'}</p>
                            )}
                            {countryInfo.visa.officialWebsite && (
                              <p style={{ margin: 0 }}>
                                <strong>Official Website:</strong>{' '}
                                <a href={countryInfo.visa.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                  Visit Website
                                </a>
                              </p>
                            )}
                            {countryInfo.visa.documentsRequired && countryInfo.visa.documentsRequired.length > 0 && (
                              <p style={{ margin: 0 }}><strong>Required Docs:</strong> {countryInfo.visa.documentsRequired.join(', ')}</p>
                            )}
                            {countryInfo.visa.notes && <p style={{ margin: 0 }}><strong>Notes:</strong> {countryInfo.visa.notes}</p>}
                          </div>
                        ) : (
                          <p style={styles.emptyText}>No visa rules uploaded for this country.</p>
                        )}
                      </div>

                      <div style={styles.additionCol}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ ...styles.detailsSubHeader, margin: 0 }}><FaInfoCircle /> Culture Notes</h3>
                          {user.role === 'admin' && (
                            <button 
                              className="btn-primary" 
                              style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                setEditingCultureNoteId(null);
                                setCultureNoteForm({ title: '', category: 'local_customs', content: '', tags: '', cityId: '' });
                                setShowCultureNoteModal(true);
                              }}
                            >
                              + Add Note
                            </button>
                          )}
                        </div>
                        {countryInfo.cultureNotes.length > 0 ? (
                          countryInfo.cultureNotes.map((note) => (
                            <div key={note._id} className="glass-panel" style={{ padding: '16px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h4 style={{ margin: 0 }}>{note.title || 'General Custom'}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '9px', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                    {note.category?.replace('_', ' ') || 'Other'}
                                  </span>
                                  {user.role === 'admin' && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button 
                                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px', padding: '2px' }}
                                        onClick={() => handleEditCultureNoteClick(note)}
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        style={{ background: 'none', border: 'none', color: 'var(--accent-red, #ef4444)', cursor: 'pointer', fontSize: '11px', padding: '2px' }}
                                        onClick={() => handleDeleteCultureNote(note._id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{note.content}</p>
                              {note.tags && note.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                                  {note.tags.map((t, idx) => (
                                    <span key={idx} style={{ fontSize: '9px', padding: '1px 6px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', color: 'var(--primary)' }}>
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p style={styles.emptyText}>No cultural customs documented yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.selectPrompt}>
                    <FaMapMarkedAlt size={48} color="var(--text-muted)" />
                    <h3>Select a country or city to begin exploring</h3>
                    <p>Navigate the regional directory on the left to see details about languages, currencies, visa terms, and top attractions.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ITINERARIES TAB */}
          {activeTab === 'itineraries' && (
            <div>
              {isDashboardDataLoading ? (
                <div style={styles.cardsGrid}>
                  <div className="skeleton-box skeleton-card" />
                  <div className="skeleton-box skeleton-card" />
                  <div className="skeleton-box skeleton-card" />
                </div>
              ) : itineraries.length === 0 ? (
                <div style={styles.selectPrompt}>
                  <FaCalendarAlt size={48} color="var(--text-muted)" />
                  <h3>No Travel Itineraries</h3>
                  <p>You haven't planned any trips yet. Click the "Build Itinerary" button on the top right to start planning.</p>
                </div>
              ) : (
                <div style={styles.cardsGrid}>
                  {itineraries.map((it) => {
                    const countryName = countries.find(c => c._id === it.country || (c._id === it.country?._id))?.name || 'Unknown Country';
                    
                    // Sum up expenditures belonging to this itinerary
                    const itineraryExpenses = expenses.filter(e => e.itinerary === it._id || e.itinerary?._id === it._id);
                    const totalSpent = itineraryExpenses.reduce((sum, curr) => sum + (curr.amount || 0), 0);
                    const budget = it.budget || 0;
                    const spentPercentage = budget > 0 ? Math.min(100, (totalSpent / budget) * 100) : 0;
                    const isOverBudget = totalSpent > budget;
                    
                    let progressColor = 'var(--success)';
                    if (isOverBudget) {
                      progressColor = 'var(--danger)';
                    } else if (totalSpent > budget * 0.75) {
                      progressColor = 'var(--warning)';
                    }

                    return (
                      <div key={it._id} className="glass-panel-interactive" style={styles.itineraryCard}>
                        <div style={styles.itineraryHeader}>
                          <div>
                            <h3 style={styles.cardTitle}>{it.title}</h3>
                            <p style={styles.cardSubtitle}>📍 {countryName}</p>
                          </div>
                          <button onClick={() => handleDeleteItinerary(it._id)} style={styles.deleteIconBtn}>
                            <FaTrash />
                          </button>
                        </div>
                        
                        <div style={styles.cardDates}>
                          <span>📅 {it.startDate ? new Date(it.startDate).toLocaleDateString() : 'TBD'}</span>
                          <span> - </span>
                          <span>{it.endDate ? new Date(it.endDate).toLocaleDateString() : 'TBD'}</span>
                        </div>

                        <div style={styles.budgetRow}>
                          <span style={styles.budgetText}>Budget:</span>
                          <span style={styles.budgetAmount}>${budget}</span>
                        </div>

                        {/* Spent vs Budget Progress Bar */}
                        <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Spent: <strong style={{ color: isOverBudget ? 'var(--danger)' : 'var(--text-primary)' }}>${totalSpent.toFixed(2)}</strong></span>
                            <span style={{ color: progressColor, fontWeight: '700' }}>
                              {isOverBudget ? '⚠️ OVER BUDGET' : `${spentPercentage.toFixed(0)}%`}
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${spentPercentage}%`, height: '100%', background: progressColor, borderRadius: '3px', transition: 'width 0.3s ease' }} />
                          </div>
                        </div>

                        {/* Shows linked cities if any */}
                        {it.cities && it.cities.length > 0 && (
                          <div style={{ marginTop: '12px' }}>
                            <p style={styles.citiesLabel}>Cities included:</p>
                            <div style={styles.smallTagGroup}>
                              {it.cities.map((c, i) => {
                                const cityName = cities.find(ct => ct._id === c || ct._id === c?._id)?.name || 'City';
                                return <span key={i} style={styles.smallTag}>{cityName}</span>;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div style={styles.expenseLayout} className="expense-layout-flex">
              {/* Left Column: Expenses Summary */}
              <div style={styles.expenseSummary} className="expense-summary-panel">
                <div className="glass-panel" style={styles.summaryCard}>
                  <h3 style={styles.sectionHeader}>Financial Overview</h3>
                  <div style={styles.totalBox}>
                    <FaMoneyBillWave size={28} color="var(--success)" />
                    <div>
                      <p style={styles.totalLabel}>Total Logged Expenditures</p>
                      <h2 style={styles.totalValue}>
                        ${expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0).toFixed(2)}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ ...styles.summaryCard, marginTop: '20px' }}>
                  <h3 style={styles.sectionHeader}>Category Distribution</h3>
                  <div style={styles.categoryList}>
                    {['food', 'hotel', 'transport', 'tickets', 'shopping', 'visa', 'other'].map(cat => {
                      const amount = expenses.filter(e => e.category === cat).reduce((sum, curr) => sum + (curr.amount || 0), 0);
                      if (amount === 0) return null;
                      return (
                        <div key={cat} style={styles.categoryRow}>
                          <span style={styles.catName}>{cat.toUpperCase()}</span>
                          <span style={styles.catVal}>${amount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Expenses List */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="glass-panel" style={{ padding: '24px', minHeight: '300px' }}>
                  <h3 style={styles.sectionHeader}>Transaction Log</h3>
                  {isDashboardDataLoading ? (
                    <div className="skeleton-box skeleton-table" />
                  ) : expenses.length === 0 ? (
                    <p style={styles.emptyText}>No expenses recorded yet. Click "Log Expense" above.</p>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Itinerary</th>
                            <th style={styles.th}>Note</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map((exp) => {
                            const itineraryTitle = itineraries.find(i => i._id === exp.itinerary || (i._id === exp.itinerary?._id))?.title || 'General';
                            return (
                              <tr key={exp._id} style={styles.tr}>
                                <td style={styles.td}>
                                  <span style={{
                                    ...styles.categoryBadge,
                                    background: 
                                      exp.category === 'food' ? 'rgba(16, 185, 129, 0.15)' : 
                                      exp.category === 'hotel' ? 'rgba(168, 85, 247, 0.15)' : 
                                      exp.category === 'transport' ? 'rgba(249, 115, 22, 0.15)' : 
                                      exp.category === 'tickets' ? 'rgba(20, 184, 166, 0.15)' : 
                                      exp.category === 'shopping' ? 'rgba(236, 72, 153, 0.15)' : 
                                      exp.category === 'visa' ? 'rgba(6, 182, 212, 0.15)' : 
                                      'rgba(255, 255, 255, 0.05)',
                                    color: 
                                      exp.category === 'food' ? 'var(--success)' : 
                                      exp.category === 'hotel' ? 'var(--accent-purple)' : 
                                      exp.category === 'transport' ? 'var(--accent-orange)' : 
                                      exp.category === 'tickets' ? 'var(--accent-teal)' : 
                                      exp.category === 'shopping' ? 'var(--accent-pink)' : 
                                      exp.category === 'visa' ? 'var(--secondary)' : 
                                      'var(--text-secondary)',
                                    border: '1px solid currentColor',
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                  }}>
                                    {exp.category}
                                  </span>
                                </td>
                                <td style={styles.td}>{itineraryTitle}</td>
                                <td style={styles.td}>{exp.note || '-'}</td>
                                <td style={{ ...styles.td, fontWeight: '700' }}>${exp.amount.toFixed(2)}</td>
                                <td style={styles.td}>
                                  <button onClick={() => handleDeleteExpense(exp._id)} style={styles.deleteIconBtn}>
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LOCAL GUIDES TAB */}
          {activeTab === 'guides' && (
            <div>
              {isDashboardDataLoading ? (
                <div style={styles.cardsGrid}>
                  <div className="skeleton-box skeleton-card" />
                  <div className="skeleton-box skeleton-card" />
                  <div className="skeleton-box skeleton-card" />
                </div>
              ) : guides.length === 0 ? (
                <div style={styles.selectPrompt}>
                  <FaCompass size={48} color="var(--text-muted)" />
                  <h3>No Guides Available</h3>
                  <p>There are no local guides registered in the system yet. Guides can register using the signup portal.</p>
                </div>
              ) : (
                <div style={styles.cardsGrid}>
                  {guides.map((g) => (
                    <div key={g._id} className="glass-panel" style={styles.guideCard}>
                      <div style={styles.avatarLarge}>
                        {g.user?.avatarUrl ? (
                          <img src={g.user.avatarUrl} alt={g.user.name || 'Local Guide'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <FaUser size={30} color="var(--primary)" />
                        )}
                      </div>
                      <h3 style={styles.guideName}>{g.user?.name || g.name || 'Local Guide'}</h3>
                      <p style={styles.guideLoc}>
                        📍 Serves: {g.servedCities && g.servedCities.length > 0 
                          ? g.servedCities.map(c => c?.name).filter(Boolean).join(', ') 
                          : (g.city?.name || 'Various Cities')}
                      </p>
                      
                      <div style={styles.guideDetails}>
                        <p><strong>Languages:</strong> {g.languages?.join(', ') || 'English'}</p>
                        <p><strong>Hourly Rate:</strong> {g.hourlyRate || 'TBD'} {g.currency || 'EUR'}/hr</p>
                        <p><strong>Expertise:</strong> {g.expertiseArea || g.expertise?.join(', ') || 'General Touring'}</p>
                        {g.availableDays && g.availableDays.length > 0 && (
                          <p><strong>Availability:</strong> {g.availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</p>
                        )}
                        {g.rating > 0 && (
                          <p><strong>Rating:</strong> ⭐ {g.rating.toFixed(1)} / 5.0</p>
                        )}
                      </div>

                      {(g.contactWhatsapp || g.user?.phone || g.phone) && (
                        <a 
                          href={g.contactWhatsapp ? `https://wa.me/${g.contactWhatsapp.replace(/\s+/g, '').replace('+', '')}` : `tel:${g.user?.phone || g.phone}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary" 
                          style={{ marginTop: '16px', width: '100%', justifyContent: 'center', display: 'flex', textDecoration: 'none' }}
                        >
                          {g.contactWhatsapp ? 'Chat on WhatsApp' : 'Contact Guide'}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ================= MODALS ================= */}

      {/* Country Modal */}
      {showCountryModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Add Country Profile</h3>
              <button style={styles.closeBtn} onClick={() => setShowCountryModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCountry} style={styles.modalForm}>
              <input type="text" required placeholder="Country Name (e.g. Saudi Arabia)" style={styles.modalInput} value={countryForm.name} onChange={e => setCountryForm({...countryForm, name: e.target.value})} />
              <input type="text" required maxLength={3} placeholder="Country Code (e.g. SA)" style={styles.modalInput} value={countryForm.code} onChange={e => setCountryForm({...countryForm, code: e.target.value})} />
              <input type="text" required placeholder="Continent (e.g. Asia)" style={styles.modalInput} value={countryForm.continent} onChange={e => setCountryForm({...countryForm, continent: e.target.value})} />
              <textarea placeholder="Description" style={styles.modalTextarea} value={countryForm.description} onChange={e => setCountryForm({...countryForm, description: e.target.value})} />
              <input type="text" placeholder="Currency (e.g. SAR)" style={styles.modalInput} value={countryForm.currency} onChange={e => setCountryForm({...countryForm, currency: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '14px' }}>Safety Level:</label>
                <select style={styles.modalSelect} value={countryForm.safetyLevel} onChange={e => setCountryForm({...countryForm, safetyLevel: e.target.value})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Country</button>
            </form>
          </div>
        </div>
      )}

      {/* City Modal */}
      {showCityModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Add City Profile</h3>
              <button style={styles.closeBtn} onClick={() => setShowCityModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateCity} style={styles.modalForm}>
              <input type="text" required placeholder="City Name (e.g. Mecca)" style={styles.modalInput} value={cityForm.name} onChange={e => setCityForm({...cityForm, name: e.target.value})} />
              <select required style={styles.modalSelect} value={cityForm.country} onChange={e => setCityForm({...cityForm, country: e.target.value})}>
                <option value="">Select Country</option>
                {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <textarea placeholder="Description" style={styles.modalTextarea} value={cityForm.description} onChange={e => setCityForm({...cityForm, description: e.target.value})} />
              <input type="text" placeholder="Popular For (comma separated, e.g. Pilgrimage, History)" style={styles.modalInput} value={cityForm.popularFor} onChange={e => setCityForm({...cityForm, popularFor: e.target.value})} />
              <input type="text" placeholder="Best time to visit (e.g. November to March)" style={styles.modalInput} value={cityForm.bestTimeToVisit} onChange={e => setCityForm({...cityForm, bestTimeToVisit: e.target.value})} />
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save City</button>
            </form>
          </div>
        </div>
      )}

      {/* Itinerary Modal */}
      {showItineraryModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Build New Itinerary</h3>
              <button style={styles.closeBtn} onClick={() => setShowItineraryModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateItinerary} style={styles.modalForm}>
              <input type="text" required placeholder="Itinerary Title (e.g. Summer in Spain)" style={styles.modalInput} value={itineraryForm.title} onChange={e => setItineraryForm({...itineraryForm, title: e.target.value})} />
              <select required style={styles.modalSelect} value={itineraryForm.country} onChange={e => setItineraryForm({...itineraryForm, country: e.target.value})}>
                <option value="">Select Target Country</option>
                {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="number" required placeholder="Trip Budget ($)" style={styles.modalInput} value={itineraryForm.budget} onChange={e => setItineraryForm({...itineraryForm, budget: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Start Date</label>
                  <input type="date" required style={styles.modalInput} value={itineraryForm.startDate} onChange={e => setItineraryForm({...itineraryForm, startDate: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>End Date</label>
                  <input type="date" required style={styles.modalInput} value={itineraryForm.endDate} onChange={e => setItineraryForm({...itineraryForm, endDate: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Itinerary</button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Log New Expense</h3>
              <button style={styles.closeBtn} onClick={() => setShowExpenseModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateExpense} style={styles.modalForm}>
              <select required style={styles.modalSelect} value={expenseForm.itinerary} onChange={e => setExpenseForm({...expenseForm, itinerary: e.target.value})}>
                <option value="">Select Itinerary</option>
                {itineraries.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
              </select>
              <select required style={styles.modalSelect} value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                <option value="other">Category: Other</option>
                <option value="food">Category: Food</option>
                <option value="hotel">Category: Accommodation/Hotel</option>
                <option value="transport">Category: Transport</option>
                <option value="tickets">Category: Tickets/Sights</option>
                <option value="shopping">Category: Shopping</option>
                <option value="visa">Category: Visa fees</option>
              </select>
              <input type="number" required placeholder="Amount ($)" style={styles.modalInput} value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
              <input type="text" placeholder="Notes (e.g. Airport taxi, Dinner)" style={styles.modalInput} value={expenseForm.note} onChange={e => setExpenseForm({...expenseForm, note: e.target.value})} />
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Log Transaction</button>
            </form>
          </div>
        </div>
      )}

      {/* Visa Modal */}
      {showVisaModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingVisaId ? 'Edit Visa Information' : 'Add Visa Information'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowVisaModal(false)}>×</button>
            </div>
            <form onSubmit={handleSaveVisaInfo} style={styles.modalForm}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Country: <strong>{selectedCountry?.name}</strong>
              </div>
              <input 
                type="text" 
                required 
                placeholder="Visa Type (e.g. Tourist Visa)" 
                style={styles.modalInput} 
                value={visaForm.visaType} 
                onChange={e => setVisaForm({...visaForm, visaType: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Passport Country (default: India)" 
                style={styles.modalInput} 
                value={visaForm.passportCountry} 
                onChange={e => setVisaForm({...visaForm, passportCountry: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Application Mode:</label>
                <select 
                  style={styles.modalSelect} 
                  value={visaForm.applicationMode} 
                  onChange={e => setVisaForm({...visaForm, applicationMode: e.target.value})}
                >
                  <option value="evisa">E-Visa</option>
                  <option value="embassy">Embassy</option>
                  <option value="visa_on_arrival">Visa on Arrival</option>
                  <option value="visa_free">Visa Free</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input 
                type="text" 
                placeholder="Documents Required (comma-separated, e.g. Passport, Photo)" 
                style={styles.modalInput} 
                value={visaForm.documentsRequired} 
                onChange={e => setVisaForm({...visaForm, documentsRequired: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Processing Time (e.g. 5 Days)" 
                style={styles.modalInput} 
                value={visaForm.processingTime} 
                onChange={e => setVisaForm({...visaForm, processingTime: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="number" 
                    placeholder="Fee Amount" 
                    style={styles.modalInput} 
                    value={visaForm.feeAmount} 
                    onChange={e => setVisaForm({...visaForm, feeAmount: e.target.value})} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    placeholder="Currency (e.g. EUR)" 
                    style={styles.modalInput} 
                    value={visaForm.feeCurrency} 
                    onChange={e => setVisaForm({...visaForm, feeCurrency: e.target.value})} 
                  />
                </div>
              </div>
              <input 
                type="url" 
                placeholder="Official Website URL" 
                style={styles.modalInput} 
                value={visaForm.officialWebsite} 
                onChange={e => setVisaForm({...visaForm, officialWebsite: e.target.value})} 
              />
              <textarea 
                placeholder="Additional Notes" 
                style={styles.modalTextarea} 
                value={visaForm.notes} 
                onChange={e => setVisaForm({...visaForm, notes: e.target.value})} 
              />
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                {editingVisaId ? 'Update Visa Info' : 'Save Visa Info'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Culture Note Modal */}
      {showCultureNoteModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel animate-fade-in" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingCultureNoteId ? 'Edit Culture Note' : 'Add Culture Note'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowCultureNoteModal(false)}>×</button>
            </div>
            <form onSubmit={handleSaveCultureNote} style={styles.modalForm}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Country: <strong>{selectedCountry?.name}</strong>
              </div>
              <input 
                type="text" 
                required 
                placeholder="Title (e.g. Removing Shoes)" 
                style={styles.modalInput} 
                value={cultureNoteForm.title} 
                onChange={e => setCultureNoteForm({...cultureNoteForm, title: e.target.value})} 
              />
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Category:</label>
                <select 
                  style={styles.modalSelect} 
                  value={cultureNoteForm.category} 
                  onChange={e => setCultureNoteForm({...cultureNoteForm, category: e.target.value})}
                >
                  <option value="local_customs">Local Customs</option>
                  <option value="food">Food</option>
                  <option value="religion">Religion</option>
                  <option value="history">History</option>
                  <option value="safety">Safety</option>
                  <option value="language">Language</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>City (Optional):</label>
                <select 
                  style={styles.modalSelect} 
                  value={cultureNoteForm.cityId} 
                  onChange={e => setCultureNoteForm({...cultureNoteForm, cityId: e.target.value})}
                >
                  <option value="">All Cities / General Country</option>
                  {cities.filter(c => {
                    const cid = typeof c.country === 'object' ? c.country?._id : c.country;
                    return cid === selectedCountry?._id;
                  }).map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <textarea 
                required
                placeholder="Note Content" 
                style={styles.modalTextarea} 
                value={cultureNoteForm.content} 
                onChange={e => setCultureNoteForm({...cultureNoteForm, content: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Tags (comma-separated, e.g. etiquette, dining)" 
                style={styles.modalInput} 
                value={cultureNoteForm.tags} 
                onChange={e => setCultureNoteForm({...cultureNoteForm, tags: e.target.value})} 
              />
              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                {editingCultureNoteId ? 'Update Note' : 'Save Note'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styling mapping
const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
    color: 'var(--text-secondary)'
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.05)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  dashboard: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    borderRight: '1px solid var(--border-color)',
    borderRadius: '0',
    position: 'fixed',
    top: 0,
    bottom: 0,
    zIndex: 10
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  brandIcon: {
    fontSize: '28px'
  },
  brandText: {
    fontSize: '18px',
    fontWeight: '700',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  brandTag: {
    fontSize: '11px',
    color: 'var(--text-muted)'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    marginBottom: '28px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    overflow: 'hidden'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  userRole: {
    fontSize: '11px',
    color: 'var(--primary)'
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '1'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.04)',
      color: 'var(--text-primary)'
    }
  },
  menuItemActive: {
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    color: 'var(--danger)',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: 'auto'
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    padding: '40px 8%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  tabTitle: {
    fontSize: '32px',
    fontWeight: '800'
  },
  tabSubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--danger)',
    color: '#f87171',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  successBanner: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid var(--success)',
    color: '#34d399',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  tabBody: {
    flex: 1
  },
  explorerLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start'
  },
  explorerNav: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column'
  },
  explorerSectionCard: {
    padding: '20px'
  },
  sectionHeader: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    color: 'var(--text-primary)'
  },
  scrollList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '350px',
    overflowY: 'auto'
  },
  listItemBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.06)',
      borderColor: 'rgba(255,255,255,0.2)'
    }
  },
  listItemBtnActive: {
    background: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'var(--primary)'
  },
  listItemName: {
    fontSize: '14px',
    fontWeight: '600'
  },
  listItemSub: {
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '20px 0'
  },
  explorerDetails: {
    flex: 1,
    minHeight: '400px'
  },
  detailCard: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  detailTitle: {
    fontSize: '28px',
    fontWeight: '700'
  },
  detailMeta: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  visitBadge: {
    padding: '6px 12px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    color: 'var(--secondary)',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600'
  },
  detailDesc: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    fontSize: '12px'
  },
  infoAlert: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.5'
  },
  tabsDivider: {
    height: '1px',
    background: 'var(--border-color)',
    margin: '10px 0'
  },
  detailsSubHeader: {
    fontSize: '18px',
    fontWeight: '600'
  },
  attractionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px'
  },
  attractionCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '12px'
  },
  attractionDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  attractionDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  attractionAddress: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  countryMetaData: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  metaBox: {
    flex: '1',
    minWidth: '150px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px'
  },
  countryAdditions: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  additionCol: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  infoBox: {
    padding: '16px',
    fontSize: '13px',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  selectPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '350px',
    textAlign: 'center',
    gap: '16px',
    color: 'var(--text-secondary)',
    padding: '40px'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  itineraryCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  itineraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600'
  },
  cardSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  cardDates: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    gap: '4px'
  },
  budgetRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.02)',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    marginTop: '4px'
  },
  budgetText: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  budgetAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--success)'
  },
  citiesLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    marginBottom: '6px'
  },
  smallTagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
  },
  smallTag: {
    padding: '2px 6px',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '600'
  },
  deleteIconBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    ':hover': {
      color: 'var(--danger)',
      background: 'rgba(239, 68, 68, 0.1)'
    }
  },
  expenseLayout: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start'
  },
  expenseSummary: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column'
  },
  summaryCard: {
    padding: '24px'
  },
  totalBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '10px'
  },
  totalLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px'
  },
  catName: {
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  catVal: {
    fontWeight: '700'
  },
  expenseList: {
    flex: 1
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    marginTop: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '12px 16px',
    borderBottom: '2px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600'
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    ':hover': {
      background: 'rgba(255,255,255,0.01)'
    }
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px'
  },
  categoryBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600'
  },
  guideCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px'
  },
  avatarLarge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    marginBottom: '8px'
  },
  guideName: {
    fontSize: '18px',
    fontWeight: '600'
  },
  guideLoc: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  guideDetails: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
    marginTop: '8px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 6, 23, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    width: '90%',
    maxWidth: '500px',
    padding: '32px',
    position: 'relative'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '24px',
    cursor: 'pointer',
    ':hover': { color: 'var(--text-primary)' }
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalInput: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none'
  },
  modalTextarea: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    outline: 'none'
  },
  modalSelect: {
    background: '#0d192d',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  }
};
