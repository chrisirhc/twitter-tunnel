/* Author: Chris Chua

*/

// This is an example response from:
// http://api.twitoaster.com/conversation/search.json?query=@fakeraffles&show_replies=true
var exampleresponse = [
  {
  "thread": {
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
      "id": "46805572842033152",
    "title": "Is @fakeraffles the pri sch secondary sch n jc all tgt in one acct??",
    "content": "Is @fakeraffles the pri sch secondary sch n jc all tgt in one acct??",
    "created_at": {
      "datetime_gmt": "2011-03-13 05:31:32",
      "unix_timestamp": 1299994292
    },
    "last_reply_at": {
      "datetime_gmt": "2011-03-13 08:24:11",
      "unix_timestamp": 1300004651
    },
    "stats": {
      "total_mentions": 5,
      "total_replies": 5,
      "total_retweets": 0,
      "distinct_users": 4,
      "links": 1,
      "images": 0
    },
    "user": {
      "url": "http://twitoaster.com/country-sg/ellehcer/",
        "id": "49662707",
      "screen_name": "ellehcer",
      "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
    }
  },
  "replies": [
    {
    "type": "reply",
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46809596156841984",
      "id": "46809596156841984",
    "content": "@ellehcer Note: RGPS is in no way affiliated to the Raffles schools.",
    "in_reply_to_status_id": "46805572842033152",
    "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
      "created_at": {
      "datetime_gmt": "2011-03-13 05:47:32",
      "unix_timestamp": 1299995252
    },
    "user": {
      "url": false,
      "id": "265103284",
      "screen_name": "fakeRaffles",
      "profile_image_url": "http://a1.twimg.com/profile_images/1270548621/Raffles_Institution_Coat_of_Arms_normal.png"
    }
  },
  {
    "type": "reply",
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46814919412297728",
      "id": "46814919412297728",
    "content": "@fakeRaffles oh really. Oops sorry same name leh i not frm raffles how to know?",
    "in_reply_to_status_id": "46809596156841984",
    "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46809596156841984",
      "created_at": {
      "datetime_gmt": "2011-03-13 06:08:41",
      "unix_timestamp": 1299996521
    },
    "user": {
      "url": "http://twitoaster.com/country-sg/ellehcer/",
        "id": "49662707",
      "screen_name": "ellehcer",
      "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
    }
  },
  {
    "type": "reply",
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46820113336385536",
      "id": "46820113336385536",
    "content": "@ellehcer help japan http://1goldblog.blogspot.com/search?upd...",
      "in_reply_to_status_id": "46805572842033152",
    "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
      "created_at": {
      "datetime_gmt": "2011-03-13 06:29:19",
      "unix_timestamp": 1299997759
    },
    "user": {
      "url": "http://twitoaster.com/digthegold/",
        "id": "247338955",
      "screen_name": "digthegold",
      "profile_image_url": "http://a1.twimg.com/profile_images/1268379387/1000000497_normal.jpg"
    }
  },
  {
    "type": "reply",
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46843301957083136",
      "id": "46843301957083136",
    "content": "@ellehcer no la it's fake sir Stamford raffles",
    "in_reply_to_status_id": "46805572842033152",
    "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
      "created_at": {
      "datetime_gmt": "2011-03-13 08:01:28",
      "unix_timestamp": 1300003288
    },
    "user": {
      "url": false,
      "id": "252569439",
      "screen_name": "MagNET92",
      "profile_image_url": "http://a1.twimg.com/profile_images/1245139716/profpi_normal.jpg"
    }
  },
  {
    "type": "reply",
    "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46849020584402944",
      "id": "46849020584402944",
    "content": "@MagNET92 ohhhhh. Okay but isn't he dead alr? Can't he be a real dead guy instd of pretending to be alive?",
    "in_reply_to_status_id": "46843301957083136",
    "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46843301957083136",
      "created_at": {
      "datetime_gmt": "2011-03-13 08:24:11",
      "unix_timestamp": 1300004651
    },
    "user": {
      "url": "http://twitoaster.com/country-sg/ellehcer/",
        "id": "49662707",
      "screen_name": "ellehcer",
      "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
    }
  }
  ]
}
];

/**
 * This method will format the data (sample provided above)
 * to allow JIT to read and visualize the graph.
 */
function formatData(data) {
  // Do something to data
  return data;
}
