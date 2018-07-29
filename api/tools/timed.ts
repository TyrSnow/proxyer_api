export function timed(rounds: number, testFunc: Function, args: any[], context: any = {}): number {
  const startTime = process.hrtime();
  for (let i = 0; i < rounds; i += 1) {
    testFunc.apply(context, args);
  }
  const endTime = process.hrtime();

  return (endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1000000;
}
