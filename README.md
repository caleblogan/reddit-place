# Reddit Place
Simple app that shows the final pixel placements. Each pixel is mapped
to the user that placed it. The data comes from reddit's final data
dump. About 3000 pixels were excluded because they contained the coordinate
1000 which shouldn't be a valid pixel. I decoded as many usernames as I
could using b64(sha1) on an incomplete list of users that participated
in r/place.

[logo]: ./dist/reddit-place-example.png "reddit place"

# Demo
The data file is 35Mb so it will take a while to load.
http://true-cakes.surge.sh/