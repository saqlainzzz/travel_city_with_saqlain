require('dotenv').config();
process.env.VERCEL = 'true'; // Prevent server.js from auto-listening on port 5000 on require
const http = require('http');
const mongoose = require('mongoose');

// Import models to query dynamic references
const User = require('./src/models/User');
const Country = require('./src/models/Country');
const City = require('./src/models/City');
const Place = require('./src/models/Place');
const Mosque = require('./src/models/Mosque');
const Restaurant = require('./src/models/Restaurant');
const Hotel = require('./src/models/Hotel');
const LocalGuide = require('./src/models/LocalGuide');
const TravelItinerary = require('./src/models/TravelItinerary');

const app = require('./server');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('\n==================================================');
  console.log('         API ROUTE VERIFICATION SUITE');
  console.log('==================================================\n');

  // Connect to DB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // 1. Obtain Admin Authentication Token
  console.log('Step 1: Logging in as Admin...');
  let token = '';
  let adminUserId = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@travelcity.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    if (loginData.success && loginData.token) {
      token = loginData.token;
      adminUserId = loginData.data.id || loginData.data._id;
      console.log('Successfully logged in. Token acquired.');
    } else {
      throw new Error(loginData.message || 'Login failed');
    }
  } catch (err) {
    console.error('Critical Error: Failed to login admin user.', err.message);
    process.exit(1);
  }

  // 2. Fetch Reference IDs from seeded Database to ensure valid associations
  console.log('\nStep 2: Fetching DB reference items...');
  const ref = {};
  try {
    ref.country = await Country.findOne();
    ref.city = await City.findOne();
    ref.place = await Place.findOne();
    ref.mosque = await Mosque.findOne();
    ref.restaurant = await Restaurant.findOne();
    ref.hotel = await Hotel.findOne();
    ref.user = await User.findOne({ role: 'traveler' });
    ref.guide = await User.findOne({ role: 'localGuide' });
    ref.itinerary = await TravelItinerary.findOne();
    ref.localGuide = await LocalGuide.findOne();

    console.log(`Fetched references successfully:
- User ID: ${ref.user?._id}
- Guide User ID: ${ref.guide?._id}
- Country ID: ${ref.country?._id} (${ref.country?.name})
- City ID: ${ref.city?._id} (${ref.city?.name})
- Place ID: ${ref.place?._id} (${ref.place?.name})
- Hotel ID: ${ref.hotel?._id} (${ref.hotel?.name})
- LocalGuide ID: ${ref.localGuide?._id}
- Itinerary ID: ${ref.itinerary?._id}
`);
  } catch (err) {
    console.error('Error fetching database references:', err.message);
    process.exit(1);
  }

  // 3. Define all standard resource specifications
  const specs = [
    {
      name: 'Users',
      endpoint: '/api/users',
      createPayload: () => ({
        name: 'Temporary Test User',
        email: `temp_${Date.now()}@travelcity.com`,
        password: 'password123',
        role: 'traveler'
      }),
      updatePayload: () => ({
        name: 'Updated Temporary User'
      })
    },
    {
      name: 'Countries',
      endpoint: '/api/countries',
      createPayload: () => ({
        name: `Test Country ${Date.now()}`,
        code: `TC${String(Date.now()).slice(-1)}`,
        continent: 'Test Continent',
        description: 'A country created during test run.'
      }),
      updatePayload: () => ({
        description: 'Updated test country description.'
      })
    },
    {
      name: 'Cities',
      endpoint: '/api/cities',
      createPayload: () => ({
        name: `Test City ${Date.now()}`,
        country: ref.country?._id,
        description: 'A city created during test run.'
      }),
      updatePayload: () => ({
        description: 'Updated test city description.'
      })
    },
    {
      name: 'Places',
      endpoint: '/api/places',
      createPayload: () => ({
        name: `Test Place ${Date.now()}`,
        city: ref.city?._id,
        country: ref.country?._id,
        description: 'Historic landmark.'
      }),
      updatePayload: () => ({
        description: 'Updated landmark.'
      })
    },
    {
      name: 'Mosques',
      endpoint: '/api/mosque',
      createPayload: () => ({
        name: `Test Mosque ${Date.now()}`,
        city: ref.city?._id,
        country: ref.country?._id,
        address: 'Al-Madinah street'
      }),
      updatePayload: () => ({
        address: 'New Mosque address'
      })
    },
    {
      name: 'Restaurants',
      endpoint: '/api/restaurants',
      createPayload: () => ({
        name: `Test Diner ${Date.now()}`,
        city: ref.city?._id,
        country: ref.country?._id,
        cuisine: ['Halal Grill'],
        halalStatus: 'certified'
      }),
      updatePayload: () => ({
        name: 'Updated Diner Name'
      })
    },
    {
      name: 'Hotels',
      endpoint: '/api/hotels',
      createPayload: () => ({
        name: `Test Suites ${Date.now()}`,
        city: ref.city?._id,
        country: ref.country?._id,
        address: 'Downtown central',
        starRating: 4
      }),
      updatePayload: () => ({
        starRating: 5
      })
    },
    {
      name: 'LocalGuides',
      endpoint: '/api/local-guides',
      createPayload: () => ({
        user: ref.guide?._id,
        city: ref.city?._id,
        languages: ['English', 'Turkish'],
        hourlyRate: 40,
        expertise: ['history']
      }),
      updatePayload: () => ({
        hourlyRate: 45
      })
    },
    {
      name: 'CultureNotes',
      endpoint: '/api/culture-notes',
      createPayload: () => ({
        title: `Greeting customs ${Date.now()}`,
        country: ref.country?._id,
        content: 'Shake hands politely.',
        category: 'local_customs'
      }),
      updatePayload: () => ({
        content: 'Greet with a smile and handshake.'
      })
    },
    {
      name: 'VisaInfo',
      endpoint: '/api/visa-info',
      createPayload: () => ({
        country: ref.country?._id,
        visaType: 'Electronic Visa Waiver',
        applicationMode: 'evisa',
        notes: 'Process takes 48 hours.'
      }),
      updatePayload: () => ({
        notes: 'Requires online payment.'
      })
    },
    {
      name: 'TravelItineraries',
      endpoint: '/api/travel-itineraries',
      createPayload: () => ({
        title: `My dream tour ${Date.now()}`,
        user: adminUserId,
        country: ref.country?._id,
        budget: 1500
      }),
      updatePayload: () => ({
        budget: 1800
      })
    },
    {
      name: 'TravelExpenses',
      endpoint: '/api/travel-expenses',
      createPayload: () => ({
        user: adminUserId,
        itinerary: ref.itinerary?._id,
        category: 'transport',
        amount: 250,
        currency: 'USD'
      }),
      updatePayload: () => ({
        amount: 280
      })
    },
    {
      name: 'Favorites',
      endpoint: '/api/favorite',
      createPayload: () => ({
        user: adminUserId,
        itemType: 'Place',
        itemId: ref.place?._id
      }),
      updatePayload: () => ({
        notes: 'My favorite spot!'
      })
    },
    {
      name: 'Reviews',
      endpoint: '/api/reviews',
      createPayload: () => ({
        user: adminUserId,
        targetType: 'Place',
        targetId: ref.place?._id,
        rating: 5,
        comment: 'Outstanding view and rich background.'
      }),
      updatePayload: () => ({
        rating: 4,
        comment: 'Slightly crowded but otherwise great.'
      })
    },
    {
      name: 'TransportOptions',
      endpoint: '/api/transport-option',
      createPayload: () => ({
        fromCity: ref.city?._id,
        toCity: ref.city?._id,
        type: 'train',
        estimatedCost: 15
      }),
      updatePayload: () => ({
        estimatedCost: 20
      })
    }
  ];

  const results = [];

  // 4. Run the CRUD operations for each spec
  for (const spec of specs) {
    console.log(`\nTesting resource: ${spec.name} (${spec.endpoint})`);
    
    // Headers setup
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // A. GET (List)
    let listStatus = 'FAILED';
    let listCode = 0;
    try {
      const res = await fetch(`${BASE_URL}${spec.endpoint}`, { headers });
      listCode = res.status;
      if (res.ok) listStatus = 'PASSED';
    } catch (e) {
      console.error(`- GET List failed:`, e.message);
    }
    console.log(`- GET List: ${listStatus} (HTTP ${listCode})`);

    // B. POST (Create)
    let createStatus = 'FAILED';
    let createCode = 0;
    let createdId = null;
    let postError = '';
    try {
      const payload = spec.createPayload();
      const res = await fetch(`${BASE_URL}${spec.endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      createCode = res.status;
      const resJson = await res.json();
      if (res.ok && resJson.success && resJson.data) {
        createStatus = 'PASSED';
        createdId = resJson.data._id;
      } else {
        postError = resJson.message || 'Error details unknown';
      }
    } catch (e) {
      postError = e.message;
      console.error(`- POST Create failed:`, e.message);
    }
    console.log(`- POST Create: ${createStatus} (HTTP ${createCode})${postError ? ` - Error: ${postError}` : ''}`);

    // If POST failed, we cannot test GET :id, PUT, or DELETE. Mark them as skipped.
    if (!createdId) {
      console.log(`- Skipping GET Single, PUT, and DELETE due to creation failure.`);
      results.push({
        resource: spec.name,
        getList: { status: listStatus, code: listCode },
        postCreate: { status: createStatus, code: createCode, error: postError },
        getSingle: { status: 'SKIPPED', code: '-' },
        putUpdate: { status: 'SKIPPED', code: '-' },
        deleteRecord: { status: 'SKIPPED', code: '-' }
      });
      continue;
    }

    // C. GET Single (:id)
    let singleStatus = 'FAILED';
    let singleCode = 0;
    try {
      const res = await fetch(`${BASE_URL}${spec.endpoint}/${createdId}`, { headers });
      singleCode = res.status;
      if (res.ok) singleStatus = 'PASSED';
    } catch (e) {
      console.error(`- GET Single failed:`, e.message);
    }
    console.log(`- GET Single: ${singleStatus} (HTTP ${singleCode})`);

    // D. PUT (Update)
    let updateStatus = 'FAILED';
    let updateCode = 0;
    try {
      const payload = spec.updatePayload();
      const res = await fetch(`${BASE_URL}${spec.endpoint}/${createdId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      updateCode = res.status;
      const resJson = await res.json();
      if (res.ok && resJson.success) updateStatus = 'PASSED';
    } catch (e) {
      console.error(`- PUT Update failed:`, e.message);
    }
    console.log(`- PUT Update: ${updateStatus} (HTTP ${updateCode})`);

    // E. DELETE (Clean up)
    let deleteStatus = 'FAILED';
    let deleteCode = 0;
    try {
      const res = await fetch(`${BASE_URL}${spec.endpoint}/${createdId}`, {
        method: 'DELETE',
        headers
      });
      deleteCode = res.status;
      const resJson = await res.json();
      if (res.ok && resJson.success) deleteStatus = 'PASSED';
    } catch (e) {
      console.error(`- DELETE failed:`, e.message);
    }
    console.log(`- DELETE Cleanup: ${deleteStatus} (HTTP ${deleteCode})`);

    results.push({
      resource: spec.name,
      getList: { status: listStatus, code: listCode },
      postCreate: { status: createStatus, code: createCode },
      getSingle: { status: singleStatus, code: singleCode },
      putUpdate: { status: updateStatus, code: updateCode },
      deleteRecord: { status: deleteStatus, code: deleteCode }
    });
  }

  // 5. Generate and Print final report
  console.log('\n==================================================');
  console.log('             API RUN VERIFICATION REPORT');
  console.log('==================================================\n');

  console.log('| Resource | GET List | POST Create | GET Single | PUT Update | DELETE |');
  console.log('|----------|----------|-------------|------------|------------|--------|');
  
  let totalTests = 0;
  let passedTests = 0;

  for (const r of results) {
    const formatCell = (test) => `${test.status === 'PASSED' ? '✅' : test.status === 'FAILED' ? '❌' : '🟡'} (${test.code})`;
    console.log(`| ${r.resource} | ${formatCell(r.getList)} | ${formatCell(r.postCreate)} | ${formatCell(r.getSingle)} | ${formatCell(r.putUpdate)} | ${formatCell(r.deleteRecord)} |`);
    
    // Count stats
    const list = [r.getList, r.postCreate, r.getSingle, r.putUpdate, r.deleteRecord];
    for (const test of list) {
      if (test.status !== 'SKIPPED') {
        totalTests++;
        if (test.status === 'PASSED') passedTests++;
      }
    }
  }

  console.log(`\nVerification Score: ${passedTests} / ${totalTests} passed (${Math.round((passedTests / totalTests) * 100)}%)\n`);

  return { results, score: { passed: passedTests, total: totalTests } };
}

// Start Express Server and trigger tests
const server = http.createServer(app);
server.listen(PORT, async () => {
  console.log(`Server started internally on port ${PORT} to perform API test operations.`);
  try {
    const report = await runTests();
    // Write markdown report to artifacts folder
    const fs = require('fs');
    const path = require('path');
    
    let md = `# API Verification Suite Results\n\n`;
    md += `**Date Run:** ${new Date().toISOString()}\n`;
    md += `**Verification Score:** ${report.score.passed} / ${report.score.total} passed (${Math.round((report.score.passed / report.score.total) * 100)}%)\n\n`;
    md += `| Resource | GET List | POST Create | GET Single | PUT Update | DELETE |\n`;
    md += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;
    
    for (const r of report.results) {
      const cell = (t) => `${t.status === 'PASSED' ? '✅' : t.status === 'FAILED' ? '❌' : '🟡'} (${t.code})`;
      md += `| ${r.resource} | ${cell(r.getList)} | ${cell(r.postCreate)} | ${cell(r.getSingle)} | ${cell(r.putUpdate)} | ${cell(r.deleteRecord)} |\n`;
    }
    
    const artifactPath = path.join(__dirname, 'api_test_results.md');
    fs.writeFileSync(artifactPath, md);
    console.log(`Detailed verification report written to: ${artifactPath}`);

  } catch (err) {
    console.error('Error during test suite run:', err);
  } finally {
    server.close(() => {
      console.log('Test server closed. Exiting test runner.');
      process.exit(0);
    });
  }
});
