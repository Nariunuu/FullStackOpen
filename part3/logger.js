const morgan = require('morgan')

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apikey', 'authorization']

const redact = body => {
  if (!body || typeof body !== 'object') return body
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) =>
      SENSITIVE_KEYS.includes(key.toLowerCase()) ? [key, '[REDACTED]'] : [key, value]
    )
  )
}

morgan.token('body', req =>
  req.method === 'POST' ? JSON.stringify(redact(req.body)) : ''
)

module.exports = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
  { skip: req => req.url === '/favicon.ico' }
)
