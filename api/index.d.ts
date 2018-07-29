declare module "*.json" {
  const value: any;
  export default value;
}

interface Pager {
  size: number
  current: number
  total: number
}

interface ResponseList<T> {
  list: Array<T>
  page: Pager
}