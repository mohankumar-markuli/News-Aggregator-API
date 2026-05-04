# News Aggregator API

A backend system that aggregates news from an external API, supports user authentication, personalized preferences, caching, and user interactions like marking articles as read or favorite.

---

##  Features

* User Authentication (Signup, Login, Logout)
* User Profile Management
* User Preferences (categories, languages, country)
* Fetch news from external API (GNews)
* Search news by keyword
* Caching to reduce external API calls
* Mark articles as:

  * Read
  * Favorite
* Retrieve:

  * Read articles
  * Favorite articles
* Background cache updates (simulating real-time feed)

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Node-Cache (in-memory caching)
* Axios (external API calls)
* JWT (authentication)

---

##  Project Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── services/
├── middlewares/
├── utils/
├── config/
│
├── app.js
└── server.js
```

---

##  Authentication Routes

Base: `/api/v1/auth`

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| POST   | /signup  | Register user |
| POST   | /login   | Login user    |
| POST   | /logout  | Logout user   |

---

##  User Routes

Base: `/api/v1/users` (Protected)

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | /profile     | View profile       |
| PATCH  | /profile     | Update profile     |
| PATCH  | /password    | Change password    |
| GET    | /preferences | View preferences   |
| PUT    | /preferences | Update preferences |

---

##  News Routes

Base: `/api/v1/news` (Protected)

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | /                | Get news (cached) |
| GET    | /search/:keyword | Search news       |

---

##  Article Routes

Base: `/api/v1/news` (Protected)

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| POST   | /:id/read     | Mark article as read     |
| POST   | /:id/favorite | Mark article as favorite |
| GET    | /read         | Get read articles        |
| GET    | /favorite     | Get favorite articles    |

---

##  Caching Strategy

* Query-based cache:

  ```
  news:<category>:<language>
  ```

* Article-based cache:

  ```
  article:<articleId>
  ```

* Reduces external API calls

* Improves response time

---

##  Background Cache Updates

* Periodically refreshes cache using `setInterval`
* Prevents stale data
* Avoids repeated API calls

---

##  Installation

```bash
git clone <repo-url>
cd project
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GNEWS_API_KEY=your_api_key
NODE_ENV=development
```

---

##  Run the Server

```bash
npm run dev
```

---

##  Design Decisions

* **Cache + DB hybrid**

  * Cache → fast reads
  * DB → persistent user actions

* **Service Layer**

  * Business logic separated from controllers

* **Minimal data storage**

  * Only required article fields stored

---

##  Limitations

* Cache is in-memory (lost on restart)
* External API rate limits apply
* Free API has delayed data (~12 hours)

---

##  Future Improvements

* Redis caching (production)
* Pagination support
* Trending news
* Better search filters
* Rate limiting & throttling

---

##  Health Check

```
GET /api/v1/health
```

