import { Item, GildedRose } from "../src/gilded-rose";

// I don't really need another test here. This is just useful for giving a once-over
console.log("OMGHAI!");

const items = [
  new Item("+5 Dexterity Vest", 10, 20), //
  new Item("Aged Brie", 2, 0), //
  new Item("Elixir of the Mongoose", 5, 7), //
  new Item("Sulfuras", 0, 80), //
  new Item("Sulfuras", -1, 80),
  new Item("Backstage passes", 15, 20),
  new Item("Backstage passes", 10, 45),
  new Item("Backstage passes", 5, 45),
  // this conjured item does not work properly yet
  new Item("Conjured Mana Cake", 3, 6),
];

const gildedRose = new GildedRose(items);

let days: number = 2;
if (process.argv.length > 2) {
  days = +process.argv[2];
}

for (let i = 0; i < days + 1; i++) {
  console.log("-------- day " + i + " --------");

  console.log("name, sellIn, quality");
  gildedRose.items.forEach(element => {
    console.log(element.name + ", " + element.sellIn + ", " + element.quality);
  });
  console.log();
  gildedRose.updateQuality();
}
