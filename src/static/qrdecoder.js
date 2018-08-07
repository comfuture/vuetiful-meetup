self.addEventListener('message', function(e) {
    const input = e.data;

    switch (input.cmd) {
        case 'init':
            init();
            break;
        case 'process':
            process(input);
            break;
        default:
            console.log('Unknown command for QRCode worker.');
            break;
    }
});

function init() {
    self.importScripts(
        'jsqrcode/grid.js',
        'jsqrcode/version.js',
        'jsqrcode/detector.js',
        'jsqrcode/formatinf.js',
        'jsqrcode/errorlevel.js',
        'jsqrcode/bitmat.js',
        'jsqrcode/datablock.js',
        'jsqrcode/bmparser.js',
        'jsqrcode/datamask.js',
        'jsqrcode/rsdecoder.js',
        'jsqrcode/gf256poly.js',
        'jsqrcode/gf256.js',
        'jsqrcode/decoder.js',
        'jsqrcode/qrcode.js',
        'jsqrcode/findpat.js',
        'jsqrcode/alignpat.js',
        'jsqrcode/databr.js'
    )
}

function process(input) {
    qrcode.width = input.width;
    qrcode.height = input.height;
    qrcode.imagedata = input.imageData;

    let result = false;
    try {
        result = qrcode.process();
    } catch (e) {}

    postMessage(result);
}
