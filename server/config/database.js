const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'commerce',
    host: '10.212.1.212',
    database: 'tif_commercial_dashboard',
    password: 'TIFju4lan',
    port: '5432'
});

module.exports = pool; 