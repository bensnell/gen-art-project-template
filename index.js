import puppeteer from 'puppeteer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import cliProgress from 'cli-progress';
import path from 'path';
import fs from 'fs';
import ArtBlocks from 'artblocks';

// Ethereum mainnet connection
let artblocks = new ArtBlocks("thegraph", "mainnet");
async function getTokenHash(token) {
  let hash = null;
  try {
    const response = await artblocks.token_metadata(token);
    hash = response.token_hash;
  } catch (error) {
    hash = null;
  }
  return hash
};

function random_hash() {
  let x = "0123456789abcdef", hash = '0x'
  for (let i = 64; i > 0; --i) {
    hash += x[Math.floor(Math.random() * x.length)]
  }
  return hash;
};

const generateImage = async (tokenHash, waitTime, resolution, aspectRatio, path, verbose) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // '--disable-web-security', // Ignore CORS
    ],
  });
  const page = await browser.newPage();

  if (verbose) {
    page.on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`));
    page.on('pageerror', ({ message }) => console.log(message));
    page.on('response', response => console.log(`${response.status()} ${response.url()}`));
    page.on('requestfailed', request => console.log(`${request.failure().errorText} ${request.url()}`));
  }

  let height = aspectRatio <= 1 ? resolution : resolution / aspectRatio;
  let width = aspectRatio >= 1 ? resolution : resolution * aspectRatio;

  height = height % 1 == 0 ? height : Math.trunc(height) + 1;
  width = width % 1 == 0 ? width : Math.trunc(width);

  await page.setViewport({
    width: width,
    height: height,
    deviceScaleFactor: 1,
  });

  // Get the deployment-ready html file
  let html = fs.readFileSync(
    'dist/demo/index.html',
    { encoding: 'utf-8' }
  );

  // Insert custom user token data
  html = html.replace(
    "//INSERT_USER_TOKEN_DATA//",
    "tokenData.hash='" + tokenHash + "';"
  );

  // Set the html
  await page.setContent(html);

  await page.waitForTimeout(waitTime);
  await page.screenshot({
    path: path,
    omitBackground: true,
  });
  await browser.close();
};

const processBatch = async (hashes, waitTime, resolution, aspectRatio, outputDir, showBar, verbose) => {

  if (showBar) {
    bar.start(waitTime * hashes.length, 0);
    interval = setInterval(function () {
      bar.increment();
    }, 1000);
  }

  for (var i = 0; i < hashes.length; i++ ) {
    let tokenHash = hashes[i];
    await generateImage(
      tokenHash,
      waitTime * 1000,
      resolution,
      aspectRatio,
      path.join(outputDir, tokenHash.toString() + '.png'),
      verbose
    );
  };
    
  if (showBar) {
    clearInterval(interval);
    bar.stop();
  }
};

const bar = new cliProgress.SingleBar(
  {
    format: 'RENDERING... ' + '{bar}' + ' ETA: {eta}s',
  },
  cliProgress.Presets.shades_classic
);
let interval;

yargs(hideBin(process.argv))
  .strict()
  .command(
    'generate [batchSize] [waitTime] [resolution] [aspectRatio] [outputDir] [noBar] [verbose] [hashList] [projectID]',
    'Batch render a set of hashes (optionally random) to images.',
    (yargs) => {
      yargs
        .option('batchSize', {
          description: 'The number of images to generate',
          type: 'number',
        })
        .option('waitTime', {
          description: 'The wait time in seconds for each render',
          type: 'number',
        })
        .option('resolution', {
          description: 'The YxY resolution to generate at default is 2400 (what artblocks uses)',
          type: 'number',
        })
        .option('aspectRatio', {
          description: 'The aspect ratio to render the token at, it is in the token metadata',
          type: 'number',
        })
        .option('outputDir', {
          description: 'Specify the output folder of the images',
          type: 'string',
        })
        .option('noBar', {
          description: 'Flag to show loading bar, defaults to true.',
          type: 'boolean',
        })
        .option('verbose', {
          description: 'Flag to show verbose logging, defaults to false.',
          type: 'boolean'
        })
        .option('hashList', {
          description: 'Path to a list of token hashes to render. Will override batchSize.',
          type: 'string'
        })
        .option('projectID', {
          description: 'Art Blocks mainnet project ID to use with any token IDs listed in a provided file. Default: 0',
          type: 'string'
        });
    },
    async (argv) => {
      const batchSize = argv.batchSize ? argv.batchSize : 1;
      const waitTime = argv.waitTime ? argv.waitTime : 60;
      const resolution = argv.resolution ? argv.resolution : 2400;
      const aspectRatio = argv.aspectRatio ? argv.aspectRatio : 1;
      const outputDir = argv.outputDir ? argv.outputDir : 'output';
      const showBar = argv.noBar ? false : true;
      const verbose = argv.verbose ? true : false;
      const hashList = argv.hashList;
      const projectID = argv.projectID ? argv.projectID : 0;

      var hashes = [];
      if (hashList && fs.existsSync(hashList)) {
        // Read the file and load all hashes
        hashes = fs.readFileSync(hashList, {encoding:'utf8', flag:'r'})
          .toString()
          .split("\n")
          .map(item => item.trim())
          .filter(item => item != '')
          .map(item => {
            let matches = item.match(/(0x[\da-zA-Z]*)/g);
            if (matches && matches.length > 0) {
              return matches[0]; // hash
            }
            // Otherwise, tentatively assume this is a token ID.
            // Try parsing the token ID and give it the projectID specified.
            let tokenID = parseInt(item);
            if (!isFinite(tokenID)) return null;
            if (tokenID < 1000000) tokenID = tokenID + projectID * 1000000;
            // Get a promise that resolves to the hash.
            return getTokenHash(tokenID);
          });
        // Wait for all hashes to be retrieved, then remove any invalid ones.
        hashes = await Promise.all(hashes);
        hashes = hashes.filter(hash => hash);
      } else {
        // The provided hashes will all be random.
        hashes = (new Array(batchSize).fill('')).map(i => random_hash());
      }

      if (waitTime < 0) {
        console.error(`The wait time ${waitTime} is not valid`);
        return;
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      await processBatch(hashes, waitTime, resolution, aspectRatio, outputDir, showBar, verbose);
    }
  )
  .strict()
  .demandCommand()
  .help()
  .wrap((2 * yargs.terminalWidth) / 4).argv;
