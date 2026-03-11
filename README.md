# `space7`

`space7` is a React Native community-style mobile app focused on topic discovery and discussion. The current project includes a custom home feed, bold card-based UI, animated bottom navigation, and multiple screen folders for features such as discussions, profile, notifications, settings, and spaces.

This repository is intended to be used primarily for **Android** development.

## Overview

- **Framework**: React Native `0.84.1`
- **Language**: TypeScript
- **Navigation**: React Navigation
- **UI style**: Bright, playful, card-driven mobile interface
- **Target platform**: Android
- **Package manager**: `npm`

## Current App Areas

The project currently contains screen folders for:

- `Home`
- `New Topic`
- `My Discussions`
- `My Profile`
- `Notifications`
- `Settings`
- `Space`

## Project Structure

```text
space7/
├── App.tsx
├── package.json
├── android/
├── ios/
├── __tests__/
└── src/
    ├── assets/
    ├── components/
    ├── screens/
    │   ├── home/
    │   ├── my-discussions/
    │   ├── my-profile/
    │   ├── new-topic/
    │   ├── notifications/
    │   ├── settings/
    │   └── space/
    └── types.ts
```

## Requirements

Before running the project, make sure the following are installed and configured:

- **Node.js** `>= 22.11.0`
- **npm**
- **Watchman** on macOS (recommended by React Native)
- **JDK 17** or the version required by your Android Studio setup
- **Android Studio**
- **Android SDK** and platform tools
- At least one of:
  - an Android emulator configured in Android Studio
  - a physical Android device with USB debugging enabled

You should also complete the official React Native Android environment setup:

- [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment)

## Setup

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd space7
```

### 2. Install dependencies

```sh
npm install
```

### 3. Verify Android environment

Make sure an emulator is running, or connect an Android device and confirm it is visible:

```sh
adb devices
```

If `adb` is not found, ensure Android platform-tools are installed and added to your shell `PATH`.

## Running the App

### Start Metro

Run Metro from the project root:

```sh
npm run dev
```

### Run on Android

In a second terminal, build and launch the Android app:

```sh
npm run android
```

### Clean Android build and rerun

If Android build artifacts become stale, use:

```sh
npm run android:clean
```

## Available Scripts

The following scripts are defined in `package.json`:

- `npm run android` — build and launch the Android app
- `npm run android:clean` — clean Gradle output and rerun Android
- `npm run ios` — iOS run command kept by default, but this project is intended for Android use
- `npm run dev` — start the Metro bundler
- `npm run test` — run Jest tests
- `npm run biome:run` — run Biome checks and apply safe formatting fixes
- `npm run link` — link bundled assets using React Native Asset

## Android-Only Notes

Although the repository still contains an `ios/` directory from the default React Native project template, the intended development target for this project is **Android only**.

That means your normal workflow should be:

```sh
npm install
npm run dev
npm run android
```

You do not need to run CocoaPods or maintain iOS builds unless you intentionally decide to support iOS later.

## Styling and UI Notes

This project uses a highly visual mobile UI with:

- large rounded cards
- bright accent colors
- custom tab bar treatment
- topic and author-focused content blocks
- animated interactions built with React Native primitives and navigation components

If you continue building on this codebase, keep new screens visually consistent with the existing bold, playful style.

## Main Dependencies

Some of the key dependencies currently in use are:

- `react`
- `react-native`
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`
- `@react-navigation/stack`
- `react-native-safe-area-context`
- `react-native-screens`
- `react-native-vector-icons`
- `@react-native-vector-icons/*`
- `lodash`

## Development Workflow

Typical daily workflow:

1. Start an emulator or connect an Android device
2. Install dependencies if needed with `npm install`
3. Start Metro with `npm run dev`
4. Run the app with `npm run android`
5. Edit screens/components inside `src/`
6. Use Fast Refresh to see UI updates immediately

## Assets

If you add custom fonts or bundled static assets, place them in `src/assets/` and then run:

```sh
npm run link
```

After linking assets, rebuild the Android app if the changes do not appear immediately.

## Testing

Run the test suite with:

```sh
npm run test
```

## Formatting and Code Quality

Run Biome checks and formatting with:

```sh
npm run biome:run
```

## Troubleshooting

### Metro is already running

If Metro is stuck or running on the wrong port, stop it and restart:

```sh
npm run dev
```

### Android build fails after native dependency or config changes

Use the clean build command:

```sh
npm run android:clean
```

### Device is not detected

Check device connectivity:

```sh
adb devices
```

If your device does not appear:

- make sure USB debugging is enabled
- confirm the USB mode supports file transfer/debugging
- restart `adb`

```sh
adb kill-server
adb start-server
adb devices
```

### Gradle or SDK issues

Open `android/` in Android Studio and confirm:

- SDK path is valid
- required Android SDK packages are installed
- Gradle sync completes successfully

### Cache-related problems

If the app behaves unexpectedly after dependency changes, clear Metro and rebuild:

```sh
npm run dev -- --reset-cache
npm run android:clean
```

## Notes for Contributors

- Keep new code inside `src/` organized by screen or shared component
- Reuse design patterns already present in `App.tsx` and existing screens
- Prefer Android verification for UI changes since Android is the target platform
- Run `npm run biome:run` before finalizing changes

## Next Steps

Good follow-up improvements for this project could include:

- adding reusable theme constants
- documenting navigation flow screen-by-screen
- adding screenshot sections for each major screen
- expanding tests for key UI components

## License

No license information is currently defined in this repository.
