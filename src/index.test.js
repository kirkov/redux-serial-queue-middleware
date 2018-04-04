/* eslint-env jest */
import serialQueueMiddleware from './'

const task = (result, delay = 1) => new Promise(
  resolve => setTimeout(() => resolve(result), delay)
)

describe('promiseQueue', () => {
  it('skips unrelated actions.', () => {
    const promiseQueue = serialQueueMiddleware()
    const next = jest.fn(a => a)
    const action = {
      type: 'TEST',
      payload: jest.fn()
    }

    promiseQueue()(next)(action)

    expect(next).toHaveBeenCalledWith(action)
  })

  it('calls next with the promise from the payload function.', async () => {
    const promiseQueue = serialQueueMiddleware()
    const next = jest.fn(a => a)

    const promise = task('Done!')
    const payloadFn = jest.fn(_ => promise)

    promiseQueue()(next)({
      type: 'TEST',
      payload: payloadFn,
      meta: {
        queue: 'TEST'
      }
    })

    await promise

    expect(next).toBeCalledWith({
      type: 'TEST',
      payload: promise,
      meta: {
        queue: 'TEST'
      }
    })
  })
})
