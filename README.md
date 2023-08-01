# Blunt Images

Blunt Images is a quick and quite possibly not the best option for adding images to any static site generation tool (specifically 11ty and SvelteKit). A lot of my inspiration for this is a mesh between [Nuxt Image](https://image.nuxtjs.org/) and [Strapi's Media Library](https://strapi.io/features/media-library). 

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
    input: "./images", // relative to the `blunt.config.js` file
    output: "./optimized-images", // relative to the `blunt.config.js` file
    sizes: [
      { width: 100, prefix: 'thumb'},
      { width: 800, prefix: 'big'},
    ],
  },
];
```
3. Add the following to your `package.json`

```json
"scripts": {
  "blunt": "node ./node_modules/@ngblaylock/blunt-images ./blunt.config.js"
},
```
4. Run `npm run blunt`

