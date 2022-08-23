import {
  TwitterApi,
  TwitterApiTokens,
  TweetV2PostTweetResult,
} from 'twitter-api-v2'; // from twitter api v2
import { readFileSync, stat } from 'node:fs';
import Logger from './utils/Logger'; // custom logger
import { fromBuffer } from 'file-type';

// supported extensions
const SupportedImageExtensions = ['webp', 'jpg', 'png', 'jpeg', 'jfif', 'gif'];
const SupportedVideoExtensions = ['m4v', 'mov', 'mp4'];

// custom Twitter class
export default class Twitter {
  private appKey: string; // consumer key
  private appSecret: string; // consumer secret
  private accessToken?: string; // access token
  private accessSecret?: string; // access token secret

  // new Twitter({tokens})
  constructor(tokens: TwitterApiTokens) {
    this.appKey = tokens.appKey;
    this.appSecret = tokens.appSecret;
    this.accessToken = tokens.accessToken;
    this.accessSecret = tokens.accessSecret;
  }

  // create client
  public client(): TwitterApi {
    return new TwitterApi({
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
      accessSecret: this.accessSecret,
    });
  }

  // create a tweet
  public async createTweet(
    whats_happening: string, // tweet description
    ops?: {
      poll?: {
        duration: number;
        options: string[];
      }; // poll with selections
      media?: string[]; // filepaths (for example: "./data/mycoolpic.png")
    } // optional options
  ): Promise<void> {
    let tweetData: TweetV2PostTweetResult['data'] | null = null; // the result variable

    // if more than 1 media filepath provided
    if (ops && ops.media) {
      // post the tweet with images or videos
      const { data }: TweetV2PostTweetResult = await this.client().v2.tweet(
        whats_happening,
        {
          media: {
            media_ids: ops.media, // media ids (up to 4)
          },
        }
      );

      tweetData = data; // update "tweetData" to the response
    }

    // if the item has a "poll" object
    if (ops && ops.poll) {
      // post the tweet with a poll
      const { data }: TweetV2PostTweetResult = await this.client().v2.tweet(
        whats_happening,
        {
          poll: this.createPoll(ops.poll.duration, ops.poll.options), // create a poll by custom function
        }
      );

      tweetData = data; // update "tweetData" to the response
    }

    // if no options provided
    if (!ops) {
      // post the plain text tweet
      const { data }: TweetV2PostTweetResult = await this.client().v2.tweet(
        whats_happening
      );

      tweetData = data; // update "tweetData" to the response
    }

    // log the tweet
    Logger('info', `Tweeted ${tweetData?.id}! >>> ${tweetData?.text}`);
  }

  // create a poll
  private createPoll(
    duration: number, // duration in minutes
    options: string[] // options
  ): { duration_minutes: number; options: string[] } {
    if (duration < 5)
      Logger(
        'error',
        '[POLL] invalid duration: duration cannot be shorter than 5mins'
      );
    if (duration > 10080)
      Logger(
        'error',
        '[POLL] invalid duration: duration cannot be longer than 7days'
      );
    if (!options.length || options.length < 2)
      Logger(
        'error',
        '[POLL] invalid options: you must enter at least 2 options'
      );
    if (options.length > 4)
      Logger(
        'error',
        '[POLL] invalid options: you can only enter a maximum of 4 options'
      );

    // return the acceptable object
    return {
      duration_minutes: duration,
      options: options,
    };
  }

  // upload a media then return the id
  public async uploadMedia(file: string): Promise<string> {
    Logger('proc', `Reading ${file}...`);

    const buffer = readFileSync(file); // load the buffer

    if (!Buffer.isBuffer(buffer)) Logger('error', 'Media is not a buffer');

    Logger('info', `Loaded ${file}`);

    const info = await fromBuffer(buffer); // get file types

    stat(file, async (err, stats) => {
      if (err) Logger('error', err.message);

      Logger(
        'info',
        `Loaded media: Extension[${info?.ext}] Mime[${info?.mime}] Type[${
          info?.mime.split('/')[0]
        }] SizeKB[${(stats?.size / 1024).toFixed(2)}]`
      );

      let uploadable: boolean; // boolean variable for upload

      switch (info?.mime.split('/')[0]) {
        // if the file type is a video
        case 'video':
          {
            // find supported extension
            const supported = SupportedVideoExtensions.find((element) => {
              return element === info?.ext;
            });

            // if the extension is found, the "uploadable" variable will be set to true
            if (typeof supported !== 'undefined') uploadable = true;
            // if not, the variable will be set to false
            else uploadable = false;
          }
          break;

        // if the file type is a video
        case 'image':
          {
            // find supported extension
            const supported = SupportedImageExtensions.find((element) => {
              return element === info?.ext;
            });

            // if the extension is found, the "uploadable" variable will be set to true
            if (typeof supported !== 'undefined') uploadable = true;
            // if not, the variable will be set to false
            else uploadable = false;
          }
          break;

        // if the file type is not a video or image
        default:
          uploadable = false;
      }

      if (!uploadable) Logger('error', `MimeType ${info?.mime} not supported`);
    });

    Logger('proc', `Uploading ${file}...`);

    // uploading the file to twitter
    const media_id = await this.client().v1.uploadMedia(Buffer.from(buffer), {
      mimeType: info?.mime,
    });

    Logger('info', `Uploaded media buffer: got id ${media_id}`);

    return media_id; // return the media id
  }
}
