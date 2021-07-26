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

    const allElements = new Array(lightDomElements.length + (shadowDomElements?.length ?? 0));
    lightDomElements.forEach((elem) => {
        if (elementIsDefined(elem)) {
            elements.push(
                new CustomElementNode(elem, ids.next().value, treeOrNode, false)
            );
            allElements.push(elem);
        }
    });
    shadowDomElements?.forEach((elem) => {
        if (elementIsDefined(elem)) {
            elements.push(
                new CustomElementNode(elem, ids.next().value, treeOrNode, true)
            );
            allElements.push(elem);
        }
    });

    return elements.filter(
        (el) =>
            !elementIsInsideChildComponent(treeOrNode.element, allElements, el.element)
    );
}

/**
 * @param {HTMLElement} parentElem
 * @param {Array<HTMLElement>} allElements
 * @param {HTMLElement} element
 */
function elementIsInsideChildComponent(parentElem, allElements, element) {
    let isInside = false;
    let el = element.parentElement ?? element.getRootNode()?.host ?? null;
    while (el && el !== parentElem) {
        if (el.nodeName.includes("-")) {
            isInside = true;
            break;
        }
        el = el.parentElement;
    }
    return isInside;
}

/**
 * @param {HTMLElement} element
 */
function elementIsDefined(element) {
    const elementDocument = element.ownerDocument;
    const elementWindow = elementDocument.defaultView;

    const tagName = element.tagName.toLowerCase();
    return typeof elementWindow.customElements.get(tagName) !== "undefined";
}
