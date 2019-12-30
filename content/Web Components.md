## Web Components
Recently I've been revisiting Web Components. The last time I was playing around with this technology was hmmmmm probably around 2 years ago.

It's really interesting to see how they have evolved since then. The API's aren't too much different, of course they have changed some, but the coolest part. Is how viable they have actually become.

They are a lot more widely supported by multiple browsers now. Of course they are not supported by all, and if you still want to support older browsers, well you are quite fucked.

Anyway, I went ahead and made a few, and will be incorporating them into this site soon.

One of them is a simple web component to display social network contact info via social network branded buttons/logos.
It simply displays them in a block fashion, side by side, only renderng the social networks you provide info for.

The second one, display the readability of a piece of text content and also the average time it would take to read this same content. This one was interesting as it also had me learn about calculating the readability of a piece of text content.

I value this greatly, as I typically aim to make anything I produce simmple to read and understand. I don't care how complicated a topic is, the goal should be simplicity. I believe the ability to distill complex ideas in simple ways truly shows intelligience or understanding of a subject. To be difficult just for the sake of being difficult is simply absurd and makes content less accessible.

Through creating both of these components, I also learned about a new way to distrubute scripts or share these web components and that is through an ES6 module script tag. You can now point script tags at modules, which is freaking awesome. And this is also relatively widely supported.

These components will literally be the only script tags included on this site right now. This site has literally no scripting right now as it is all server rendered. If your browser doesn't support web components they simply won't render, so your experience will be the same as before.

This site will likely never be fancy, I care less and less about that now and more and more about keeping it simple. Anyway, the components I created are on my GitHub and completely open source, feel free to tweak them or use them on your own site or wherever. And if you don't like something or there is a bug, open up an issue and I might fix it or yell back. I play.