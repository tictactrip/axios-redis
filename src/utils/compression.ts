import { promisify } from 'util';
import { brotliCompress, brotliDecompress } from 'zlib';

const compressAsync = promisify(brotliCompress);
const decompressAsync = promisify(brotliDecompress);

/**
 * @description Compresses and encodes the provided string. It uses zlib's brotli compression and encodes the whole using base64 binary encoding.
 * @param {string} data The data to compress and encode.
 * @returns {Promise<string>} The resulting output after compression and encoding.
 */
async function compress(data: string): Promise<string> {
  const compressedData: Buffer = await compressAsync(data);

  return compressedData.toString('base64');
}

/**
 * @description Decompresses the provided string, assuming it has been compressed and encoded using base64. This decodes the string first, and them uncompresses it.
 * @param {string} data The compressed and encoded data.
 * @returns {Promise<string>} The deflated and decoded data contained in the provided string.
 */
async function decompress(data: string): Promise<string> {
  const decompressedData: Buffer = await decompressAsync(Buffer.from(data, 'base64'));

  return decompressedData.toString();
}

export { compress, decompress };
