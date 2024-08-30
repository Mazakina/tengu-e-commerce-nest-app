// The RSA key you want to encode
const rsaKey = ``;

// Encode the key to Base64
const base64EncodedKey = Buffer.from(rsaKey).toString('base64');
console.log(base64EncodedKey);
