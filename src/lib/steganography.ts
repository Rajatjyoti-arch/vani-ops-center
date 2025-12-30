/**
 * LSB Steganography - Encode/Decode text in image pixels
 * Uses Least Significant Bit encoding for hiding text data
 */

// Delimiter to mark end of hidden message
const END_DELIMITER = '\x00\x00\x00';

/**
 * Encode text into an image using LSB steganography
 */
export async function encodeTextInImage(
  imageFile: File,
  text: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert text to binary with delimiter
      const message = text + END_DELIMITER;
      const binaryMessage = textToBinary(message);

      // Check if image has enough capacity
      const maxBits = Math.floor((data.length / 4) * 3); // RGB channels only
      if (binaryMessage.length > maxBits) {
        reject(new Error('Image too small to hold message'));
        return;
      }

      // Encode binary message into LSB of RGB channels
      let bitIndex = 0;
      for (let i = 0; i < data.length && bitIndex < binaryMessage.length; i += 4) {
        // Red channel
        if (bitIndex < binaryMessage.length) {
          data[i] = (data[i] & 0xFE) | parseInt(binaryMessage[bitIndex], 2);
          bitIndex++;
        }
        // Green channel
        if (bitIndex < binaryMessage.length) {
          data[i + 1] = (data[i + 1] & 0xFE) | parseInt(binaryMessage[bitIndex], 2);
          bitIndex++;
        }
        // Blue channel
        if (bitIndex < binaryMessage.length) {
          data[i + 2] = (data[i + 2] & 0xFE) | parseInt(binaryMessage[bitIndex], 2);
          bitIndex++;
        }
        // Alpha channel unchanged
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Decode hidden text from an image
 */
export async function decodeTextFromImage(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Extract LSBs from RGB channels
      let binaryString = '';
      for (let i = 0; i < data.length; i += 4) {
        binaryString += (data[i] & 1).toString();
        binaryString += (data[i + 1] & 1).toString();
        binaryString += (data[i + 2] & 1).toString();
      }

      // Convert binary to text
      const text = binaryToText(binaryString);
      
      // Find delimiter and extract message
      const delimiterIndex = text.indexOf(END_DELIMITER);
      if (delimiterIndex === -1) {
        resolve(''); // No hidden message found
      } else {
        resolve(text.substring(0, delimiterIndex));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Convert text to binary string
 */
function textToBinary(text: string): string {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    binary += charCode.toString(2).padStart(8, '0');
  }
  return binary;
}

/**
 * Convert binary string to text
 */
function binaryToText(binary: string): string {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte, 2);
      if (charCode === 0) break; // Stop at null character
      text += String.fromCharCode(charCode);
    }
  }
  return text;
}

/**
 * Check if file is an image that can be used for steganography
 */
export function isValidImageForSteganography(file: File): boolean {
  return file.type.startsWith('image/') && 
    ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
}
