import { CustomElementNode } from "./custom-element-node";
import { getElements } from "./parsers";

export class CustomElementTree {
    constructor(dom = document.body) {
        /** @type { number } */
        this.elementCount = 0;
        /** @type { Array<CustomElementNode> } */
        this.elements = [];

        this.element = dom;

        this._findElements();
    }

    _findElements() {
        this.elements = getElements(this);
        this.elementCount = this.flat().length;
    }

    /**
     * Returns a flat representation of the CustomElementTree
     * */
    flat() {
        return [];
    }
}
