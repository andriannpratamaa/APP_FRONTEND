# Project Configuration Notes

## Important: Page Routes in src/app/

All Expo Router pages are located in `src/app/` (not `./app/`).

## Entry Point

`index.ts` uses `ExpoRoot` with `require.context('./src/app')` instead of `import 'expo-router/entry'`.

## app.json Config

The expo-router plugin must specify `root: "src/app"`:

```json
{
  "plugins": [
    ["expo-router", { "root": "src/app" }]
  ]
}
```
