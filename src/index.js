export default function serialQueueMiddleware () {
  const queues = {}

  return () => next => action => {
    if (
      typeof action.payload !== 'function' ||
      typeof action.meta !== 'object' ||
      typeof action.meta.queue !== 'string') {
      return next(action)
    }

    const queueName = action.meta.queue
    const lastPromise = queues[queueName] || Promise.resolve()
    const cb = () => {
      const promise = action.payload()

      next({
        ...action,
        payload: promise
      })
      return promise
    }

    queues[queueName] = lastPromise.then(cb, cb)
  }
}
