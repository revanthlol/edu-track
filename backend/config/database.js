// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// This is the CRITICAL part. Railway provides a MYSQL_URL.
if (process.env.MYSQL_URL) {
  // For Railway Production
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // For Local Development
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });
}

const connectDB = async () => { /* same as before */ };
module.exports = { sequelize, connectDB };
