export enum PROXY_STATUS {
  STOP = 0,
  RUNNING,
  ERROR,
  RESTARTING,
  UPDATING,
}

export enum PATTERN_THROTTLE_TYPE {
  NONE = 0,
  SPEED,
  DELAY,
  PAUSE,
}