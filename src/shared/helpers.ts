export function waitFor(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          resolve();
      }, milliseconds);
  });
}

export const timeoutPromise = function (promise: Promise<any>, milliseconds: number) {
  let timeout = waitFor(milliseconds).then(Promise.reject);

  return Promise.race([
      promise,
      timeout
  ]);
};