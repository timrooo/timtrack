# TimTrack

TimTrack is a small demo project for tracking parts via QR codes. The app is built with Node.js and uses a simple JSON data set stored in `data/` for demonstration.

## Requirements

- [Node.js](https://nodejs.org/) must be installed on your system. Any recent LTS version should work.

## Installation

From the project root, install the dependencies with:

```bash
npm install
```

## Running the app

After installing dependencies, start the development server:

```bash
npm start
```

The server runs on [http://localhost:3000](http://localhost:3000) by default. Once running you can visit the following pages:

- **QR Scanner**: `http://localhost:3000/scan` – Use this to scan a part QR code.
- **Parts list**: `http://localhost:3000/parts` – Browse existing parts from the demo data.

## Demo data

Demo JSON files are located under the `data/` directory. Each file represents a small collection of parts with an `id`, `name` and `location`. To add new sample parts, extend the JSON arrays or add additional files under `data/`.

