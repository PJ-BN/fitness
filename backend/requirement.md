1.1 Purpose Provide an HTTP API to:

Store predefined (system) and user-defined foods with nutritional data.
Record user consumption entries (what food, how many grams, when).
Aggregate and report daily totals, weekly averages, monthly averages.
Compare current period vs previous period (day, week, month).
Track user goals (calorie & macro targets).
Support future extension (e.g., meals, recipes, activity-based adjustments).
1.2 Core Concepts / Domain Model Entities:

User
Id (GUID)
Email (unique), PasswordHash, CreatedAtUtc
Profile: DisplayName, TimeZone (IANA string), PreferredUnits (metric/imperial flag), Gender (optional), DOB (optional), WeightKg (optional), HeightCm (optional)
Settings: DailyCalorieGoal (nullable), MacroRatio (P%, C%, F% – optional), DefaultPrivacy
Food
Id (GUID)
Name (string, unique per owner scope)
IsSystem (bool) (true = predefined catalog item)
OwnerUserId (nullable) (for custom food)
Nutrition (per 100g):
Calories (kcal, int or decimal)
ProteinGrams, CarbsGrams, FatGrams (decimal(6,2))
FiberGrams (optional)
SugarGrams (optional)
SodiumMg (optional)
Tags (array, e.g., "fruit", "dairy")
CreatedAtUtc, UpdatedAtUtc
Version (rowversion / concurrency token)
IntakeEntry
Id (GUID)
UserId
FoodId
QuantityGrams (decimal(7,2))
LoggedAtUtc (timestamp actual entry time)
LocalDate (computed daily bucket in user’s timezone; stored for indexing)
Source (enum: manual, import, bulk)
Notes (optional)
IsDeleted (soft delete)
CreatedAtUtc, UpdatedAtUtc
DailySummary (materialized or computed)
UserId + LocalDate
TotalCalories, TotalProtein, TotalCarbs, TotalFat, TotalFiber, etc.
Auto-recomputed on change events (can be persisted for performance)
GoalHistory (optional extension)
Id, UserId, EffectiveFromDate, DailyCalorieGoal, MacroRatio
AuditLog
Id, UserId, EntityType, EntityId, Action (create, update, delete), SnapshotJson, TimestampUtc
1.3 Derived Calculations

EntryCalories = (Food.CaloriesPer100g * QuantityGrams) / 100
Macro grams similarly scaled.
Daily totals = sum of non-deleted entries where LocalDate = user’s local date.
Weekly range: ISO week or rolling 7 days? Requirement: Provide both:
weeklyAverage(currentWeek) = sum(calories for Monday–Sunday)/7
weeklyAverage(rolling7) = sum(last 7 LocalDates)/7
Monthly average = sum(month LocalDates) / number_of_days_elapsed_in_month (configurable; default full month length or days with entries? Define: totalCalories / daysInMonth).
Comparison:
Daily vs previous day: delta = todayCalories - yesterdayCalories; percent = (delta / max(yesterdayCalories,1)) * 100
Weekly vs previous week (matching Monday–Sunday).
Monthly vs previous month (calendar month).
Goal adherence:
dailyGoalDiff = consumed - dailyCalorieGoal
percentOfGoal = consumed / dailyCalorieGoal * 100 (if goal set)
1.4 Functional Requirements

FR1 Authentication & Authorization

Users authenticate via JWT (OpenID Connect extensible).
Password-based login (minimum 12 chars).
Refresh tokens rotation support.
Access tokens expire in 60 min.
FR2 Food Catalog

System provides initial predefined foods (seed).
Users can create custom foods (unique name per user, case-insensitive).
Users can search foods by partial name, tag, or macro filters.
Pagination & sorting (name asc, calories desc, latest updated).
Cannot modify system foods; can clone to custom.
Custom foods can be updated; version concurrency required.
FR3 Intake Entry Management

Create entry: (foodId, quantityGrams, loggedAt (client local or UTC), optional notes).
Server converts loggedAt to UTC and stores LocalDate based on user’s timezone at time of creation.
Update entry: only if within retention window (e.g., 90 days configurable).
Soft delete entry; recompute aggregates.
Bulk create multiple entries in one request (max 100).
Idempotency key header optional to prevent duplicate posts.
FR4 Reporting Endpoints for:

Daily summary (date param; default today).
Range summary (startDate, endDate inclusive) returning array of days.
Weekly report (weekStart) returning daily breakdown + average and comparison to previous week.
Monthly report (month, year) returning daily points, average, total, comparison to previous month.
Trend endpoints (last N days) for sparkline.
Macro breakdown (calorie percentage from protein, carbs, fat).
Goal adherence: list last 14 days with percentOfGoal. Performance:
Use pre-aggregated table or on-demand caching with invalidation on entry changes.
FR5 Goals

Set / update daily calorie goal.
Optional macro ratio (protein %, carbs %, fat %) must sum to 100 (validation).
Provide recommended macro grams based on goal (kcal->proteinGoalGrams = (proteinPercent/100 * goalCalories)/4, fat /9, carbs /4).
Retrieve history of goal changes.
FR6 Time Zone Handling

Each user’s timezone is stored; all client-supplied local timestamps must include offset or separate localTime + timezone.
LocalDate is derived using that timezone; recalculation if user later changes timezone only applies prospectively (no retro-migration).
FR7 Data Validation

QuantityGrams > 0 and <= 10,000.
Calories per 100g must be between 0 and 1200.
Macro grams per 100g cannot imply calories difference >10% tolerance: computedCaloriesFromMacros = P4 + C4 + F*9 If |computed - statedCalories| / statedCalories > 0.1, warn or reject (config flag).
Unique constraints enforced.
FR8 Audit & Versioning

Write operations create audit log entries with previous & new state.
Food updates use optimistic concurrency (If-Match header with ETag or version token).
FR9 Localization/Units

Backend stores metric; if user wants imperial, frontend converts.
Provide metadata endpoint listing supported units.
FR10 Search & Filtering

/foods supports query parameters: nameContains minProteinPer100g, maxCaloriesPer100g, tags (comma)
Sort: sort=calories:desc or name:asc
FR11 Health & Monitoring

/health/live, /health/ready endpoints.
Metrics: request count, latency, DB query time, cache hits.
1.5 Non-Functional Requirements NFR1 Performance: Single daily summary request < 150ms p95 with 5k entries/day. NFR2 Scalability: Support 1M users; partition/shard intake entries by userId hash if needed. NFR3 Security: OWASP ASVS level 2 baseline. Hash passwords with Argon2id. NFR4 Reliability: 99.9% uptime target. NFR5 Observability: Structured logs (JSON), trace IDs, OpenTelemetry integration. NFR6 Privacy: All personal data encrypted at rest (AES-256). TLS enforced. NFR7 Rate Limiting: 200 requests/min/user, 1000/min/ip for unauthenticated endpoints. NFR8 Data Retention: Entries retained indefinitely unless user deletes account. Soft deletes retained 30 days. NFR9 Backup & Recovery: Daily full backups, point-in-time recovery.

1.6 API Endpoint Specification (Representative)

Auth: POST /api/auth/register POST /api/auth/login POST /api/auth/refresh POST /api/auth/logout

User Profile: GET /api/users/me PATCH /api/users/me (update profile/timezone) GET /api/users/me/goals PUT /api/users/me/goals

Foods: GET /api/foods?nameContains=&tags=&minProteinPer100g=&page=1&pageSize=25&sort=name:asc GET /api/foods/{id} POST /api/foods (create custom) PUT /api/foods/{id} (custom only) DELETE /api/foods/{id} (soft delete or hard? define: hard if custom and not referenced; else forbid) POST /api/foods/{id}/clone (clone system to custom)

Intake Entries: GET /api/intake?date=YYYY-MM-DD (list entries for day) GET /api/intake/range?start=YYYY-MM-DD&end=YYYY-MM-DD POST /api/intake PATCH /api/intake/{id} DELETE /api/intake/{id} POST /api/intake/bulk

Reports: GET /api/reports/daily?date=YYYY-MM-DD GET /api/reports/range?start=YYYY-MM-DD&end=YYYY-MM-DD GET /api/reports/weekly?weekStart=YYYY-MM-DD GET /api/reports/monthly?year=YYYY&month=MM GET /api/reports/trend?days=30 GET /api/reports/goal-adherence?days=14 GET /api/reports/macros?date=YYYY-MM-DD

Metadata: GET /api/metadata/units GET /api/metadata/timezones

Health: GET /health/live GET /health/ready

1.7 Sample Payloads

POST /api/foods { "name": "Greek Yogurt 2%", "caloriesPer100g": 73, "proteinGramsPer100g": 9.8, "carbsGramsPer100g": 3.6, "fatGramsPer100g": 2.0, "fiberGramsPer100g": 0, "tags": ["dairy","protein"] }

POST /api/intake { "foodId": "e9d7f3f1-....", "quantityGrams": 150, "loggedAtLocal": "2025-08-27T08:15:00", "timezone": "Europe/London", "notes": "Breakfast" }

GET /api/reports/daily?date=2025-08-27 Response: { "date": "2025-08-27", "totalCalories": 1850, "macros": { "proteinGrams": 120, "carbsGrams": 200, "fatGrams": 60, "calorieBreakdown": {"proteinPct": 26, "carbsPct": 43, "fatPct": 31} }, "entriesCount": 7, "goal": { "calorieGoal": 2000, "caloriesRemaining": 150, "percentOfGoal": 92.5 }, "comparisonToYesterday": { "deltaCalories": +150, "percentChange": 8.8 } }

Weekly: { "weekStart": "2025-08-25", "days": [ {"date":"2025-08-25","calories":1800}, {"date":"2025-08-26","calories":1700}, {"date":"2025-08-27","calories":1850} ], "averageCalories": 1783.3, "previousWeekAverageCalories": 1905.0, "deltaAverageCalories": -121.7, "percentChange": -6.39 }

1.8 Error Handling Standard error format: { "error": "ValidationError", "message": "QuantityGrams must be > 0", "details": [{ "field": "quantityGrams", "issue": "Must be > 0" }], "traceId": "..." } HTTP status mapping: 400 validation 401 auth required 403 forbidden (modifying system food) 404 not found 409 conflict (version mismatch) 429 rate limit 500 internal

1.9 Caching Strategy

Food GET by id: 10 min CDN/public if system food.
User-specific foods: private cache 1 min.
Daily summary: in-memory distributed cache keyed by (userId,date), invalidated on entry change.
1.10 Database Schema (Relational Outline)

Users (Id PK, Email unique, PasswordHash, TimeZone, DisplayName, CreatedAtUtc, PreferredUnits, DailyCalorieGoal nullable, MacroProteinPct, MacroCarbsPct, MacroFatPct, etc.) Foods (Id PK, Name, IsSystem, OwnerUserId FK nullable, CaloriesPer100g, ProteinPer100g, CarbsPer100g, FatPer100g, FiberPer100g, SugarPer100g, SodiumMg, Tags JSONB, CreatedAtUtc, UpdatedAtUtc, RowVersion) IntakeEntries (Id PK, UserId FK, FoodId FK, QuantityGrams, LoggedAtUtc, LocalDate, Source, Notes, IsDeleted, CreatedAtUtc, UpdatedAtUtc) DailySummaries (UserId, LocalDate, Calories, Protein, Carbs, Fat, Fiber, PRIMARY KEY(UserId, LocalDate)) AuditLogs (Id PK, UserId, EntityType, EntityId, Action, SnapshotJson, TimestampUtc)

Indexes:

IntakeEntries (UserId, LocalDate)
Foods (IsSystem, Name)
DailySummaries (UserId, LocalDate)
1.11 Concurrency & Idempotency

PUT/PATCH to foods requires If-Match: "{rowVersionBase64}"
Intake bulk creation supports Idempotency-Key header; server stores key hash with response for 24h.
1.12 Security Controls

Validate ownership on custom food operations.
Limit custom foods per user (e.g., 5,000) with 413 if exceeded.
Input sanitization for notes (strip scripts).
JWT scopes: basic, report.read, food.write, intake.write.
Refresh token stored hashed with rotation detection.
1.13 Testing Strategy (Representative Test Cases) Unit:

Calorie calculations given macros mismatch tolerance.
Timezone local date derivation around DST boundaries.
Weekly average calculation correctness.
Integration:

Creating entry triggers summary recomputation.
Updating entry recalculates only affected day.
Deleting food that has entries disallowed.
Edge Cases:

Entry at 23:59:59 in user timezone vs UTC day boundary.
User changes timezone mid-week (older entries unaffected).
Bulk create with duplicate idempotency key returns identical response.
Performance:

Load test 10k intake entries generation and daily summary retrieval < 200ms.
1.14 Extensibility

Add Meal entity referencing multiple Food lines.
Add micronutrient expansion table.
Add wearable device integration for energy expenditure.