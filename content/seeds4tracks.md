---
timestamp: 1578368124002.5737
---
Recently I have been reviewing old projects and ideas I've had, basically going over my portfolio.

I stumbled across an old project that I coined seeds4tracks.

The basic premise of this project being that you input "seeds", those being artists, tracks, and such. Then these "seeds" are used to generate a set of tracks that hopefully introduces you to some new music to enjoy.

The project didn't have a GitHub repository or anything set up for it yet, and it was just sitting on my machine, but was completed to a good point of functionality. One caveat being "seeds" can only be artists right now.

I decided to breathe some life back into this project and get it back up and running.

With that, I'm happy to say that [seeds4tracks.com](https://seeds4tracks.com) is live!

A repository backing it is also now available:  
[github.com/rcasto/seeds4tracks](https://github.com/rcasto/seeds4tracks)

Give it a shot, and hopefully find some new jams!

This project revival is of course very early, but what's there now is at least the core functionality, making use of the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

Luckily, the Spotify Web API already has a [recommendations endpoint](https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/). And it nicely does not require any user authentication, meaning users don't need to be logged into Spotify itself.

The only limitation with this API is that only a maximum of 5 "seed" objects total are able to be sent in a single request.

To get around this, I generate unique combinations between the input artists of groups of 5, then from these randomly select a certain number of sets to utilize to retrieve recommendation tracks. The results from these requests are aggregated, then de-duped, and then recommendation tracks are randomly picked.