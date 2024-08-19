# Gilded Rose

Attempt at the Gilded Rose kata in TypeScript.

For the item class, I disliked that it was possible to input and save incorrect properties (e.g.
quality = 90 or Sulfurus sellIn = -1) on Day 0. I also didn't feel it was Gilded Rose classes job to
correct what should be intrinsic properties of the items.

So my approach was to create two new classes/objects which implement the same interface:

1. UpdatedItem - Ensures that quality always stays between 0 and 50 inclusive
2. Sulfuras - Freezes the properties for this particular legendary item

The Gilded rose class migrates any instances of the Item class upon initialisation with the new
static method updateItems(). This is extra overhead to be sure, but it was the simplest way to
ensure backwards compatibility.

For the main GildedRose.updateQuality() method, my top priority was making it much smaller and more
readable.

I implemented early returns on the atypical item types: Sulfuras, Aged Brie, and Backstage Passes.
That shaved off a lot of unecessary ifs.

And since this method was mostly about decision logic, I broke out the mathematical logic into a
couple of new static of methods:

1. backstagePassQualityChange()
2. standardQualityChange()

