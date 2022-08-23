import dotenv from 'dotenv';
import Twitter from './src/Twitter'; // custom Twitter client
import data from './data/meta.json'; // array of the data
import { readFile, writeFile } from 'node:fs';
import Logger from './src/utils/Logger'; // custom logger

dotenv.config();

const T = new Twitter({
  appKey: process.env.CONSUMER_KEY || '', // consumer key
  appSecret: process.env.CONSUMER_SECRET || '', // consumer secret
  accessToken: process.env.ACCESS_TOKEN || '', // access token
  accessSecret: process.env.ACCESS_TOKEN_SECRET || '', // access token secret
});

// shuffle ("randomize") the array
function randomizeArrayItems(
  array: Array<{
    files: string[];
    text: string;
    poll?: { duration: number; options: string[] };
    isTweeted: boolean;
  }>
) {
  let currentIndex: number = array.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array; // return the original array but shuffled
}

// run the script every 24 hours
function runDaily() {
  setInterval(() => {
    Logger('proc', 'Running daily...');
    run({ onlyOnce: true });
  }, 60 * 60 * 24 * 1000 /* 1d */);
}

// the script
function run(ops?: { onlyOnce?: boolean }) {
  Logger('proc', 'Running script...');

  const newData = randomizeArrayItems(data); // newData constant is the shuffled array

  let item = newData[0]; // select the first item in the shuffled array

  let index: number = 0; // counter index

  // if the selected item has at least 1 media file (like images or videos)
  if (item.files.length > 0) {
    const ids: string[] = []; // returned media ids for upload to twitter

    // upload every file
    for (const file of item.files) {
      // custom upload method
      T.uploadMedia(`${__dirname}/data/${file}`).then((id) => {
        ids.push(id); // returned media id
        index++; // add +1 to the counter index

        // if the index number is the same as the number of media files, it creates a tweet
        if (index === item.files.length) {
          T.createTweet(item.text, {
            media: ids,
          });
        }
      });
    }
  }
  // if the poll object is defined in the item
  else if (item.poll) {
    // create a tweet with only poll (impossible to use poll and media at the same time)
    T.createTweet(item.text, {
      poll: {
        duration: item.poll.duration,
        options: item.poll.options,
      },
    });
  } else {
    // if there is no media or poll, it just creates a plain text tweet
    T.createTweet(item.text);
  }

  // constant of the new array
  const newArrayData: Array<{
    files: string[];
    text: string;
    poll?: { duration: number; options: string[] };
    isTweeted: boolean;
  }> = [];

  let newIndex: number = 0; // another counter index

  // every item of the shuffled array
  for (const itemData of newData) {
    // if the data is the same as the selected item and the "onlyOnce" option is set to true
    if (itemData === item && ops?.onlyOnce) {
      // if it has a poll object
      if (itemData.poll)
        // pull the updated item to the new updated array
        newArrayData.push({
          files: itemData.files,
          text: itemData.text,
          poll: itemData.poll,
          isTweeted: true, // set the item to tweeted (if the "onlyOnce" option is set to true)
        });
      // if the item has no poll object
      // pull the updated item to the new updated array
      else
        newArrayData.push({
          files: itemData.files,
          text: itemData.text,
          isTweeted: true, // set the item to tweeted (if the "onlyOnce" option is set to true)
        });
    } else {
      // pull the original item to the new updated array
      newArrayData.push(item);
    }

    newIndex++; // add +1 to the counter index

    // if the counting index reached the number of items in the array
    if (newIndex === newData.length)
      // read then update the original data file
      readFile('./data/meta.json', function readFileCallback(err, data) {
        if (err) Logger('error', err.message);
        else {
          // update the file with the new array
          writeFile(
            './data/meta.json', // path
            JSON.stringify(newArrayData, null, 2), // beautified data (you can remove the last 2 params, then the data will not be neatly arranged 😄)
            (err) => {
              if (err) Logger('error', err.message);
            }
          );
        }
      });
  }
}

run({ onlyOnce: true }); // "onlyOnce" is set to true, once an item is tweeted, it will not be selected again
// runDaily(); // run the "run()" script in every 24 hours
