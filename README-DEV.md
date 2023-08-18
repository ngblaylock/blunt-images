# Development Notes

## Develop

1. `cd test`
2. Run either
   - `npm run blunt:local` Develop with the local blunt JS file in the root of the project
   - `npm run blunt:npm` Develop with the version installed from NPM in ./test/node_modules/@ngblaylock/blunt-images

## Deploy Process (Note to self)

1. Update the version in `package.json`
2. Commit and push changes.
3. Pull into `main`
4. Add a new release and tag in GitHub (v1.0.0-beta.x)
5. Run `npm publish`