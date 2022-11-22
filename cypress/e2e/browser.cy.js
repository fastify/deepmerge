
import deepmerge from '../../index'

describe('browser support', () => {
  it('passes', () => {
    expect(deepmerge).to.be.a('function')
  })

  it('passes', () => {
    const result = deepmerge({
      cloneProtoObject (x) {
        return x
      }
    })(
      { logger: { foo: 'bar' } },
      { logger: { buffer: Buffer.of(1, 2, 3) } }
    )
    expect(process).to.be.undefined
    // expect(result).to.be.deep.equal({
    //   logger: {
    //     foo: 'bar',
    //     buffer: [1, 2, 3]
    //   }
    // })
    // t.type(result.logger.buffer, 'object')
    // t.ok(result.logger.buffer instanceof Buffer)
  })
})
