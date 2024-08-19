import { expect } from "chai";
import { Item, GildedRose, UpdatedItem } from "../../src/gilded-rose";

describe("Unit Tests", () => {
  describe("Regular Item Initialisation", () => {
    it("Name should equal foo", () => {
      const gildedRose = new GildedRose([new Item("foo", 0, 0)]);
      expect(gildedRose.items[0].name).to.equal("foo");
    });
    it("sellIn should equal 6", () => {
      const gildedRose = new GildedRose([new Item("", 6, 0)]);
      expect(gildedRose.items[0].sellIn).to.equal(6);
    });
    it("Quality should equal 10", () => {
      const gildedRose = new GildedRose([new Item("", 0, 10)]);
      expect(gildedRose.items[0].quality).to.equal(10);
    });
  });

  describe("SellIn Property", () => {
    it("reduces by one each day", () => {
      const gildedRose = new GildedRose([new Item("item", 10, 10)]);
      let items: Item[];
      for (let i = 9; i >= 0; i--) {
        items = gildedRose.updateQuality();
        expect(items[0].sellIn).to.equal(i);
      }
    });
  });

  describe("Item: Aged Brie", () => {
    it("increases in quality over time", () => {
      const gildedRose = new GildedRose([new Item("Aged Brie", 0, 0)]);
      const itemsAfterOneDay = gildedRose.updateQuality();
      expect(itemsAfterOneDay[0].quality).to.be.greaterThan(0);
    });
  });

  describe("Quality Margins", () => {
    it("Cannot be below 0", () => {
      const gildedRose = new GildedRose([new Item("item", 0, 0)]);
      const itemsAfterOneDay = gildedRose.updateQuality();
      expect(itemsAfterOneDay[0].quality).to.equal(0);
      const itemsAfterTwoDays = gildedRose.updateQuality();
      expect(itemsAfterTwoDays[0].quality).to.equal(0);
    });
    describe("Quality cannot be above 50", () => {
      it("Does not allow aged bried to rise above 50", () => {
        const gildedRose = new GildedRose([new Item("Aged Brie", 0, 49)]);
        const itemsAfterOneDay = gildedRose.updateQuality();
        expect(itemsAfterOneDay[0].quality).to.be.greaterThan(49);
        const itemsAfterTwoDays = gildedRose.updateQuality();
        expect(itemsAfterTwoDays[0].quality).to.equal(50);
      });
      it("Adjusts a new item at quality 60 back down to 50", () => {
        const gildedRose = new GildedRose([new Item("item", 1, 60)]);
        expect(gildedRose.items[0].quality).to.equal(50);
      });
    });
  });

  describe("Rate of Quality degredation", () => {
    it("reduces by one every day", () => {
      const gildedRose = new GildedRose([new Item("hello", 10, 10)]);
      let items: Item[];
      for (let i = 9; i > 0; i--) {
        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(i);
      }
    });
    it("reduces by one every day when when sellIn hits -1", () => {
      const gildedRose = new GildedRose([new Item("item", 0, 10)]);
      let items: Item[];
      for (let i = 8; i >= 0; i -= 2) {
        items = gildedRose.updateQuality();
        expect(items[0].quality).to.equal(i);
      }
    });
  });

  describe("Legendary Item: Sulfuras", () => {
    it("never has to be sold", () => {
      const gildedRose = new GildedRose([new Item("Sulfuras", 0, 0)]);
      let items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.be.greaterThan(-1);
      items = gildedRose.updateQuality();
      expect(items[0].sellIn).to.be.greaterThan(-1);
    });
    it("always has a quality of 80", () => {
      const gildedRose = new GildedRose([new Item("Sulfuras", 0, 0)]);
      let items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(80);
      items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(80);
    });
  });

  describe("Backstage passes", () => {
    it("increases in Quality over time", () => {
      const gildedRose = new GildedRose([new Item("Backstage passes", 15, 15)]);
      let items = gildedRose.updateQuality();
      expect(items[0].quality).to.be.greaterThan(15);
    });
    it("increases in Quality by 2 when sellIn <= 10", () => {
      const gildedRose = new GildedRose([new Item("Backstage passes", 10, 15)]);
      let items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(17);
    });
    it("increases in Quality by 3 when sellIn <= 5", () => {
      const gildedRose = new GildedRose([new Item("Backstage passes", 5, 15)]);
      let items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(18);
    });
    it("has Quality 0 when sellIn = -1", () => {
      const gildedRose = new GildedRose([new Item("Backstage passes", 0, 15)]);
      let items = gildedRose.updateQuality();
      expect(items[0].quality).to.equal(0);
    });
  });

  describe("Conjured Items", () => {
    describe("Double Degradation", () => {
      it("degrades at -2 whilst SellIn >= 0", () => {
        const gildedRose = new GildedRose([
          new UpdatedItem({ name: "conjured foo", sellIn: 10, quality: 10 }),
        ]);
        let items: Item[];
        for (let i = 8; i >= 0; i -= 2) {
          items = gildedRose.updateQuality();
          expect(items[0].quality).to.equal(i);
        }
      });
      it("degrades at -4 whilst SellIn < 0", () => {
        const gildedRose = new GildedRose([
          new UpdatedItem({ name: "conjured foo", sellIn: 0, quality: 20 }),
        ]);
        let items: Item[];
        for (let i = 16; i >= 0; i -= 4) {
          items = gildedRose.updateQuality();
          expect(items[0].quality).to.equal(i);
        }
      });
    });
  });
});
