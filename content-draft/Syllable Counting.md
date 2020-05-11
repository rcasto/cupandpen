## Readability

In working on [readability-component](https://github.com/rcasto/readability-component), it was necessary to develop a function that given a word was able to return the number of syllables in that word.

This problem is surprisingly difficult to solve across the wide amount of odd cases within [our language](https://en.wikipedia.org/wiki/English_language), so a [heuristic](https://en.wikipedia.org/wiki/Heuristic_(computer_science)) is generally a good approach.

In the readability-component scenario, the main use case for this syllable counting functionality is due to the number of syllables in a piece of text contributing towards the [Flesch reading-ease score](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease). It essentially contributes towards the average number of syllables per word in a piece of text. The higher this contribution is equating to a more difficult piece of text.

$$
{\displaystyle 206.835-1.015\left({\frac {\text{total words}}{\text{total sentences}}}\right)-84.6\left({\frac {\text{total syllables}}{\text{total words}}}\right)}
$$

The heuristic within readability-component for computing the number of syllables uses the following rules:

- Vowels consists of `a`, `e`, `i`, `o`, `u`, `y`
- Isolated single vowels contribute 1 syllable for the word
- Consecutive vowels contribute overall 1 syllable for the word
- If a word end in an "e" and has at least 2 syllables, remove the "e"
  - For silent "e" handling for words like "plane"
- If a word end in an "ed" and has at least 2 syllables, remove the "ed"
  - For cases where "ed" does not contribute a syllable, for words like "jumped"

Now, let's step back and think about it.

In one extreme case we could store a dictionary that holds all words and there associated number of syllables. At this point, figuring out the number of syllables for a word would only be a matter of looking that word up in the stored dictionary.

The opposite end of the spectrum is using a completely rules based approach. Given a word, a series of rules, such as the above, is ran against the word, then a number representing the amount of syllables for that word is output.

Typically the best approach though, seems to be a hybrid. Storing a chosen corpus of words mapping to there syllable counts for lookup, then using rules based syllable count approaches on words not contained in this "offline" dictionary.

This is actually how the readability-component works. 

Before defining a corpus, I wanted to understand more, how the rules above performed on a set of words. For this, I used hyphenation data made available via the [Moby Project](https://en.wikipedia.org/wiki/Moby_Project).

![Performance of rules on Moby Project data](/images/moby-project-data-rules-performance.png)

The [code used to generate this performance test](https://github.com/rcasto/readability-component/tree/master/data) can be found in the [readability-component repository](https://github.com/rcasto/readability-component).

As seen from the above results the rules above perform surprisingly well.

### Alternative readability tests

There are [more readability formulas than what is mentioned here](https://en.wikipedia.org/wiki/List_of_readability_tests_and_formulas). Although the Flesch-Kincaid readability ease is one of the most popular. Another popular one I'll call out is [Dale-Chall Readability Formula](https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula).

$$
{\displaystyle 0.1579\left({\frac {\text{difficult words}}{\text{words}}}\times 100\right)+0.0496\left({\frac {\text{words}}{\text{sentences}}}\right)}
$$

In this case, a [corpus of words is used](https://www.readabilityformulas.com/articles/dale-chall-readability-word-list.php), that is primarily driven by familiarity or understanding by at least 80% of 5th graders. If a word is not in the corpus, it is considered difficult.

It should be noted that this readability metric has nothing to do with syllable counting.

### Resources

- [https://www.tug.org/docs/liang/liang-thesis.pdf](https://www.tug.org/docs/liang/liang-thesis.pdf)
- [https://dl.acm.org/doi/10.1145/364995.365002](https://dl.acm.org/doi/10.1145/364995.365002)
- [https://eprints.soton.ac.uk/264285/1/MarchandAdsettDamper_ISCA07.pdf](https://eprints.soton.ac.uk/264285/1/MarchandAdsettDamper_ISCA07.pdf)
- [https://dspace.mit.edu/bitstream/handle/1721.1/16397/03491095-MIT.pdf](https://dspace.mit.edu/bitstream/handle/1721.1/16397/03491095-MIT.pdf)
- [https://sites.cs.ucsb.edu/~pconrad/cs8/10F/labs/lab10/](https://sites.cs.ucsb.edu/~pconrad/cs8/10F/labs/lab10/)
- [https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1144/handouts/210%20Assignment%204.pdf](https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1144/handouts/210%20Assignment%204.pdf)

