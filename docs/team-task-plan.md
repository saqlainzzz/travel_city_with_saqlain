# Team Task Plan - Travel City Explorer API

## Application Idea

Travel Guide / City Explorer App

Users can explore countries, cities, places, mosques, halal restaurants, hotels, local guides, transport options, visa information, expenses and personal itineraries.

## Branch Format

```bash
feature/<model_name>-<developer_name>
```

Use lowercase names and hyphen-separated words.

Examples:

```bash
feature/country-rashid
feature/travel-itinerary-faizan
feature/visa-info-saqlain
```

## Suggested Assignment for 11 Team Members

Because the project has 15 models and the team has 11 people, assign 11 core models first and keep 4 models as bonus, pair-work, or phase 2 tasks.

| No. | Model | Priority | Suggested Branch Format |
|---:|---|---|---|
| 1 | User | Core | `feature/user-<developer_name>` |
| 2 | Country | Core | `feature/country-<developer_name>` |
| 3 | City | Core | `feature/city-<developer_name>` |
| 4 | Place | Core | `feature/place-<developer_name>` |
| 5 | Mosque | Core | `feature/mosque-<developer_name>` |
| 6 | Restaurant | Core | `feature/restaurant-<developer_name>` |
| 7 | Hotel | Core | `feature/hotel-<developer_name>` |
| 8 | TravelItinerary | Core | `feature/travel-itinerary-<developer_name>` |
| 9 | Review | Core | `feature/review-<developer_name>` |
| 10 | Favorite | Core | `feature/favorite-<developer_name>` |
| 11 | TransportOption | Core | `feature/transport-option-<developer_name>` |
| 12 | LocalGuide | Phase 2 | `feature/local-guide-<developer_name>` |
| 13 | CultureNote | Phase 2 | `feature/culture-note-<developer_name>` |
| 14 | VisaInfo | Phase 2 | `feature/visa-info-<developer_name>` |
| 15 | TravelExpense | Phase 2 | `feature/travel-expense-<developer_name>` |

## Work Required From Each Developer

Each developer must implement CRUD in their assigned controller file.

Example for Country:

```txt
src/controllers/countryController.js
```

They must implement:

```txt
createCountry
getCountries
getCountryById
updateCountry
deleteCountry
```

## CRUD Acceptance Criteria

For each model, the CRUD should satisfy these requirements:

1. `POST` creates a new record.
2. `GET /` returns all records.
3. `GET /:id` returns one record by ID.
4. `PUT /:id` updates one record by ID.
4. `PUT | PATCH /:id` updates one record by ID. (Optional, you can use body if you want)(params or body, query not allowed)
5. `DELETE /:id` deletes one record by ID.
6. Invalid ObjectId should return a clear error.
7. Missing record should return "Not found".
9. Response format should be consistent.

## Standard Success Response Format

```json
{
  "success": true,
  "message": "Proper Error/Success message",
  "data": {}
}
```

For list APIs:

```json
{
  "success": true,
  "message": "Proper Error/Success message",
  "data": []
}
```

## Git Workflow

### 1. Pull latest main

```bash
git checkout main
git pull origin main
```

### 2. Create branch

```bash
git checkout -b feature/country-rashid
```

### 3. Work on assigned files

Example:

```txt
src/controllers/countryController.js
src/controllers/country.js
```

### 4. Test APIs

Use Postman, Thunder Client, or Hoppscotch.

### 5. Commit

There should be a commit for each API created
There should be a commit for each API created.

EXAMPLE:
```bash
git add .
git commit -m "Implement Country POST API"
git commit -m "Implemented Country POST API"
```

### 6. Push

```bash
git push origin feature/country-rashid
```

### 7. Create Pull Request

Open GitHub and create a PR from your branch to `main`.

## Optional Advanced Tasks (FOR EXTRA MARKS)

After basic CRUD is complete, add:

1. Search by name.
2. Pagination.
3. Sorting.
4. Filtering by city or country.
5. Populate related fields.
6. JWT authentication.
6. JWT authentication. (Not now)
7. Role-based access control.
8. Swagger API documentation.
