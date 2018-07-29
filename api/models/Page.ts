class Page {
  public total: number;
  constructor(
    public size: number,
    public current: number = 1,
  ) {}

  set_total(total) {
    this.total = total;
  }
}

export default Page;
