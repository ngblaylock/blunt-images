const sharedOptions = {
  fit: "contain",
  position: "centre",
  background: { r: 0, g: 0, b: 0, alpha: 1 },
};

module.exports = [
  {
    input: "./images",
    output: "./optimized-images",
    includeOriginal: true,
    preserveFileStructure: true,
    sizes: {
      thumb: {
        width: 100,
        height: 200,
        fit: 'inside'
      },
      large: {
        width: 400,
        height: 300,
      },
    },
  },
  {
    input: "./images2",
    output: "./optimized-images2",
    sizes: {
      portrait: {
        width: 100,
        height: 200,
        ...sharedOptions,
      },
      landscape: {
        width: 300,
        height: 200,
        ...sharedOptions,
      },
      square: {
        width: 400,
        height: 400,
        ...sharedOptions,
      },
    },
  },
];
