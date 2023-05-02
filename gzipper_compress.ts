const { Compress } = require('gzipper');
const gzip = new Compress('./dist/ninet', null, { verbose: true, level: 6 });
const brotli = new Compress('./dist/ninet', null, { verbose: true, brotli: true, level: 8, exclude: 'gz' });

try {
    const gzipFiles = gzip.run();
    const brotliFiles = brotli.run();
    console.log('Compressed gzip files: ', gzipFiles);
    console.log('Compressed brotli files: ', brotliFiles);
} catch (err) {
    console.error(err);
}
