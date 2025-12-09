async function promisePool(items, handler, concurrency = 5) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => handler(item));
    results.push(p);

    if (concurrency <= items.length) {
      const e = p.then(() => {
        const idx = executing.indexOf(e);
        if (idx !== -1) executing.splice(idx, 1);
      });
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

module.exports = promisePool;
