const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost:27017/The-FaceboOok-${env}`
const sessionSecret = process.env.SESSION_SECRET || 'my awesome secret';

module.exports = { port, env, dbURI, sessionSecret };
