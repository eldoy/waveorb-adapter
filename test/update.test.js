const connection = require('../index.js')
let db

describe('Update', () => {
  beforeAll(async () => db = await connection())
  beforeEach(async () => await db.drop())

  it('should update a document', async () => {
    await db('project').create({ name: 'hello' })
    const update = await db('project').update({ name: 'hello' }, { name: 'bye' })
    expect(update.n).toBe(1)
    const first = await db('project').get()
    expect(first.name).toEqual('bye')
  })

  it('should not update a document without values', async () => {
    await db('project').create({ name: 'hello' })
    let update = await db('project').update({ name: 'hello' })
    expect(update.n).toBe(0)
    let first = await db('project').get()
    expect(first.name).toEqual('hello')
    update = await db('project').update({ name: 'hello' }, { name: null, bye: 'bye' })
    expect(update.n).toBe(1)
    first = await db('project').get()
    expect(first.name).toBeUndefined()
    expect(first.bye).toBe('bye')
  })

  it('should update multiple documents', async () => {
    await db('project').create({ name: 'hello' })
    await db('project').create({ name: 'hello' })
    const update = await db('project').update({ name: 'hello' }, { name: 'bye' })
    expect(update.n).toBe(2)
    const find = await db('project').find()
    expect(find[0].name).toEqual('bye')
    expect(find[1].name).toEqual('bye')
  })

  it('should set and unset', async () => {
    await db('project').create({ name: 'hello' })
    let update = await db('project').update({ name: 'hello' }, { name: 'bye' })
    expect(update.n).toBe(1)
    let first = await db('project').get()
    expect(first.name).toEqual('bye')

    update = await db('project').update({ name: 'bye' }, { name: null })
    expect(update.n).toBe(1)
    first = await db('project').get()
    expect(first.name).toBeUndefined()
  })

  it('should use db field update operators', async () => {
    await db('project').create({ name: 'hello' })
    let update = await db('project').update({ name: 'hello' }, { $inc: { 'counter': 1 } })
    expect(update.n).toBe(1)
    let first = await db('project').get()
    expect(first.counter).toEqual(1)
  })
})
