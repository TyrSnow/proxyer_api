import { ProxyModel } from "../models/Proxy/index.d";

export default class Matcher {
  constructor(
    private pattern: ProxyModel.Proxy,
  ) {
    
  }

  match(req: Request) {
    // return this.matcher.match(req);
  }
}