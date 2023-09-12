# Development Notes

## Develop

1. `cd test`
2. Run either
   - `npm run blunt:local` Develop with the local blunt JS file in the root of the project
   - `npm run blunt:npm` Develop with the version installed from NPM in ./test/node_modules/@ngblaylock/blunt-images

## Deploy Process

1. Update the version in `package.json`
2. Remove all `console.log` instances
3. Commit and push changes.
4. Pull into `main`
5. Add a new release and tag in GitHub (v1.0.0-beta.x)
6. Run `npm publish`