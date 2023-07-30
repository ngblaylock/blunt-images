module.exports = [
  {
    input: './test/images',
    output: './test/optimized-images',
    sizes: [100, 400, 800],
    options: {
      // width
      // height
      // fit
      // position
      // background
      // kernel
    }
  }, 
  {
    input: './test/images2',
    output: './test/optimized-images2',
    sizes: [
      {width: 100, height: 200}, // portrait
      {width: 300, height: 200}, // landscape
      {width: 400, height: 400}, // square
    ],
    fit: 'contain',
    position: 'centre',
    background: {r: 255, g: 255, b: 255, alpha: 1}
  }
]