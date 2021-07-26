import { CustomElementNode } from "./custom-element-node";
import { CustomElementTree } from "./custom-element-tree";

var randomIdArray;

/**
 * @returns { IterableIterator<number> }
 * */
function getRandomIdArray() {
    if (!randomIdArray) {
        const uintArray = new Uint32Array(9999); // Should be enough
        window.crypto.getRandomValues(uintArray);
        randomIdArray = uintArray.values();
    }
    return randomIdArray;
}

/**
 * @param {CustomElementTree | CustomElementNode} treeOrNode
 *
 * @returns { Array<CustomElementNode> }
 */
export function getElements(treeOrNode) {
    /** @type { Array<CustomElementNode> } */
    const elements = [];
    /** @type { NodeListOf<HTMLElement> } */
    const lightDomElements = treeOrNode.element.querySelectorAll("*");
    /** @type { NodeListOf<HTMLElement> | undefined } */
    const shadowDomElements = treeOrNode.element.shadowRoot
        ? treeOrNode.element?.shadowRoot.querySelectorAll("*")
        : undefined;

    const ids = getRandomIdArray();

    lightDomElements.forEach((elem) => {
        if (elementIsDefined(elem)) {
            elements.push(
                new CustomElementNode(elem, ids.next().value, treeOrNode, false)
            );
        }
    });
    shadowDomElements?.forEach((elem) => {
        if (elementIsDefined(elem)) {
            elements.push(
                new CustomElementNode(elem, ids.next().value, treeOrNode, true)
            );
        }
    });

    return elements;
}

/**
 * @param {HTMLElement} element
 */
export function elementIsDefined(element) {
    const elementDocument = element.ownerDocument;
    const elementWindow = elementDocument.defaultView;

    const tagName = element.tagName.toLowerCase();
    return (
        typeof elementWindow.customElements.get(tagName) !== "undefined"
    );
}
