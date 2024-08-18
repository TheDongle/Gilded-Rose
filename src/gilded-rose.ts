export class Item {
  name: string;
  sellIn: number;
  quality: number;
  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export interface ItemProps extends Item {
  conjured: boolean;
}

export class UpdatedItem implements ItemProps {
  public name: string;
  public sellIn: number;
  public conjured: boolean;
  private _quality: number;
  private static qualityBounds = (num: number) => Math.min(50, Math.max(num, 0));

  constructor({ name, sellIn, quality, conjured = false }: ItemProps) {
    this.name = name;
    this.sellIn = sellIn;
    this.conjured = conjured;
    this._quality = UpdatedItem.qualityBounds(quality);
  }
  get quality() {
    return this._quality;
  }
  set quality(num: number) {
    this._quality = UpdatedItem.qualityBounds(num);
  }
}

const Sulfuras = (conjured: boolean = false): ItemProps =>
  Object.freeze({
    name: "Sulfuras",
    sellIn: 0,
    quality: 80,
    conjured: conjured,
  });

export class GildedRose {
  items: Array<UpdatedItem>;

  constructor(items = [] as Array<ItemProps | Item>) {
    this.items = GildedRose.normaliseEntries(items);
  }

  static normaliseEntries(items: Array<any>): Array<UpdatedItem> {
    return Array.from(items, item => {
      if (item.name === "Sulfuras") item = Sulfuras(item.conjured);
      if (!item.hasOwnProperty("conjured")) {
        item = new UpdatedItem({ ...item });
      }
      return item;
    });
  }

  static backstagePassDegredation(item: UpdatedItem): UpdatedItem["quality"] {
    if (item.sellIn < 0) return 0;
    if (item.sellIn <= 5) return item.quality + 3;
    if (item.sellIn <= 10) return item.quality + 2;
    return item.quality + 1;
  }

  static standardDegredation(item: UpdatedItem): UpdatedItem["quality"] {
    let factor = item.conjured ? 2 : 1;
    if (item.sellIn < 0) factor *= 2;
    return item.quality - factor;
  }

  updateQuality() {
    const { standardDegredation, backstagePassDegredation } = GildedRose;

    return this.items.map(item => {
      if (item.name === "Sulfuras") return item;

      item.sellIn -= 1;

      if (item.name === "Aged Brie") {
        return Object.assign(item, { quality: item.quality + 1 });
      }

      if (item.name === "Backstage passes") {
        return Object.assign(item, { quality: backstagePassDegredation(item) });
      }

      return Object.assign(item, { quality: standardDegredation(item) });
    });
  }
}
