// Central API Configuration
// Switch this URL to your deployed backend URL when in production
const PROD_API_URL = 'https://civicfix-tqgc.onrender.com';
const DEV_API_URL = 'http://localhost:5000';

export const API_URL = import.meta.env.PROD ? PROD_API_URL : DEV_API_URL;
