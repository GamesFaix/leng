/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
console.log('POST-INSTALL');

console.log(`Deleting node_modules/@types/react-virtualized/node_modules`);
fs.rmSync(`${__dirname}/../node_modules/@types/react-virtualized/node_modules`, { recursive: true });