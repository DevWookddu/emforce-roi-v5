import encodeUri from './lib/encodeUri';
import UUID from './lib/UUID';

const ohora = encodeUri('Ohora');
console.log(decodeURIComponent(ohora));
console.log(UUID());
