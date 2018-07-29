
/**
 * 对两个流进行差速
 */
class Transmission {
  constructor(
    private read: ReadableStream,
    private write: WritableStream,
    private throttle: any,
  ) {}
}