"use strict";

// Append without reconstructing the DOM tree
export default (node, element) => {
  typeof element === "string"
    ? node.insertAdjacentHTML("beforeend", element)
    : node.insertAdjacentElement("beforeend", element);
};
