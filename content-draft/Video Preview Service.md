## Video Preview Service

This will sound silly and be awfully revealing, but this project was inspired by pornhub hahaha.

In the view listing links to multiple videos, they allow you to mouse over an individual video link and when this is done, you begin to see a video preview of said video.

This has inspired me to build a service to allow people to create video previews that they can then export and save. They can also retrieve them in realtime if desired.

Another possible route of doing this is via a webcomponent. The only thing different about this though is that the video must be of the same domain as the site, otherwise because of the same origin policy this won't work appropriately.

The underlying architecture behind this is mostly client driven. The server mainly exists to proxy the requests to get the video and make it seem as if it comes from the same origin as the video preview service itself, thus not violating the same origin policy.

The client essentially loads the video and when the first frame of the video is loaded, the preview generation process begins. The first frame loaded of the video element it resides in, has it's image data extracted and saved. Then the video is seeked by some amount and the process of extracting the image data of the frame is repeated. This seeking is and image data extraction continues then until the duration of the video is reached and thus the preview is thus complete, or at least all the info needed to create the preview is extracted.