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

export class UpdatedItem implements Item {
  readonly name: string;
  public sellIn: number;
  private _quality: number;
  private static qualityBounds = (num: number) => Math.min(50, Math.max(num, 0));

  constructor({ name, sellIn, quality }: Item) {
    this.name = name;
    this.sellIn = sellIn;
    this._quality = UpdatedItem.qualityBounds(quality);
  }
  get quality() {
    return this._quality;
  }
  set quality(num: number) {
    this._quality = UpdatedItem.qualityBounds(num);
  }
}

const Sulfuras: Item = Object.freeze({
  name: "Sulfuras",
  sellIn: 0,
  quality: 80,
});

export class GildedRose {
  items: Array<UpdatedItem>;

  constructor(items = [] as Array<Item | UpdatedItem>) {
    this.items = GildedRose.updateItems(items);
  }

  static updateItems(items: Array<any>): Array<UpdatedItem> {
    return items.map(item => {
      // Covert Item to UpdatedItem
      if (!(item instanceof UpdatedItem)) item = new UpdatedItem({ ...item });
      // Freeze Sulfuras
      if (item.name === "Sulfuras") item = Sulfuras;
      return item;
    });
  }

  static backstagePassQualityChange(item: UpdatedItem): UpdatedItem["quality"] {
    if (item.sellIn < 0) return 0;
    if (item.sellIn <= 5) return item.quality + 3;
    if (item.sellIn <= 10) return item.quality + 2;
    return item.quality + 1;
  }

  static standardQualityChange(item: UpdatedItem): UpdatedItem["quality"] {
    let factor = /conjured/i.test(item.name) ? 2 : 1;
    if (item.sellIn < 0) factor *= 2;
    return item.quality - factor;
  }

  updateQuality() {
    this.items = this.items.map(item => {
      if (Object.isFrozen(item)) return item;
      item.sellIn -= 1;
      if (item.name === "Aged Brie") {
        return Object.assign(item, { quality: item.quality + 1 });
      }
      if (item.name === "Backstage passes") {
        return Object.assign(item, { quality: GildedRose.backstagePassQualityChange(item) });
      }
      return Object.assign(item, { quality: GildedRose.standardQualityChange(item) });
    });

    return this.items;
  }
}
