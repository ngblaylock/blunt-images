module.exports = [
  {
    input: "./images",
    output: "./optimized-images",
    includeOriginal: true,
    preserveFileStructure: true,
    sizes: [
      { width: 100, height: 200, prefix: 'thumb'},
      { width: 800, height: 400, prefix: 'large'},
    ],
    sharpOptions: {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    }
  },
  {
    input: "./images2",
    output: "./optimized-images2",
    sizes: [
      { width: 100, height: 200 }, // portrait
      { width: 300, height: 200 }, // landscape
      { width: 400, height: 400 }, // square
    ],
    fit: "contain",
    position: "centre",
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  },
];
