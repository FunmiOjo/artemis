var WordPOS = require("wordpos");
let wordpos = new WordPOS({stopwords: true});

let t1 =
  'A subset of our audience really has an issue with episodes that feature any crimes being done to children.  That\'s understandable, since they are the weakest and most vulnerable members of our society.  But there are cases, however rare, where the "monsters" are the children themselves.\n\nIn this episode we explore three cases in which children killed, seemingly for the sheer pleasure of it.  Beware though, you may not ever want to have children after this episode.';
let t2 =
  "US President Barack Obama has delivered his farewell address, urging Americans to defend their democracy. Mr Obama warned democracy is threatened whenever people take it for granted.";

let t3 =
  "The liberal media continues to praise Obama for his farewell address.  While President Obama continues to bask in the glow of the media praise, he has also found a way to take a few shots and Fox News and Sean.  Sean reacts to this and the ongoing Senate hearings.    The Sean Hannity Show is live Monday through Friday from 3pm - 6pm ET on iHeart Radio and Hannity.com.";

let t4 =
  "Who said Obama didn’t do anything for black folk? The gift of Obama’s legacy to Black folks and 6 things we can learn from it to get us through Trump.";

let t5 = "In “Mrs. Obama,” Amy Davidson writes about the First Lady’s impact.";

const myStopwords = [
  "episode",
  "episodes",
  "podcast",
  "podcasts",
  "after",
  "While"
];

// helper function
function exclude(text) {
  console.log(text.filter(word => !myStopwords.includes(word)));
}

console.log(
  "\n---------------------------",
  t3,
  "\n---------------------------"
);

// WORDPOS ------------------------------------------------------------------
wordpos.getNouns(t3, exclude); // wordpos
