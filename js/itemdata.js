var itemList = [
        ["Fish", 1],
        ["Flower", 1],
        ["Bone", 2],
        ["Stick", 2],
        ["Dirt", 1],
        ["Water Bottle", 3],
        ["Boots", 2],
        ["Coal", 1],
        ["Book", 2],
        ["Soda Pop", 4],
        ["Sword", 5],
        ["Bow", 5],
        ["Dagger", 5],
        ["Tripod", 4],
        ["Train", 4],
        ["Cows", 4],
        ["Pig", 4]
    ], // [itemname,tier]
    itemEnchant = [
        ["Bacterial Proof", 5],
        ["Water Proof", 1],
        ["Fire Proof", 2],
        ["Oblivion", 5],
        ["Forged", 6],
        ["Biodegradable", 3]
    ], // [enchantName,tier]
    itemType = ["Excalibur", "Gay People", "Strength", "Flash", "Lightbulb", "Frost"];
function genItem(){
	var iSpecie = shuffle(itemList)[0],
	iEnchant = shuffle(itemEnchant)[0],
	iType = shuffle(itemType)[0],
	cost = (iSpecie[1] + iEnchant[1] + iType.length) * 100 * getRandomArbitrary(0.87,1);
	return {name:(iEnchant[0] + " " + iSpecie[0] + " of " + iType),cost:Math.round(cost)};
}