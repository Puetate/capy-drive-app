// const env = process.env;

// calcular el máximo común divisor
function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

// encontrar el inverso multiplicativo
function modInverse(e: number, phi: number): number {
    let d = 0;
    while ((e * d) % phi !== 1) {
        d++;
    }
    return d;
}

// generar claves RSA
function generateRSAKeys(): { publicKey: { n: number; e: number }; privateKey: { n: number; d: number } } {
    // const p: number = parseInt(env.NEXT_PUBLIC_P!);
    const p = 61;
    // const q: number = parseInt(env.NEXT_PUBLIC_Q!);
    const q = 53;

    // Calcular n y φ(n)
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Elegir un número e co primo con φ(n)
    // let e = parseInt(env.NEXT_PUBLIC_E!);
    let e = 17;

    // Calcular el inverso multiplicativo de e módulo φ(n)
    const d = modInverse(e, phi);

    return {
        publicKey: { n, e },
        privateKey: { n, d },
    };
}

function encrypt(message: string, publicKey: { n: number; e: number }): number[] {
    const encryptedMessage: number[] = [];

    for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i);

        const encryptedChar = BigInt(charCode) ** BigInt(publicKey.e) % BigInt(publicKey.n);
        encryptedMessage.push(Number(encryptedChar));
    }

    return encryptedMessage;
}

function decrypt(encryptedMessage: number[], privateKey: { n: number; d: number }): string {
    let decryptedMessage = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        const encryptedChar = BigInt((encryptedMessage[i]));
        const decryptedChar = encryptedChar ** BigInt(privateKey.d) % BigInt(privateKey.n);
        decryptedMessage += String.fromCharCode(Number(decryptedChar));
    }

    return decryptedMessage;
}

export function encriptar(value: string) {

    const { publicKey } = generateRSAKeys();
    const encryptedMessage = encrypt(value, publicKey).join(",");
    console.log(encryptedMessage);
    return encryptedMessage

}

export function desEncriptar(valueEncrypt: string) {
    const { privateKey } = generateRSAKeys();
    const valueNumber: number[] = valueEncrypt.split(",").map(Number);
    const decryptedMessage = decrypt(valueNumber, privateKey);
    // console.log('Mensaje des encriptado:', decryptedMessage);
    return decryptedMessage;
}
