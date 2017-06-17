 'use strict';

 // Prepend without reconstructing the DOM tree
 export default (node, element) => {
     (typeof element === 'string') ? (
         node.insertAdjacentHTML('afterbegin', element)
     ) : (
         node.insertAdjacentElement('afterbegin', element)
     );
 };