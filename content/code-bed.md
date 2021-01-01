---
timestamp: 1589173775480.846
deps: code-bed 
---
I've been making a good bit of [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) recently. Trying to figure out good ways to distribute and integrate them.

Through this process I've been then incorporating them into this site. So far it's:

- [readability-component](https://github.com/rcasto/readability-component) - web component for readability and average reading time of content
- [social-contact](https://github.com/rcasto/social-contact) - web component to display social network icons linking to your profile(s)

Another one being added to this list, is [code-bed](https://github.com/rcasto/code-bed), a web component for embedded CodePens.

<code-bed data-slug-hash="ExVoXKW"></code-bed>

Got a little meta there, and made a CodePen that can embed a CodePen, even embedding itself.

All of this embedding though, is [driven by what CodePen already offers](https://blog.codepen.io/documentation/embedded-pens/).

The web component aspect for the most part provides an easier interface for utilization, at least in my opinion haha.

<code-bed data-slug-hash="JBlCc"></code-bed>

I'm just having fun with them now haha. (I didn't make that by the way)

One thing that differentiated making this web component, is that it isn't something, at least now, that is incorporated within this site in any particular static pattern.

The usage of the code-bed web component is driven by its usage in content. Making for a more dynamic pattern.

Particularly I wanted it such that when I am writing this content, I can invoke a special syntax that then allows me to make use a library of web components that are available in the context of the site it is rendered on.

In this case the secret incantation is simply the normal declaritive usage of the web component desired. So for code-bed it looks something like `<code-bed data-slug-hash"wVGGzV"></code-bed>`.

So while that is the version I see, the version you see is:

<code-bed data-slug-hash="wVGGzV"></code-bed>

There is one slight danger to this methodology as it requires the content be interpreted as HTML. An alternative methodology would utilize a transformation layer to convert from some pre-defined activation command into the corresponding HTML representation during render.

Anyway I'm just gonna have a little more fun and add one more, mainly cause I can now haha.

Cheers!

<code-bed data-slug-hash="jcLia" data-height="500"></code-bed>

