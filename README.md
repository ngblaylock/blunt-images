# Blunt Images

Blunt Images is a quick and quite possibly not the best option for adding optimized images to any static site generation tool (specifically 11ty and SvelteKit). A lot of my inspiration for this is a mesh between [Nuxt Image](https://image.nuxtjs.org/) and [Strapi's Media Library](https://strapi.io/features/media-library).

> If anyone has a better way to do this, let me know. This is my hacky way to accomplish a need.
> I have already looked at vite-imagetools (I don't like all the imports).

This was created so I could add an image and generate multiple sizes at build time. For example, I can upload an image to `./images/image-name.jpg` directory and it will create `./optimized-images/thumb_image-name.jpg` as well as `./optimized-images/large_image-name.jpg`. That way I don't have to create two images in Photoshop or Figma and export them.

This runs as a separate NPM command so you can pair it with whatever you might have in `npm run dev`, `npm run build`, or comparative script.

## Configuration

1. Run `npm install @ngblaylock/blunt-images`.
2. Create a `blunt.config.js` file with the following:

```js
module.exports = [
  {
    input: "./images", // REQUIRED - relative to the `blunt.config.js` file
    output: "./optimized-images", // REQUIRED - relative to the `blunt.config.js` file
    sizes: [
      // Provide at least one size
      {
        width: 100, // OPTIONAL - but you should include width and/or height
        height: 100, // OPTIONAL - but you should include width and/or height
        prefix: "thumb", // OPTIONAL - if not present, it will prefix it with a combination of width and height. The width and height prefix will not always be the output file size depending on the fit option passed in.
      },
    ],
    // The following options are sharp options. Just don't use the `options.width` or `options.height` otherwise it will break (that is what the sizes array is for).
    // See: https://sharp.pixelplumbing.com/api-resize
    fit: "contain", // OPTIONAL
    position: "centre", // OPTIONAL
    background: { r: 0, g: 0, b: 0, alpha: 1 }, // OPTIONAL
  },
];
```

1. Add the following to your `package.json`

```json
"scripts": {
  "blunt": "node ./node_modules/@ngblaylock/blunt-images ./blunt.config.js"
},
```

4. Run `npm run blunt`

## Deploy Process

1. Update the version in `package.json`
2. Commit and push changes.
3. Add a new release and tag in GitHub (v1.0.0-beta.x)
4. Run `npm publish`
