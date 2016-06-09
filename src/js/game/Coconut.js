var Thing = require('../engine/models/Thing.js');
var PickableModifier = require('../engine/models/PickableModifier.js');
var compositionFactory = require('../engine/models/CompositionFactory.js');
var selectedThing = require('../engine/state/SelectedThing.singleton.js');
var Costume = require('./Costume.js');

class Coconut extends Thing {
    constructor(phaserGame) {
        let options = {
            id: 'coconut',
            x: 120,
            y: 130,
            spriteId: 'coconut',
            inventoryImageId: 'coconut',
            name: 'coconut',
            goToPosition: {
                x: 150,
                y: 180
            }
        };
        super(phaserGame, options);
    }

    takeAction(player) {
        this._getTakenBy(player);
    }

    lookAction(player) {
        if (this.isInInventory()) {
            player.say('Does it look like a pair of tits?');
        } else {
            player.say('Compare cómprame un coco');
        }
    }

    useAction(player) {
        if (selectedThing.thing.id === 'flowers') {
            let flowers = selectedThing.thing;
            flowers.createCostumeFromCoconut(player, this);
        } else if (selectedThing.thing.id === 'skirt') {
            this.createCostumeFromSkirt(player, selectedThing.thing);
        } else if (selectedThing.thing.id === 'costume') {
            this.addCoconutToCostume(player, selectedThing.thing);
        } else {
            player.say('I don\'t know how to do that');
        }
    }

    createCostumeFromSkirt(player, skirt) {
        if (!this.isInInventory()) {
            player.say('I have to pick it up first');
            return;
        }
        let costume = new Costume(this.phaserGame);
        costume.addSkirt(skirt);
        costume.addCoconut(this);
    }

    addCoconutToCostume(player, costume) {
        costume.addCoconut(this);
    }

}

compositionFactory.applyModifier(PickableModifier, Coconut);

module.exports = Coconut;