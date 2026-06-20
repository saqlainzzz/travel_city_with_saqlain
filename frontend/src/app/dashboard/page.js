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
    hotels: []
  });
  const [countryInfo, setCountryInfo] = useState({
    visa: null,
    cultureNotes: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form states
  const [countryForm, setCountryForm] = useState({ name: '', code: '', continent: '', description: '', currency: '', safetyLevel: 'medium' });
  const [cityForm, setCityForm] = useState({ name: '', country: '', description: '', popularFor: '', bestTimeToVisit: '' });
  const [itineraryForm, setItineraryForm] = useState({ title: '', country: '', budget: '', startDate: '', endDate: '' });
  const [expenseForm, setExpenseForm] = useState({ itinerary: '', category: 'other', amount: '', currency: 'USD', note: '' });

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
      if (res.success) setGuides(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial Fetching
  useEffect(() => {
    if (user) {
      fetchCountries();
      fetchCities();
      fetchItineraries();
      fetchExpenses();
      fetchGuides();
    }
  }, [user, fetchCountries, fetchCities, fetchItineraries, fetchExpenses, fetchGuides]);

  // Fetch Details for selected City
  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    setError('');
    try {
      // Simulate loading related items (Places, Mosques, Hotels, Restaurants) from backend or endpoints if available.
      // In our boilerplate, we can hit GET /api/places?city=ID or try catch
      let fetchedPlaces = [];
      try {
        const placeRes = await api.places.list(city._id);
        if (placeRes.success) fetchedPlaces = placeRes.data || [];
      } catch (err) {
        console.warn('Places API failed or empty', err);
      }

      setCityDetails({
        places: fetchedPlaces,
        mosques: [],
        restaurants: [],
        hotels: []
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

        <div style={styles.userCard}>
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
            style={{
              ...styles.menuItem,
              ...(activeTab === 'explorer' ? styles.menuItemActive : {}),
            }}
          >
            <FaMapMarkedAlt size={18} />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => { setActiveTab('itineraries'); setIsSidebarOpen(false); }}
            style={{
              ...styles.menuItem,
              ...(activeTab === 'itineraries' ? styles.menuItemActive : {}),
            }}
          >
            <FaCalendarAlt size={18} />
            <span>Itineraries</span>
          </button>

          <button
            onClick={() => { setActiveTab('expenses'); setIsSidebarOpen(false); }}
            style={{
              ...styles.menuItem,
              ...(activeTab === 'expenses' ? styles.menuItemActive : {}),
            }}
          >
            <FaCreditCard size={18} />
            <span>Expenses</span>
          </button>

          <button
            onClick={() => { setActiveTab('guides'); setIsSidebarOpen(false); }}
            style={{
              ...styles.menuItem,
              ...(activeTab === 'guides' ? styles.menuItemActive : {}),
            }}
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

        <button onClick={handleLogout} style={styles.logoutBtn}>
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
                    {countries.length === 0 ? (
                      <p style={styles.emptyText}>No countries created yet.</p>
                    ) : (
                      countries.map((c) => (
                        <button
                          key={c._id}
                          onClick={() => handleSelectCountry(c)}
                          style={{
                            ...styles.listItemBtn,
                            ...(selectedCountry?._id === c._id ? styles.listItemBtnActive : {})
                          }}
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
                      {cities.filter(city => city.country === selectedCountry._id || (city.country?._id === selectedCountry._id)).length === 0 ? (
                        <p style={styles.emptyText}>No cities added in this country.</p>
                      ) : (
                        cities
                          .filter(city => city.country === selectedCountry._id || (city.country?._id === selectedCountry._id))
                          .map((ct) => (
                            <button
                              key={ct._id}
                              onClick={() => handleSelectCity(ct)}
                              style={{
                                ...styles.listItemBtn,
                                ...(selectedCity?._id === ct._id ? styles.listItemBtnActive : {})
                              }}
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

                    <div style={styles.tabsDivider}></div>

                    <h3 style={styles.detailsSubHeader}>🗺️ Tourist Places / Attractions</h3>
                    {loading ? (
                      <p>Loading attractions...</p>
                    ) : cityDetails.places.length === 0 ? (
                      <p style={styles.emptyText}>No local places listed. Admin can add places via the API.</p>
                    ) : (
                      <div style={styles.attractionsGrid}>
                        {cityDetails.places.map((place) => (
                          <div key={place._id} style={styles.attractionCard} className="glass-panel">
                            <h4>{place.name}</h4>
                            <p style={styles.attractionDesc}>{place.description}</p>
                            <div style={styles.attractionDetails}>
                              <span>🎫 Fee: {place.entryFee > 0 ? `$${place.entryFee}` : 'Free'}</span>
                              <span>🕒 Hours: {place.openingHours || 'Varies'}</span>
                            </div>
                            {place.address && <p style={styles.attractionAddress}>📍 {place.address}</p>}
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

                    {/* Visa and Culture information */}
                    <div style={styles.countryAdditions} className="country-additions-flex">
                      <div style={styles.additionCol}>
                        <h3 style={styles.detailsSubHeader}><FaPassport /> Visa Information</h3>
                        {countryInfo.visa ? (
                          <div style={styles.infoBox} className="glass-panel">
                            <p><strong>Visa Required:</strong> {countryInfo.visa.visaRequired ? 'Yes' : 'No'}</p>
                            <p><strong>Requirements:</strong> {countryInfo.visa.requirements}</p>
                            <p><strong>Max Stay:</strong> {countryInfo.visa.maxStayDays ? `${countryInfo.visa.maxStayDays} days` : 'N/A'}</p>
                          </div>
                        ) : (
                          <p style={styles.emptyText}>No visa rules uploaded for this country.</p>
                        )}
                      </div>

                      <div style={styles.additionCol}>
                        <h3 style={styles.detailsSubHeader}><FaInfoCircle /> Culture & Custom Notes</h3>
                        {countryInfo.cultureNotes.length > 0 ? (
                          countryInfo.cultureNotes.map((note) => (
                            <div key={note._id} style={styles.infoBox} className="glass-panel">
                              <h4>{note.title || 'General Custom'}</h4>
                              <p>{note.note}</p>
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
              {itineraries.length === 0 ? (
                <div style={styles.selectPrompt}>
                  <FaCalendarAlt size={48} color="var(--text-muted)" />
                  <h3>No Travel Itineraries</h3>
                  <p>You haven't planned any trips yet. Click the "Build Itinerary" button on the top right to start planning.</p>
                </div>
              ) : (
                <div style={styles.cardsGrid}>
                  {itineraries.map((it) => {
                    const countryName = countries.find(c => c._id === it.country || (c._id === it.country?._id))?.name || 'Unknown Country';
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
                          <span style={styles.budgetAmount}>${it.budget || 0}</span>
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
              <div style={styles.expenseList} style={{ flex: 1, minWidth: 0 }}>
                <div className="glass-panel" style={{ padding: '24px', minHeight: '300px' }}>
                  <h3 style={styles.sectionHeader}>Transaction Log</h3>
                  {expenses.length === 0 ? (
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
              {guides.length === 0 ? (
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
                        <FaUser size={30} color="var(--primary)" />
                      </div>
                      <h3 style={styles.guideName}>{g.user?.name || g.name || 'Local Guide'}</h3>
                      <p style={styles.guideLoc}>📍 Serves: {g.city?.name || 'Various Cities'}</p>
                      
                      <div style={styles.guideDetails}>
                        <p><strong>Languages:</strong> {g.languages?.join(', ') || 'English'}</p>
                        <p><strong>Hourly Rate:</strong> ${g.hourlyRate || 'TBD'}/hr</p>
                        <p><strong>Expertise:</strong> {g.expertiseArea || 'General Touring'}</p>
                      </div>

                      {g.phone && (
                        <a href={`tel:${g.phone}`} className="btn-primary" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                          Contact Guide
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
