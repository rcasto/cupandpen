---
timestamp: 1578367920108.7803
---
Recently I've been revisiting [Web Components](https://www.webcomponents.org/specs). The last time I was played around with this technology was probably around 2 years ago.

It's really interesting to see how they have evolved since then. The API's aren't too much different, of course they have changed some, but the coolest part. Is how viable they have actually become.

They are a lot more [widely supported by browsers now](https://caniuse.com/#search=web%20components). Of course they are not supported by all, and if you still want to support older browsers, well you are a little fucked, but they simply won't render and you can provide a fallback scenario by providing HTML within your custom element tag.

Anyway, I went ahead and made a few, and they are incorporated in this site now. One in the footer, and one at the top of each content article, like this one.

One of them is a [simple web component to display social network contact info](https://github.com/rcasto/social-contact) via social network branded buttons/logos.
It simply displays them in a block fashion, side by side, only renderng the social networks you provide info for.

The second one [displays the readability of a piece of text content](https://github.com/rcasto/readability-component) and also the average time it would take to read this same content. This one was interesting as it also had me learn about how to exactly calcule or estimate the readability of a piece of text content.

Through creating both of these components, I also learned about a new way to distrubute scripts or share these web components and that is through an [ES6 module script tag](https://caniuse.com/#feat=es6-module). You can now point script tags at modules, which is freaking awesome. And this is also relatively widely supported.

These components are literally the only script tags included on this site right now. This site has practically no scripting as it is all server rendered. If your browser doesn't support web components they simply won't render, so your experience will be the same as before.

On that note, this site will likely never be fancy, I care less and less about that and more and more about keeping it simple and accessible. Anyway, the components I created are on my [GitHub](https://github.com/rcasto) and are completely open source, feel free to tweak them or use them on your own site or wherever. And if you don't like something or there is a bug, open up an issue and I might fix it or yell back haha, I play.