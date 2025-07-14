const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tif_commercial_dashboard',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5432,
});

// const pool = new Pool({
//     user: 'commerce',
//     host: '10.212.1.212',
//     database: 'tif_commercial_dashboard',
//     password: 'TIFju4lan',
//     port: '5432'
// });

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 

module.exports = pool; 