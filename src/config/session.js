const session = require('express-session')
const connectPgSimple = require('connect-pg-simple')
const { Pool } = require('pg')
const { databaseUrl, demoMode, isProduction, sessionSecret } = require('./env')

function createSessionMiddleware() {
  let store

  if (databaseUrl && !demoMode) {
    const PgSession = connectPgSimple(session)
    const pool = new Pool({ connectionString: databaseUrl, max: 10 })
    store = new PgSession({ pool, tableName: 'user_sessions', createTableIfMissing: false })
  }

  return session({
    name: 'vemdeco.sid',
    secret: sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
}

module.exports = { createSessionMiddleware }
