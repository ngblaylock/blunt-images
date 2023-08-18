# Blunt Images

Blunt Images is a quick and, quite possibly, not the best option for adding optimized images to any static site generation tool (specifically 11ty and SvelteKit). A lot of my inspiration for this is a mesh between [Nuxt Image](https://image.nuxtjs.org/) and [Strapi's Media Library](https://strapi.io/features/media-library).

"Blunt" comes from two things. First, it is an antonym of "Sharp", the package I use for resizing. "Blunt" can also mean that it is very straightforward, which I believe this package does well.

> If anyone has a better way to do this, let me know. This is my hacky way to accomplish a need.
>
> I have already looked at vite-imagetools (I don't like all the imports).

This was created so I could add one image to my directory which would trigger Node to generate multiple sizes. For example, I can upload an image to `./images/image-name.jpg` directory and it would create `./optimized-images/thumb_image-name.jpg` as well as `./optimized-images/large_image-name.jpg`. That way I don't have to create two sizes of the same images in Photoshop or Figma and export them.

This is intended to run in parallel with whatever static site generator, so you can pair it with whatever you might have in `npm run dev`, `npm run build`, or comparative script.

The main drawback to this script is that it will create images that you might not actually use in your site.

## Configuration

1. Run `npm install @ngblaylock/blunt-images`.
2. Create a `blunt.config.js` file with the following:

```js
module.exports = [
  {
    input: "./images", // REQUIRED - relative to the `blunt.config.js` file
    output: "./optimized-images", // REQUIRED - relative to the `blunt.config.js` file
    includeOriginal: false, // OPTIONAL - Boolean, default false. This will provide a optimized image at the original width and height (sizes have no effect here)
    sizes: [
      // Provide at least one size
      {
        width: 100, // OPTIONAL - but you should include width and/or height
        height: 100, // OPTIONAL - but you should include width and/or height
        prefix: "thumb", // OPTIONAL - if not present, it will prefix it with a combination of width and height. The width and height prefix will not always be the output file size depending on the fit option passed in `sharpOptions`.
      },
    ],
    // The following options are sharp resize options (options.*). Just don't use the `options.width` or `options.height` otherwise it will break (that is what the sizes array above is for).
    // OPTIONAL - All below
    // See: https://sharp.pixelplumbing.com/api-resize
    sharpOptions: {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 1 },
      withoutEnlargement: true,
    },
  },
];
```

3. Add the following to your `package.json`

```json
"scripts": {
  "blunt": "node ./node_modules/@ngblaylock/blunt-images ./blunt.config.js"
},
```

4. Run `npm run blunt` to start watching the input directory(s). Whatever images are there will re-generate and any new images added will be watched and generated.

## Suggestion

The optimized images probably don't need to be tracked by Git. As long as the original images are there whenever you run the script it will re-generate them for you.

## Handle ESM Type Package

If you have `"type": "module"` in your package.json you will likely get an error saying that blunt.config.js can't work. All you need to do is change your config file extension to `.cjs` like `blunt.config.cjs` and update the filename in your npm script.
