# sharedelement

How to use (for now)

It's not a lib just yet, so just install jotai, 
add a resolutions field to package.json
```
  "resolutions": {
    "@react-navigation/native-stack": "aleqsio/react-navigation-fix-transition.git#react-navigation-native-stack-v6.6.2-gitpkg"
  },
```
and copy the SharedElement.tsx from the repo.

Place two `<SharedElement>` components on two separate screens.
Inside of each (as children) place views that render the same content (only their position, width and height will be animated).
Add a `sharedId` prop that equals between the two screens.

## If you dynamically change position (as like inside a scrollview):
1. You can pass a `measureId` prop, it's equal to `sharedId` by default.
2. Call `refreshByMeasureId` from anywhere to measure all `<SharedElement>` views with the matching `measureId`. You can call it from `onScroll`.
