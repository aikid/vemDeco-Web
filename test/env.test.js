const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

const root = path.resolve(__dirname, '..')

function loadEnvironment(overrides) {
  return spawnSync(process.execPath, ['-e', "const env=require('./src/config/env'); console.log(JSON.stringify({demoMode:env.demoMode,databaseUrl:env.databaseUrl}))"], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: '', SESSION_SECRET: '', ...overrides },
  })
}

test('produção aceita bypass explícito de demonstração sem banco', () => {
  const result = loadEnvironment({ DEMO_MODE: 'true' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"demoMode":true/)
})

test('produção continua recusando ausência de banco sem bypass', () => {
  const result = loadEnvironment({ DEMO_MODE: 'false' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /DATABASE_URL é obrigatória/)
})
