# p5.js Project Title

## Project Details

### Dependencies
- nodejs
- npm
- yarn
- uglify-js
- puppeteer
- p5js v1.0.0

## Installation

Dependencies can be installed on Ubuntu with the following commands in the parent directory:
```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
nvm install node
sudo apt install npm
sudo npm install --global yarn uglify-js
yarn install
```

### Development

Important files in the parent directory include:
- *index.html*: This is the primary html file for the application and the features script. 
- *env.js*: This is the environments file to define any environment variables for the application.
- *build.sh*: This is the build file for generating deployment-ready code.

The rest of the code for this project exists in the following folders:
- *src*: Contains source code and shaders that form the primary application (*src/app*) and the feature script (*src/features*). Also contains shared internal libraries in *src/shared*.
- *lib*: Third party libraries, including p5js.
- *scripts*: Build/deployment helper scripts used to generate upload-ready code for ArtBlocks. 
- *dist*: Distributable code generated by the build scripts. This folder contains the code that will live on ArtBlocks.
- *test*: Web development and production tests (html files) that link against the development and production files.
- *doc*: Documentation and reference.

To develop this application, open in VS Code and "Go Live" from the options in the window's bottom bar.

### Release Checklist

1. Determine how to increment the version, according to the rules below. 
2. Update the *src/app/metadata.js* file with the new version.
3. Update the [Changelog](CHANGELOG.md) with the new version and its date. 
4. Commit these changes.
5. Tag the repo and push the tags:
   ```bash
   git tag x.x.x
   git push --tags
   ```

#### Semantic Versioning Rules

| Increment | Change |
|---|---|
| `MAJOR` | consider it a new artwork |
| `MINOR` | significant visual change |
| `PATCH` | bug fix |

In more detail, rules for incrementing version include:
- MAJOR: When the holistic style (or content) changes enough to distinguish it as a different artwork (e.g. a new rendering pipeline).
- MINOR: When there's a significant change in a token's visual appearance (e.g. background blur) or a new feature has been added (e.g. feature script).
- PATCH: Bug fixes, or when there's no noticeable change in a token's visual appearance (e.g. establishing consistency across headful and headless rendering).

### Environment

Create a copy of the file *env/user-data.js.example* and rename to *env/user-data.js*. Objects in here (e.g. `tokenData`) will be passed to the rendering scripts, but won't be committed to the repo.

### Production

Run the following commands at the top level of this repo in a Mac terminal:
```bash
bash build.sh
```

The directories generated inside *dist/* include:
- *app*: Contains the script splits to upload to AB *app-min-split-\** and a minified full script *app-min.js*.
- *demo*: Contains a web-ready html file *index.html* for the application to upload to AWS S3.
- *features*: Contains a feature script *feature-script.js* to upload to AB.

#### Batch Rendering

The repository also support batch rendering of random application outputs, using nodejs + yarn + puppeteer. To get started:

1. Install node modules:
   ```bash
   yarn install
   ```
2. Generate renders using the following command. Some examples follow:
   ```bash
   # Generate 1 random output with default wait time of 60 seconds and resolution of 2400 to the output directory.
   yarn start generate
   # Generate 1000 random outputs with wait time of 60 seconds and resolution of 2400, explicitly. Output to Dropbox folder.
   yarn start generate --batchSize 1000 --waitTime 60 --resolution 2400 --outputDir ~/Dropbox/my_batch_renders
   # Render all of the hashes or mainnet token IDs saved in doc/saved-hashes.sh to the output directory. Supply ArtBlocks project ID, e.g. `999`.
   yarn start generate --hashList doc/saved-hashes.txt --projectID 999
   # Render at max resolution
   yarn start generate --resolution 5760 --waitTime 400
   ```

## Usage

## Troubleshooting

## Notes

## License

### Attribution

| Source | Use | License as of 4/8/2022 |
|---|---|---|
| [AB's `Random` class](https://docs.artblocks.io/creator-docs/creator-onboarding/readme/#safely-deriving-randomness-from-the-token-hash) | Used and modified slightly. | ? |

## Roadmap
