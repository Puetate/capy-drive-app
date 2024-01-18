// Función para calcular el máximo común divisor
function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Función para encontrar el inverso multiplicativo
function modInverse(e: number, phi: number): number {
    let d = 0;
    while ((e * d) % phi !== 1) {
        d++;
    }
    return d;
}

// Función para generar claves RSA
function generateRSAKeys(): { publicKey: { n: number; e: number }; privateKey: { n: number; d: number } } {
    // Elegir números primos grandes (p y q)
    const p = 61;
    const q = 53;

    // Calcular n y φ(n)
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Elegir un número e coprimo con φ(n)
    let e = 17; // Puede ser cualquier número primo mayor que 1 y menor que φ(n)

    // Calcular el inverso multiplicativo de e módulo φ(n)
    const d = modInverse(e, phi);

    return {
        publicKey: { n, e },
        privateKey: { n, d },
    };
}

// Función para encriptar un mensaje
function encrypt(message: string, publicKey: { n: number; e: number }): number[] {
    const encryptedMessage: number[] = [];

    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);
        console.log("char code", charCode);
        
        const encryptedChar = BigInt(charCode) ** BigInt(publicKey.e) % BigInt(publicKey.n);
        console.log("encriptado",Number(encryptedChar));
        encryptedMessage.push(Number(encryptedChar));
    }

    return encryptedMessage;
}

// Función para desencriptar un mensaje
function decrypt(encryptedMessage: number[], privateKey: { n: number; d: number }): string {
    let decryptedMessage = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const encryptedChar = BigInt(encryptedMessage[i]);
        const decryptedChar = encryptedChar ** BigInt(privateKey.d) % BigInt(privateKey.n);
        decryptedMessage += String.fromCharCode(Number(decryptedChar));
    }

    return decryptedMessage;
}

export function encriptar() {

    const { publicKey, privateKey } = generateRSAKeys();
    const message = '0401111018';
    const encryptedMessage = encrypt(message, publicKey);
    const decryptedMessage = decrypt(encryptedMessage, privateKey);

    console.log('Mensaje original:', message);
    console.log('Mensaje encriptado:', encryptedMessage);
    console.log('Mensaje desencriptado:', decryptedMessage);
}
// Ejemplo de uso
