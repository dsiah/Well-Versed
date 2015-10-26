# Summary
Text-backdrop is a text-contextualization tool that takes a string and returns some relevant news, images, and wikipedia summaries.

# How to use
```javascript
var backdrop = require('text-backdrop');
backdrop('Donald Trump is running for president in 2016').then(console.log)
```
```bash
{
    named_entities: {'Donald Trump': {confidence: ...}}
    textTags: {'right_politics': .1244, 'energy': .0954, 'left_politics': .1674}
    keywords: {'2016': .2015, donald: .2385, trump: .2337}
    news: [{title: 'Presidential Horse Race 2016....', url: ...}, {title: 'Election 2016: Donald Trump...', url: ...}, ...]
    'Donald Trump': {
        images: ...
        summary: 'Donald John Trump (born on June 14, 1946) is an American...'
    }
}
```