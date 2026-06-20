const mongoose = require('mongoose');
require('dotenv').config();

// Require models
const User = require('./src/models/User');
const Country = require('./src/models/Country');
const City = require('./src/models/City');
const Place = require('./src/models/Place');
const Mosque = require('./src/models/Mosque');
const Restaurant = require('./src/models/Restaurant');
const Hotel = require('./src/models/Hotel');
const LocalGuide = require('./src/models/LocalGuide');
const CultureNote = require('./src/models/CultureNote');
const VisaInfo = require('./src/models/VisaInfo');
const TravelItinerary = require('./src/models/TravelItinerary');
const Review = require('./src/models/Review');
const Favorite = require('./src/models/Favorite');
const TransportOption = require('./src/models/TransportOption');
const TravelExpense = require('./src/models/TravelExpense');

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to database:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 2. Clear all collections
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Country.deleteMany({});
    await City.deleteMany({});
    await Place.deleteMany({});
    await Mosque.deleteMany({});
    await Restaurant.deleteMany({});
    await Hotel.deleteMany({});
    await LocalGuide.deleteMany({});
    await CultureNote.deleteMany({});
    await VisaInfo.deleteMany({});
    await TravelItinerary.deleteMany({});
    await Review.deleteMany({});
    await Favorite.deleteMany({});
    await TransportOption.deleteMany({});
    await TravelExpense.deleteMany({});
    console.log('Existing collections cleared.');

    // 3. Create Users (Total: 9)
    console.log('Seeding Users...');
    const users = await User.create([
      { name: 'Admin User', email: 'admin@travelcity.com', password: 'password123', role: 'admin', phone: '+34600111222' },
      { name: 'Aamir Faizan', email: 'aamir@travelcity.com', password: 'password123', role: 'traveler', phone: '+966500111222' },
      { name: 'Carlos Local', email: 'carlos@travelcity.com', password: 'password123', role: 'localGuide', phone: '+34699111333' },
      { name: 'Fatima Guide', email: 'fatima@travelcity.com', password: 'password123', role: 'localGuide', phone: '+966555111222' },
      { name: 'Tarek Explorer', email: 'tarek@travelcity.com', password: 'password123', role: 'traveler', phone: '+20100999888' },
      { name: 'Zainab Tour', email: 'zainab@travelcity.com', password: 'password123', role: 'localGuide', phone: '+97150999888' },
      { name: 'Malik Ahmad', email: 'malik@travelcity.com', password: 'password123', role: 'traveler', phone: '+6012999888' },
      { name: 'Yusuf Guide', email: 'yusuf@travelcity.com', password: 'password123', role: 'localGuide', phone: '+90532111222' },
      { name: 'Salma Traveler', email: 'salma@travelcity.com', password: 'password123', role: 'traveler', phone: '+212600222333' }
    ]);
    console.log(`Seeded ${users.length} Users.`);

    // 4. Create Countries (Total: 9)
    console.log('Seeding Countries...');
    const countries = await Country.create([
      { name: 'Spain', code: 'ES', continent: 'Europe', description: 'Mediterranean nation with rich historical Islamic heritage in Andalusia.', currency: 'EUR', languages: ['Spanish'], bestTimeToVisit: 'Spring & Fall', safetyLevel: 'high' },
      { name: 'Saudi Arabia', code: 'SA', continent: 'Asia', description: 'The spiritual heart of Islam, containing Mecca and Medina.', currency: 'SAR', languages: ['Arabic'], bestTimeToVisit: 'Winter', safetyLevel: 'high' },
      { name: 'Japan', code: 'JP', continent: 'Asia', description: 'Island nation blending cherry blossoms, wooden shrines, and high-tech cities.', currency: 'JPY', languages: ['Japanese'], bestTimeToVisit: 'Spring & Fall', safetyLevel: 'high' },
      { name: 'Turkey', code: 'TR', continent: 'Europe', description: 'Unique cultural bridge displaying magnificent Ottoman mosques and heritage.', currency: 'TRY', languages: ['Turkish'], bestTimeToVisit: 'Spring & Fall', safetyLevel: 'medium' },
      { name: 'United Arab Emirates', code: 'AE', continent: 'Asia', description: 'Modern desert oasis with futuristic architecture and stunning mosques.', currency: 'AED', languages: ['Arabic', 'English'], bestTimeToVisit: 'Winter', safetyLevel: 'high' },
      { name: 'Egypt', code: 'EG', continent: 'Africa', description: 'Land of the Pharaohs and historic Islamic architecture, minarets, and the Nile.', currency: 'EGP', languages: ['Arabic'], bestTimeToVisit: 'Winter', safetyLevel: 'medium' },
      { name: 'Malaysia', code: 'MY', continent: 'Asia', description: 'Southeast Asian nation offering rich tropical rainforests and Islamic cultural harmony.', currency: 'MYR', languages: ['Malay'], bestTimeToVisit: 'Year-round', safetyLevel: 'high' },
      { name: 'Morocco', code: 'MA', continent: 'Africa', description: 'North African kingdom of vibrant colors, bustling spice souks, and beautiful riads.', currency: 'MAD', languages: ['Arabic', 'Berber'], bestTimeToVisit: 'Spring & Fall', safetyLevel: 'high' },
      { name: 'Indonesia', code: 'ID', continent: 'Asia', description: 'The worlds largest Muslim population spread over thousands of tropical volcanic islands.', currency: 'IDR', languages: ['Indonesian'], bestTimeToVisit: 'Dry season (May to Sept)', safetyLevel: 'medium' }
    ]);
    console.log(`Seeded ${countries.length} Countries.`);

    const countryMap = {};
    countries.forEach(c => { countryMap[c.code] = c; });

    // 5. Create Cities (Total: 11)
    console.log('Seeding Cities...');
    const cities = await City.create([
      { name: 'Madrid', country: countryMap['ES']._id, description: 'Elegant capital of Spain.', latitude: 40.416, longitude: -3.703, popularFor: ['Museums', 'Palaces'], muslimPopulationNote: 'Halal dining growing in Lavapies district.', bestTimeToVisit: 'Spring & Fall' },
      { name: 'Barcelona', country: countryMap['ES']._id, description: 'Cosmopolitan seaside city in Catalonia.', latitude: 41.385, longitude: 2.173, popularFor: ['Sagrada Familia', 'Park Guell'], muslimPopulationNote: 'Halal food options in Raval area.', bestTimeToVisit: 'Spring & Summer' },
      { name: 'Riyadh', country: countryMap['SA']._id, description: 'Modern financial hub of Saudi Arabia.', latitude: 24.713, longitude: 46.675, popularFor: ['Kingdom Center', 'Boulevards'], muslimPopulationNote: '100% Muslim city with prayer halls everywhere.', bestTimeToVisit: 'Winter' },
      { name: 'Jeddah', country: countryMap['SA']._id, description: 'Historic Red Sea port and gateway to Mecca.', latitude: 21.543, longitude: 39.172, popularFor: ['Al-Balad', 'Corniche'], muslimPopulationNote: 'Bustling historical pilgrimage routes.', bestTimeToVisit: 'Winter' },
      { name: 'Tokyo', country: countryMap['JP']._id, description: 'Futuristic and clean capital of Japan.', latitude: 35.676, longitude: 139.65, popularFor: ['Shibuya Crossing', 'Temples'], muslimPopulationNote: 'Halal dining maps recommended.', bestTimeToVisit: 'Spring & Autumn' },
      { name: 'Istanbul', country: countryMap['TR']._id, description: 'Historic capital bridging Europe and Asia.', latitude: 41.008, longitude: 28.978, popularFor: ['Hagia Sophia', 'Bosphorus'], muslimPopulationNote: 'Standard Halal food and active mosques everywhere.', bestTimeToVisit: 'Spring to Autumn' },
      { name: 'Dubai', country: countryMap['AE']._id, description: 'Futuristic city known for luxury shopping and tall towers.', latitude: 25.204, longitude: 55.27, popularFor: ['Burj Khalifa', 'Shopping Malls'], muslimPopulationNote: 'Halal dining, call to prayer in malls.', bestTimeToVisit: 'Winter' },
      { name: 'Cairo', country: countryMap['EG']._id, description: 'The city of a thousand minarets.', latitude: 30.044, longitude: 31.235, popularFor: ['Pyramids', 'Khan el-Khalili'], muslimPopulationNote: 'Historic center of Islamic scholarship.', bestTimeToVisit: 'Winter' },
      { name: 'Kuala Lumpur', country: countryMap['MY']._id, description: 'Bustling tropical metropolis of Malaysia.', latitude: 3.139, longitude: 101.686, popularFor: ['Petronas Towers', 'Batu Caves'], muslimPopulationNote: 'Fully Halal friendly, state-of-the-art mosques.', bestTimeToVisit: 'Year-round' },
      { name: 'Marrakech', country: countryMap['MA']._id, description: 'Imperial city with vibrant markets and courtyards.', latitude: 31.629, longitude: -7.981, popularFor: ['Jemaa el-Fnaa', 'Palaces'], muslimPopulationNote: 'Predominantly Muslim, Islamic call to prayer.', bestTimeToVisit: 'Spring & Autumn' },
      { name: 'Jakarta', country: countryMap['ID']._id, description: 'Bustling volcanic capital of Indonesia.', latitude: -6.208, longitude: 106.845, popularFor: ['Monas', 'Istiqlal Mosque'], muslimPopulationNote: 'Worlds largest mosque capacity is here.', bestTimeToVisit: 'Dry season' }
    ]);
    console.log(`Seeded ${cities.length} Cities.`);

    const cityMap = {};
    cities.forEach(c => { cityMap[c.name] = c; });

    // 6. Create Places (Total: 13)
    console.log('Seeding Places...');
    const places = await Place.create([
      { name: 'Prado Museum', city: cityMap['Madrid']._id, country: countryMap['ES']._id, category: 'museum', description: 'Spain’s national art museum.', address: 'Madrid Centro', location: { lat: 40.413, lng: -3.692 }, entryFee: 15, openingHours: '10 AM - 8 PM', images: ['https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80'], tags: ['Art'] },
      { name: 'Royal Palace', city: cityMap['Madrid']._id, country: countryMap['ES']._id, category: 'landmark', description: 'Official home of Spanish Royalty.', address: 'Calle de Bailen', location: { lat: 40.417, lng: -3.714 }, entryFee: 12, openingHours: '10 AM - 6 PM', images: ['https://images.unsplash.com/photo-1509840144299-85098009fc03?auto=format&fit=crop&w=800&q=80'], tags: ['History'] },
      { name: 'Sagrada Familia', city: cityMap['Barcelona']._id, country: countryMap['ES']._id, category: 'landmark', description: 'Gaudi’s unfinished basilica.', address: 'Carrer de Mallorca', location: { lat: 41.403, lng: 2.174 }, entryFee: 26, openingHours: '9 AM - 6 PM', images: ['https://images.unsplash.com/photo-1587982649760-70c2f63573b2?auto=format&fit=crop&w=800&q=80'], tags: ['Gaudi'] },
      { name: 'Kingdom Centre Tower', city: cityMap['Riyadh']._id, country: countryMap['SA']._id, category: 'landmark', description: 'Iconic skyscraper with sky bridge.', address: 'Olaya District', location: { lat: 24.711, lng: 46.674 }, entryFee: 20, openingHours: '12 PM - 11 PM', images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80'], tags: ['Modern'] },
      { name: 'Masmak Fortress', city: cityMap['Riyadh']._id, country: countryMap['SA']._id, category: 'historic', description: 'Clay and mud-brick fort.', address: 'Al Thumairi St', location: { lat: 24.631, lng: 46.713 }, entryFee: 0, openingHours: '8 AM - 9 PM', images: ['https://images.unsplash.com/photo-1605389445100-34440c953509?auto=format&fit=crop&w=800&q=80'], tags: ['Heritage'] },
      { name: 'Al-Balad Old Town', city: cityMap['Jeddah']._id, country: countryMap['SA']._id, category: 'historic', description: 'UNESCO ancient town center.', address: 'Jeddah Old District', location: { lat: 21.485, lng: 39.186 }, entryFee: 0, openingHours: '24 Hours', images: ['https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80'], tags: ['Ancient'] },
      { name: 'Senso-ji Temple', city: cityMap['Tokyo']._id, country: countryMap['JP']._id, category: 'landmark', description: 'Tokyo’s oldest temple.', address: 'Asakusa', location: { lat: 35.714, lng: 139.796 }, entryFee: 0, openingHours: '6 AM - 5 PM', images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'], tags: ['Temple'] },
      { name: 'Hagia Sophia', city: cityMap['Istanbul']._id, country: countryMap['TR']._id, category: 'historic', description: 'Byzantine monument turned Ottoman mosque.', address: 'Sultanahmet', location: { lat: 41.008, lng: 28.98 }, entryFee: 25, openingHours: '9 AM - 7 PM', images: ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'], tags: ['Heritage'] },
      
      // 5 New Places
      { name: 'Burj Khalifa Sky', city: cityMap['Dubai']._id, country: countryMap['AE']._id, category: 'landmark', description: 'The worlds tallest building.', address: 'Downtown Dubai', location: { lat: 25.197, lng: 55.274 }, entryFee: 40, openingHours: '8:30 AM - 11 PM', images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'], tags: ['Record'] },
      { name: 'Great Pyramids of Giza', city: cityMap['Cairo']._id, country: countryMap['EG']._id, category: 'historic', description: 'Iconic ancient wonders of Egypt.', address: 'Giza Plateau', location: { lat: 29.979, lng: 31.134 }, entryFee: 10, openingHours: '8 AM - 5 PM', images: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'], tags: ['Ancient'] },
      { name: 'Petronas Twin Towers', city: cityMap['Kuala Lumpur']._id, country: countryMap['MY']._id, category: 'landmark', description: 'Iconic twin skyscrapers.', address: 'KLCC', location: { lat: 3.157, lng: 101.711 }, entryFee: 20, openingHours: '9 AM - 9 PM', images: ['https://images.unsplash.com/photo-1596422846543-75c6fc18a50b?auto=format&fit=crop&w=800&q=80'], tags: ['Modern'] },
      { name: 'Bahia Palace', city: cityMap['Marrakech']._id, country: countryMap['MA']._id, category: 'historic', description: 'Beautiful Moroccan palace with gardens.', address: 'Marrakech Medina', location: { lat: 31.621, lng: -7.981 }, entryFee: 7, openingHours: '9 AM - 5 PM', images: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'], tags: ['Moroccan'] },
      { name: 'National Monument (Monas)', city: cityMap['Jakarta']._id, country: countryMap['ID']._id, category: 'landmark', description: 'National symbol of independence.', address: 'Central Jakarta', location: { lat: -6.175, lng: 106.827 }, entryFee: 2, openingHours: '8 AM - 4 PM', images: ['https://images.unsplash.com/photo-1501979927976-13a8a3a0e14c?auto=format&fit=crop&w=800&q=80'], tags: ['Monas'] }
    ]);
    console.log(`Seeded ${places.length} Places.`);

    // 7. Create Mosques (Total: 9)
    console.log('Seeding Mosques...');
    const mosques = await Mosque.create([
      { name: 'Madrid Central Mosque', city: cityMap['Madrid']._id, country: countryMap['ES']._id, address: 'Tetuán', location: { lat: 40.45, lng: -3.701 }, capacity: 2000, sect: 'sunni', facilities: ['wudu', 'women_area', 'library'], jummahTime: '2:00 PM', description: 'Historic Islamic center.' },
      { name: 'Grand Mosque of Riyadh', city: cityMap['Riyadh']._id, country: countryMap['SA']._id, address: 'As Salam', location: { lat: 24.629, lng: 46.711 }, capacity: 15000, sect: 'sunni', facilities: ['wudu', 'women_area', 'parking', 'library', 'wheelchair_access'], jummahTime: '12:30 PM', description: 'Capital Grand Mosque.' },
      { name: 'Tokyo Camii', city: cityMap['Tokyo']._id, country: countryMap['JP']._id, address: 'Shibuya', location: { lat: 35.668, lng: 139.676 }, capacity: 1200, sect: 'sunni', facilities: ['wudu', 'women_area', 'library'], jummahTime: '12:45 PM', description: 'Iconic Turkish-style Ottoman mosque.' },
      { name: 'Blue Mosque (Sultan Ahmed)', city: cityMap['Istanbul']._id, country: countryMap['TR']._id, address: 'Fatih', location: { lat: 41.005, lng: 28.976 }, capacity: 10000, sect: 'sunni', facilities: ['wudu', 'women_area', 'parking', 'wheelchair_access'], jummahTime: '1:00 PM', description: 'Six-minaret visual marvel.' },
      
      // 5 New Mosques
      { name: 'Sheikh Zayed Grand Mosque', city: cityMap['Dubai']._id, country: countryMap['AE']._id, address: 'Abu Dhabi Highway', location: { lat: 24.412, lng: 54.474 }, capacity: 40000, sect: 'sunni', facilities: ['wudu', 'women_area', 'parking', 'library', 'wheelchair_access'], jummahTime: '1:15 PM', description: 'Breathtaking white marble structure with grand crystal chandeliers.', images: ['https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Al-Azhar Mosque', city: cityMap['Cairo']._id, country: countryMap['EG']._id, address: 'El-Darb el-Ahmar', location: { lat: 30.045, lng: 31.262 }, capacity: 20000, sect: 'sunni', facilities: ['wudu', 'women_area', 'library', 'classes'], jummahTime: '12:15 PM', description: 'One of the oldest universities and centers of Islamic learning.', images: ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'] },
      { name: 'National Mosque of Malaysia', city: cityMap['Kuala Lumpur']._id, country: countryMap['MY']._id, address: 'Jalan Perdana', location: { lat: 3.141, lng: 101.691 }, capacity: 15000, sect: 'sunni', facilities: ['wudu', 'women_area', 'parking', 'wheelchair_access'], jummahTime: '1:10 PM', description: 'Futuristic folding-umbrella roof design symbolizing tropical Islamic identity.', images: ['https://images.unsplash.com/photo-1596422846543-75c6fc18a50b?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Koutoubia Mosque', city: cityMap['Marrakech']._id, country: countryMap['MA']._id, address: 'Medina Area', location: { lat: 31.623, lng: -7.993 }, capacity: 25000, sect: 'sunni', facilities: ['wudu', 'parking', 'wheelchair_access'], jummahTime: '1:00 PM', description: 'Venerable Moorish minaret landmark overlooking Marrakech.', images: ['https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Istiqlal Mosque', city: cityMap['Jakarta']._id, country: countryMap['ID']._id, address: 'Central Jakarta', location: { lat: -6.17, lng: 106.83 }, capacity: 120000, sect: 'sunni', facilities: ['wudu', 'women_area', 'parking', 'library', 'wheelchair_access'], jummahTime: '12:00 PM', description: 'The largest mosque in Southeast Asia, built to commemorate Indonesian independence.', images: ['https://images.unsplash.com/photo-1501979927976-13a8a3a0e14c?auto=format&fit=crop&w=800&q=80'] }
    ]);
    console.log(`Seeded ${mosques.length} Mosques.`);

    // 8. Create Restaurants (Total: 8)
    console.log('Seeding Restaurants...');
    await Restaurant.create([
      { name: 'Al-Kounouz', city: cityMap['Madrid']._id, country: countryMap['ES']._id, cuisine: ['Moroccan'], halalStatus: 'certified', priceRange: 'mid', address: 'Lavapiés', rating: 4.5 },
      { name: 'Najd Village', city: cityMap['Riyadh']._id, country: countryMap['SA']._id, cuisine: ['Saudi'], halalStatus: 'certified', priceRange: 'mid', address: 'Takhassusi', rating: 4.8 },
      { name: 'Halal Sakura', city: cityMap['Tokyo']._id, country: countryMap['JP']._id, cuisine: ['Japanese'], halalStatus: 'certified', priceRange: 'mid', address: 'Taito-ku', rating: 4.6 },
      
      // 5 New Restaurants
      { name: 'Al Safadi Restaurant', city: cityMap['Dubai']._id, country: countryMap['AE']._id, cuisine: ['Lebanese'], halalStatus: 'certified', priceRange: 'mid', address: 'Sheikh Zayed Rd', rating: 4.7, popularDishes: ['Shawarma', 'Mixed Grill', 'Hummus'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Abou El Sid', city: cityMap['Cairo']._id, country: countryMap['EG']._id, cuisine: ['Egyptian'], halalStatus: 'self_declared', priceRange: 'mid', address: 'Zamalek', rating: 4.4, popularDishes: ['Koshary', 'Molokhia', 'Pigeon'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Nasi Kandar Pelita', city: cityMap['Kuala Lumpur']._id, country: countryMap['MY']._id, cuisine: ['Malaysian', 'Indian'], halalStatus: 'certified', priceRange: 'budget', address: 'Jalan Ampang', rating: 4.3, popularDishes: ['Nasi Kandar', 'Roti Canai', 'Teh Tarik'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Al Fassia', city: cityMap['Marrakech']._id, country: countryMap['MA']._id, cuisine: ['Moroccan'], halalStatus: 'certified', priceRange: 'luxury', address: 'Gueliz', rating: 4.6, popularDishes: ['Pigeon Pastilla', 'Tagine', 'Moroccan Salad'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Bebek Bengil (Dirty Duck)', city: cityMap['Jakarta']._id, country: countryMap['ID']._id, cuisine: ['Indonesian', 'Balinese'], halalStatus: 'certified', priceRange: 'mid', address: 'Menteng', rating: 4.5, popularDishes: ['Crispy Duck', 'Sate Lilit'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'] }
    ]);
    console.log('Seeded Restaurants.');

    // 9. Create Hotels (Total: 7)
    console.log('Seeding Hotels...');
    await Hotel.create([
      { name: 'Ritz-Carlton Riyadh', city: cityMap['Riyadh']._id, country: countryMap['SA']._id, address: 'Al Hada', starRating: 5, pricePerNight: 450, amenities: ['Spa', 'Pool'], muslimFriendlyScore: 10, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Sercotel Gran Conde Duque', city: cityMap['Madrid']._id, country: countryMap['ES']._id, address: 'Plaza Conde Suchil', starRating: 4, pricePerNight: 120, amenities: ['WiFi', 'Gym'], muslimFriendlyScore: 6, images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'] },
      
      // 5 New Hotels
      { name: 'Burj Al Arab Jumeirah', city: cityMap['Dubai']._id, country: countryMap['AE']._id, address: 'Jumeirah Beach', starRating: 5, pricePerNight: 1200, amenities: ['Private Beach', 'Butler Service', 'Helipad', 'Infinity Pool'], muslimFriendlyScore: 10, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Mena House Hotel', city: cityMap['Cairo']._id, country: countryMap['EG']._id, address: 'Pyramids Road, Giza', starRating: 5, pricePerNight: 280, amenities: ['Pool', 'WiFi', 'Garden View'], muslimFriendlyScore: 9, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] },
      { name: 'The Majestic Hotel', city: cityMap['Kuala Lumpur']._id, country: countryMap['MY']._id, address: 'Jalan Sultan Hishamuddin', starRating: 5, pricePerNight: 150, amenities: ['Spa', 'WiFi', 'Pool', 'Tea Lounge'], muslimFriendlyScore: 9, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] },
      { name: 'La Mamounia', city: cityMap['Marrakech']._id, country: countryMap['MA']._id, address: 'Avenue Bab Jdid', starRating: 5, pricePerNight: 650, amenities: ['Gardens', 'Spa', 'Pool', 'Casino'], muslimFriendlyScore: 8, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Hotel Indonesia Kempinski', city: cityMap['Jakarta']._id, country: countryMap['ID']._id, address: 'Jalan M.H. Thamrin', starRating: 5, pricePerNight: 200, amenities: ['Spa', 'Rooftop Pool', 'Shopping Access'], muslimFriendlyScore: 9, images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'] }
    ]);
    console.log('Seeded Hotels.');

    // 10. Create Local Guides (Total: 7)
    console.log('Seeding Local Guides...');
    const guidesUsers = [
      users.find(u => u.email === 'carlos@travelcity.com'),
      users.find(u => u.email === 'fatima@travelcity.com'),
      users.find(u => u.email === 'zainab@travelcity.com'),
      users.find(u => u.email === 'yusuf@travelcity.com')
    ];

    await LocalGuide.create([
      { user: guidesUsers[0]._id, city: cityMap['Madrid']._id, languages: ['Spanish', 'English'], bio: 'Madrid history expert.', expertise: ['history', 'culture'], hourlyRate: 35 },
      { user: guidesUsers[1]._id, city: cityMap['Riyadh']._id, languages: ['Arabic', 'English'], bio: 'Al-Balad and heritage guide.', expertise: ['history', 'food', 'mosques'], hourlyRate: 50 },
      
      // 5 New Guides (mapped to our guide users and cities)
      { user: guidesUsers[2]._id, city: cityMap['Dubai']._id, languages: ['English', 'Arabic', 'Urdu'], bio: 'Luxury tours and desert safari advisor.', expertise: ['shopping', 'family_travel'], hourlyRate: 60, currency: 'USD', availableDays: ['friday', 'saturday'], contactWhatsapp: '+97150999888', rating: 4.8 },
      { user: guidesUsers[3]._id, city: cityMap['Istanbul']._id, languages: ['Turkish', 'Arabic', 'English'], bio: 'Deep dive into Constantinople history.', expertise: ['history', 'mosques'], hourlyRate: 40, currency: 'USD', availableDays: ['monday', 'tuesday'], contactWhatsapp: '+90532111222', rating: 4.9 },
      { user: guidesUsers[0]._id, city: cityMap['Barcelona']._id, languages: ['Spanish', 'English', 'French'], bio: 'Gaudi architectural walk coordinator.', expertise: ['culture', 'shopping'], hourlyRate: 40, currency: 'EUR', availableDays: ['friday', 'saturday'], contactWhatsapp: '+34699111333', rating: 4.7 },
      { user: guidesUsers[1]._id, city: cityMap['Jeddah']._id, languages: ['Arabic', 'English'], bio: 'Historian of Red Sea port towns.', expertise: ['history', 'food'], hourlyRate: 55, currency: 'USD', availableDays: ['wednesday', 'thursday'], contactWhatsapp: '+966555111222', rating: 4.8 },
      { user: guidesUsers[2]._id, city: cityMap['Kuala Lumpur']._id, languages: ['Malay', 'English', 'Chinese'], bio: 'Jungle trekking and street food tour planner.', expertise: ['food', 'transport'], hourlyRate: 30, currency: 'USD', availableDays: ['saturday', 'sunday'], contactWhatsapp: '+97150999888', rating: 4.9 }
    ]);
    console.log('Seeded Local Guides.');

    // 11. Create Culture Notes (Total: 8)
    console.log('Seeding Culture Notes...');
    await CultureNote.create([
      { country: countryMap['ES']._id, title: 'Dining Greetings', content: 'Late dining hours and polite informal greetings.', category: 'local_customs' },
      { country: countryMap['SA']._id, title: 'Prayer Closures', content: 'Malls and restaurants pause service briefly during prayers.', category: 'local_customs' },
      { country: countryMap['JP']._id, title: 'No Tipping', content: 'Tipping is not practiced and bows are signs of gratitude.', category: 'local_customs' },
      
      // 5 New Culture Notes
      { country: countryMap['AE']._id, title: 'Ramadan Observance', content: 'Eating or drinking in public during daylight hours in Ramadan is restricted. Malls and restaurants operate late evenings.', category: 'religion' },
      { country: countryMap['EG']._id, title: 'Bargaining & Haggling', content: 'Haggling is completely expected in historic markets like Khan el-Khalili. Remain polite and offer half the starting quote.', category: 'local_customs' },
      { country: countryMap['MY']._id, title: 'Removing Footwear', content: 'Always remove shoes when entering a Malaysian home or stepping onto raised floors of traditional mosques.', category: 'local_customs' },
      { country: countryMap['MA']._id, title: 'Consuming Mint Tea', content: 'Accepting hot mint tea from merchants is a standard sign of Moroccan hospitality and respect.', category: 'local_customs' },
      { country: countryMap['ID']._id, title: 'Right Hand Greetings', content: 'Always use your right hand when giving, receiving, eating or greeting others. The left hand is reserved for personal hygiene.', category: 'local_customs' }
    ]);
    console.log('Seeded Culture Notes.');

    // 12. Create Visa Info (Total: 8)
    console.log('Seeding Visa Info...');
    await VisaInfo.create([
      { country: countryMap['ES']._id, visaType: 'Schengen Tourist', applicationMode: 'embassy', fee: { amount: 80, currency: 'EUR' }, notes: 'Requires travel health insurance.' },
      { country: countryMap['SA']._id, visaType: 'Tourist E-Visa', applicationMode: 'evisa', fee: { amount: 120, currency: 'USD' }, notes: 'E-visa valid for 1 year.' },
      { country: countryMap['JP']._id, visaType: 'Short-Term Visitor', applicationMode: 'embassy', fee: { amount: 8, currency: 'USD' }, notes: 'Requires detailed daily itinerary.' },
      
      // 5 New Visa Infos
      { country: countryMap['AE']._id, visaType: 'Tourist Entry Permit', applicationMode: 'evisa', fee: { amount: 90, currency: 'USD' }, notes: 'Visa free for GCC residents.' },
      { country: countryMap['EG']._id, visaType: 'Visa on Arrival', applicationMode: 'visa_on_arrival', fee: { amount: 25, currency: 'USD' }, notes: 'Available for major international travelers arriving in Cairo airport.' },
      { country: countryMap['MY']._id, visaType: 'eNTRI / Tourist eVisa', applicationMode: 'evisa', fee: { amount: 35, currency: 'USD' }, notes: 'Instant approvals online within 24 hours.' },
      { country: countryMap['MA']._id, visaType: 'Tourist eVisa', applicationMode: 'evisa', fee: { amount: 75, currency: 'USD' }, notes: 'Requires passport copy and hotel booking.' },
      { country: countryMap['ID']._id, visaType: 'Electronic VoA (e-VoA)', applicationMode: 'evisa', fee: { amount: 35, currency: 'USD' }, notes: 'Apply via immigration website to skip airport payment lines.' }
    ]);
    console.log('Seeded Visa Info.');

    // 13. Create Travel Itinerary (Total: 6)
    console.log('Seeding Travel Itineraries...');
    const travelerUser = users.find(u => u.email === 'aamir@travelcity.com');
    const moroccoTraveler = users.find(u => u.email === 'tarek@travelcity.com');

    const itineraries = await TravelItinerary.create([
      { title: 'Summer Explorer in Spain', user: travelerUser._id, country: countryMap['ES']._id, cities: [cityMap['Madrid']._id, cityMap['Barcelona']._id], startDate: new Date('2026-07-10'), endDate: new Date('2026-07-20'), budget: 1500, days: [{ dayNumber: 1, date: new Date('2026-07-10'), city: cityMap['Madrid']._id }], isPublic: true },
      
      // 5 New Itineraries
      { title: 'Mecca Gateway & Jeddah Walk', user: travelerUser._id, country: countryMap['SA']._id, cities: [cityMap['Jeddah']._id, cityMap['Riyadh']._id], startDate: new Date('2026-11-01'), endDate: new Date('2026-11-08'), budget: 2000, days: [{ dayNumber: 1, date: new Date('2026-11-01'), city: cityMap['Jeddah']._id }], isPublic: true },
      { title: 'Dubai Luxury Desert Escape', user: travelerUser._id, country: countryMap['AE']._id, cities: [cityMap['Dubai']._id], startDate: new Date('2026-12-15'), endDate: new Date('2026-12-22'), budget: 3500, days: [{ dayNumber: 1, date: new Date('2026-12-15'), city: cityMap['Dubai']._id }], isPublic: true },
      { title: 'Pyramids & Ancient Cairo Tour', user: moroccoTraveler._id, country: countryMap['EG']._id, cities: [cityMap['Cairo']._id], startDate: new Date('2026-10-05'), endDate: new Date('2026-10-12'), budget: 1200, days: [{ dayNumber: 1, date: new Date('2026-10-05'), city: cityMap['Cairo']._id }], isPublic: true },
      { title: 'Tropical Malaysian Adventure', user: travelerUser._id, country: countryMap['MY']._id, cities: [cityMap['Kuala Lumpur']._id], startDate: new Date('2026-09-01'), endDate: new Date('2026-09-10'), budget: 1600, days: [{ dayNumber: 1, date: new Date('2026-09-01'), city: cityMap['Kuala Lumpur']._id }], isPublic: true },
      { title: 'Marrakech Medina Heritage Walk', user: moroccoTraveler._id, country: countryMap['MA']._id, cities: [cityMap['Marrakech']._id], startDate: new Date('2026-08-15'), endDate: new Date('2026-08-25'), budget: 1100, days: [{ dayNumber: 1, date: new Date('2026-08-15'), city: cityMap['Marrakech']._id }], isPublic: true }
    ]);
    console.log('Seeded Travel Itineraries.');

    // 14. Create Reviews (Total: 7)
    console.log('Seeding Reviews...');
    const targetPlace = places[0]; 
    const targetMosque = mosques[2]; 

    await Review.create([
      { user: travelerUser._id, targetType: 'Place', targetId: targetPlace._id, rating: 5, comment: 'Prado was absolutely spectacular!' },
      { user: travelerUser._id, targetType: 'Mosque', targetId: targetMosque._id, rating: 5, comment: 'Tokyo Camii displays gorgeous calligraphy.' },
      
      // 5 New Reviews
      { user: travelerUser._id, targetType: 'Mosque', targetId: mosques[4]._id, rating: 5, comment: 'Sheikh Zayed Mosque is an architectural crown jewel.' },
      { user: moroccoTraveler._id, targetType: 'Place', targetId: places[9]._id, rating: 5, comment: 'Giza Pyramids are jaw-dropping ancient wonders.' },
      { user: travelerUser._id, targetType: 'Place', targetId: places[10]._id, rating: 4, comment: 'Petronas Towers look fantastic at sunset.' },
      { user: moroccoTraveler._id, targetType: 'Mosque', targetId: mosques[7]._id, rating: 5, comment: 'Koutoubia Mosque captures true Moorish history.' },
      { user: travelerUser._id, targetType: 'Mosque', targetId: mosques[8]._id, rating: 5, comment: 'Istiqlal is incredibly spacious and welcoming.' }
    ]);
    console.log('Seeded Reviews.');

    // 15. Create Favorites (Total: 6)
    console.log('Seeding Favorites...');
    await Favorite.create([
      { user: travelerUser._id, itemType: 'City', itemId: cityMap['Madrid']._id, notes: 'My favorite city in Spain!' },
      
      // 5 New Favorites
      { user: travelerUser._id, itemType: 'City', itemId: cityMap['Riyadh']._id, notes: 'Loved Boulevard City.' },
      { user: travelerUser._id, itemType: 'City', itemId: cityMap['Dubai']._id, notes: 'Stunning modern architecture.' },
      { user: moroccoTraveler._id, itemType: 'City', itemId: cityMap['Cairo']._id, notes: 'A city of massive minarets.' },
      { user: travelerUser._id, itemType: 'City', itemId: cityMap['Kuala Lumpur']._id, notes: 'Halal food heaven.' },
      { user: moroccoTraveler._id, itemType: 'City', itemId: cityMap['Marrakech']._id, notes: 'Incredible souks and spices.' }
    ]);
    console.log('Seeded Favorites.');

    // 16. Create Transport Options (Total: 7)
    console.log('Seeding Transport Options...');
    await TransportOption.create([
      { fromCity: cityMap['Madrid']._id, toCity: cityMap['Barcelona']._id, type: 'train', provider: 'Renfe AVE', estimatedDuration: '2.5 Hours', estimatedCost: 45 },
      { fromCity: cityMap['Riyadh']._id, toCity: cityMap['Jeddah']._id, type: 'flight', provider: 'Saudia Airlines', estimatedDuration: '1.5 Hours', estimatedCost: 80 },
      
      // 5 New Transport Options
      { fromCity: cityMap['Dubai']._id, toCity: cityMap['Riyadh']._id, type: 'flight', provider: 'Emirates', estimatedDuration: '2 Hours', estimatedCost: 150, notes: 'Standard route from DXB to RUH.' },
      { fromCity: cityMap['Cairo']._id, toCity: cityMap['Istanbul']._id, type: 'flight', provider: 'EgyptAir', estimatedDuration: '2 Hours 15 Minutes', estimatedCost: 180, notes: 'Daily flight routes.' },
      { fromCity: cityMap['Kuala Lumpur']._id, toCity: cityMap['Jakarta']._id, type: 'flight', provider: 'AirAsia', estimatedDuration: '2 Hours', estimatedCost: 65, notes: 'Frequent discount flights.' },
      { fromCity: cityMap['Marrakech']._id, toCity: cityMap['Madrid']._id, type: 'flight', provider: 'Ryanair', estimatedDuration: '2 Hours', estimatedCost: 35, notes: 'Affordable link between Spain and Morocco.' },
      { fromCity: cityMap['Madrid']._id, toCity: cityMap['Istanbul']._id, type: 'flight', provider: 'Turkish Airlines', estimatedDuration: '4 Hours', estimatedCost: 220, notes: 'Direct connection from Barajas (MAD).' }
    ]);
    console.log('Seeded Transport Options.');

    // 17. Create Travel Expenses (Total: 8)
    console.log('Seeding Travel Expenses...');
    await TravelExpense.create([
      { user: travelerUser._id, itinerary: itineraries[0]._id, category: 'hotel', amount: 360, note: 'Gran Conde Duque Hotel stay' },
      { user: travelerUser._id, itinerary: itineraries[0]._id, category: 'food', amount: 55, note: 'Dinner at Al-Kounouz' },
      { user: travelerUser._id, itinerary: itineraries[0]._id, category: 'tickets', amount: 15, note: 'Prado Museum ticket entry fee' },
      
      // 5 New Expenses
      { user: travelerUser._id, itinerary: itineraries[1]._id, category: 'visa', amount: 120, note: 'Saudi tourist eVisa fee' },
      { user: travelerUser._id, itinerary: itineraries[2]._id, category: 'hotel', amount: 850, note: 'Jumeirah hotel reservation' },
      { user: moroccoTraveler._id, itinerary: itineraries[3]._id, category: 'tickets', amount: 10, note: 'Pyramid plateau entry ticket' },
      { user: travelerUser._id, itinerary: itineraries[4]._id, category: 'transport', amount: 65, note: 'KL Express airport transit' },
      { user: moroccoTraveler._id, itinerary: itineraries[5]._id, category: 'shopping', amount: 140, note: 'Traditional rug from Marrakech Medina souk' }
    ]);
    console.log('Seeded Travel Expenses.');

    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    await mongoose.disconnect();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Fatal error during database seeding:', error);
    process.exit(1);
  }
};

seedData();
