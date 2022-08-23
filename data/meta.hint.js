// NOTICE
// it's a js file because you can't comment in json
// open "meta.example.json" for examples, this is just the description

[
  {
    "files": ["index.jpg"], // media files of your tweet (supported a few mimetypes from the video/ and image/ mimetypes)
    "text": "👋🏻 Hey there! Check out my new pic", // what's happening? the description of your tweet (hashtags are works)
    "poll": {
      "duration": 20, // duration in minutes (minimum 5)
      "options": [
        "Selection A", // label of the option
        "Selection B"
      ] // you can add up to 4 options
    }, // remove this poll if you don't want to add it to your tweet
    "isTweeted": false // if the selected object has already been tweeted once by the bot, this value will be updated to true and will not be tweeted again
  },
  {
    "files": ["index.jpg", "mycoolimage.png"], // you can add up to 4 images or videos
    "text": "", // you can leave this field empty if you don't want to write something to your tweet, but NEVER REMOVE IT
    "isTweeted": false
  },
  {
    "files": [], // you can leave empty this field too if you don't want to attach any media to your tweet, but NEVER REMOVE IT
    // you can remove the "poll" object
    "text": "",
    "isTweeted": false
  }
  // EXTRA
  // never use the "files" and "poll" fields at the same time, the "files" field is primary
  // you can leave empty the "files" and the "text" field empty, but always fill at least one, because you can't create empty tweets
  // you can remove the "poll" object
  // search up for maximum lengths and image/video sizes

  // valid examples here
]
