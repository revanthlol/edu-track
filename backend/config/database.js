// backend/config/database.js
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine the path to the CA certificate
// This will work locally and on Vercel
const caPath = path.resolve(process.cwd(), 'ca-bundle.pem');

let dialectOptions = {};

// Only use SSL settings if a CA file actually exists.
// This allows local development without SSL if you choose.
if (fs.existsSync(caPath)) {
  dialectOptions.ssl = {
    ca: fs.readFileSync(caPath)
  }
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectOptions: dialectOptions
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected...');
        // On Vercel, it's better to not have sync run automatically
        if (process.env.NODE_ENV !== 'production') {
           await sequelize.sync({ alter: true });
           console.log("All models were synchronized successfully.");
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };