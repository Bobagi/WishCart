# WishCart

WishCart is a shopping assistant application that helps users find products online by simply searching for items they wish to buy. The system retrieves product options based on user preferences such as brand, size, or price range. It's built with a modern tech stack to provide real-time product data from platforms like Amazon or Mercado Livre.

![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Knex.js](https://img.shields.io/badge/Knex.js-FF6600?style=for-the-badge&logo=knex&logoColor=white&labelColor=gray)
![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Winston](https://img.shields.io/badge/Winston-%23FFFFFF.svg?style=for-the-badge&logo=winston&logoColor=black)
![Puppeteer](https://img.shields.io/badge/Puppeteer-%2300bfa5.svg?style=for-the-badge&logo=puppeteer&logoColor=white)
![MercadoLibre](https://img.shields.io/badge/MercadoLibre-%23FFE600.svg?style=for-the-badge&logo=mercadolibre&logoColor=white)

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Docker
- Node.js (v16 or later)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd wishcart
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the environment variables by creating a `.env` file and providing the necessary configuration details (PostgreSQL, API keys, etc.).
5. Run the application with Docker:
   ```bash
   docker-compose up
   ```

### Running Migrations

Migrations are managed using Knex.js. To run migrations:

```bash
npx knex migrate:latest
```

## Tools & Libraries

### Knex.js

**Knex.js** is a SQL query builder for Node.js, designed to be flexible and powerful. In WishCart, we use it for handling database migrations and constructing SQL queries in a way that works across different databases, but in our case, we are using PostgreSQL.

### Winston

**Winston** is a versatile logging library for Node.js. It's used in WishCart for handling logs of various levels (info, error, debug) in a structured format, which helps in debugging and monitoring the application’s runtime behavior.

### Docker

**Docker** is a containerization platform that enables us to package the application and all its dependencies into a standardized unit for software development. WishCart runs inside Docker containers, making it easier to set up and manage in different environments.

### TypeScript

**TypeScript** is a typed superset of JavaScript that compiles to plain JavaScript. We use TypeScript in WishCart to add static types to the code, reducing errors and making the codebase easier to maintain.

### PostgreSQL

**PostgreSQL** is the database system used to store all user data, including products, user accounts, and wish lists. PostgreSQL was chosen due to its reliability and advanced feature set for handling relational data.

## Contributing to WishCart

To contribute to WishCart, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`.
4. Push to the original branch: `git push origin <branch_name>`.
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License

This project uses the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
