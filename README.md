# Client - Contractor API

This API contains basic operations for client to hire contractor. Using NodeJS + TypeScript + ExpressJS + Sqlite

## 🚀 Check out it's awesome features

1. Get single Contract detail by id
2. Get all Contract detail of client/contractor
3. Get all unpaid job by client/contractor
4. Pay contractor
5. Deposit money to client wallet
6. Admin - get best contractor's profession by top earnings
7. Admin - get best client by top paid jobs

## ⚙️ Infrastructure

- Node v18.17.1 (LTS)
- TypeScript
- NPM or YARN (package manager)
- ExpressJS 
- Sqlite Database

## 💻 How to setup

1. Clone this repository to your local machine.
2. Open a terminal and navigate to the cloned repository's root directory.
3. Install project dependency using `npm install` or `yarn install`
4. Run the following command to start the server: (this will also create Sqlite database in root directory with data)

   ```bash
   npm start or yarn start
   ```

## ✅ How to run tests

1. From the root directory execute `npm test` or `yarn test`
2. For test watch mode execute `npm test:watch` 
3. To check the code coverage execute `npm test:coverage`


## 📄 API Documentation

You can find all the endpoint's detailed configuration from this [POSTMAN Collection](https://documenter.getpostman.com/view/1316746/2s9Y5YR2mk)

## 🙅🏻‍♂️ Things can be improved

Two admin endpoints `/admin/best-profession?start=<date>&end=<date>` & `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` should be authenticated with admin credentials. Currently it allows without any auth methods in this demo.
