'use strict';

export default data => btoa(data.reduce((acc, curr) => acc + String.fromCharCode(curr), ''));