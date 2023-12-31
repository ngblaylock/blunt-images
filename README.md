# Blunt Images

Blunt Images is a quick and easy option for adding optimized images to any static site generation tool (like 11ty or SvelteKit). A lot of my inspiration for this is a mesh between [Nuxt Image](https://image.nuxtjs.org/) and [Strapi's Media Library](https://strapi.io/features/media-library).

"Blunt" comes from two things. First, it is an antonym of "Sharp", the package I use for resizing. I use an antonym because this is a hacky solution to my problem. "Blunt" can also mean that it is very straightforward, which I believe this package does well.

> If anyone has a better way to do this, let me know. This is my hacky way to accomplish a need.
>
> I have already looked at vite-imagetools (I don't like all the imports).

This was created so I could add one image to my directory which would trigger Node to generate multiple sizes. For example, I can upload an image to `./images/image-name.jpg` directory and based on my configuration file it would create `./optimized-images/thumb_image-name.jpg` as well as `./optimized-images/large_image-name.jpg`. That way I don't have to create two sizes of the same images in Photoshop or Figma and export them.

This is intended to run in parallel with any static site generator, so you can pair it with whatever you might have in `npm run dev`, `npm run build`, or comparative script.

The main drawback with this script is that it may create images that you might not actually use in your site.

## Configuration

### Step 1

Run `npm install @ngblaylock/blunt-images`.

### Step 2

Create a `blunt.config.js` file with the following boilerplate. You can refer to my [test blunt.config.js](https://github.com/ngblaylock/blunt-images/blob/main/test/blunt.config.js) for a more robust example.

```js
module.exports = [
  {
    input: "./images", // REQUIRED - relative to the `blunt.config.js` file
    output: "./optimized-images", // REQUIRED - relative to the `blunt.config.js` file
    includeOriginal: false, // OPTIONAL - Boolean, default false. This will provide a optimized image at the original width and height (sizes have no effect here)
    preserveFileStructure: false, // OPTIONAL - Boolean, default false. If true, this will preserve the same folder structure in the output directory used in the input directory. If false, it will output all files directly under the output directory
    sizes: {
      // Provide at least one size. The object key here will be the name of the file prefix. All images generated with this example will be prefixed with 'thumb_'
      thumb: {
        // OPTIONAL - but you must include width and/or height
        // See: https://sharp.pixelplumbing.com/api-resize
        width: 100,
        height: 100,
        fit: "contain",
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 1 },
        withoutEnlargement: true,
      },
    },
  },
];
```

### Step 3

Add the following to your `package.json`

```json
"scripts": {
  "blunt:watch": "node ./node_modules/@ngblaylock/blunt-images ./blunt.config.js --watch", // Or use -w instead of --watch
  "blunt": "node ./node_modules/@ngblaylock/blunt-images ./blunt.config.js"
},
```

### Step 4

Run `npm run blunt:watch` to start watching the input directory(s). Whatever images are there will re-generate and any new images added will be watched and generated. If you don't need to watch new files, just exclude the `--watch` or the `-w`.

## Suggestion

The optimized images probably don't need to be tracked by Git. As long as the original images are there whenever you run the script it will re-generate them for you.

## Handle ESM Type Package

If you have `"type": "module"` in your package.json you will likely get an error saying that blunt.config.js can't work. All you need to do is change your config file extension to `.cjs` like `blunt.config.cjs` and update the filename in your npm script.
