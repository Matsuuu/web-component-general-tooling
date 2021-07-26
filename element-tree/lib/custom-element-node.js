import { CustomElementTree } from "./custom-element-tree";
import { getElements } from "./parsers";

export class CustomElementNode {
    /**
     * @param {HTMLElement} element
     * @param {number} id
     * @param {CustomElementTree | CustomElementNode} parentTreeOrNode
     * @param {boolean} inShadow
     */
    constructor(element, id, parentTreeOrNode, inShadow) {
        /** @type { number } id */
        this.id = id;
        /** @type { string } tagName */
        this.tagName = element.tagName;
        /** @type { HTMLElement } element */
        this.element = element;
        /** @type { HTMLElement } parent */
        this.parent = parentTreeOrNode.element;
        /** @type { number | undefined } parentId */
        this.parentId =
            parentTreeOrNode instanceof CustomElementNode
                ? parentTreeOrNode.id
                : undefined;
        /** @type { Document } document */
        this.document = this.element.ownerDocument;
        /** @type { Node } */
        this.root = this.element.getRootNode();
        /** @type { Array<CustomElementNode> } children */
        this.children = [];
        /** @type { boolean } inShadowRoot */
        this.inShadowRoot = inShadow;

        this._getChildren();
    }

    /** @private */
    _getChildren() {
        this.children = getElements(this);
    }

    /**
     * @param {boolean} [collapsed]
     */
    logNode(collapsed) {
        if (collapsed) {
            console.groupCollapsed(this.element);
        } else {
            console.group(this.element);
        }
        console.groupCollapsed("Data");
        Object.entries(this).forEach((entry) => console.log(entry[0], entry[1]));
        console.groupEnd();
        this.children.forEach((child) => child.logNode());
        console.groupEnd();
    }
}
