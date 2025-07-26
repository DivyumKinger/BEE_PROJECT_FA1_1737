# 🎨 Feedback Colorful Formatter

A beautiful npm package that adds sentiment-based colorful formatting to feedback text using chalk. Perfect for CLI applications, feedback systems, and any Node.js project that needs intelligent text formatting.

## ✨ Features

- 🎨 **Sentiment-based color formatting** - Automatically colors text based on emotional content
- 📊 **Sentiment scoring** - Get numerical sentiment scores from -2 to 2
- 😊 **Emoji indicators** - Add emoji representations for different sentiments
- 🔍 **Detailed analysis** - Get comprehensive sentiment analysis reports
- 🚀 **Easy to use** - Simple API with zero configuration

## 🛠 Installation

```bash
npm install feedback-colorful-formatter
```

## 📖 Usage

### Basic Formatting

```javascript
const { formatFeedback } = require('feedback-colorful-formatter');

// Positive feedback appears in green
console.log(formatFeedback('This is an excellent course!'));

// Negative feedback appears in red
console.log(formatFeedback('This course is terrible'));

// Neutral feedback appears in yellow
console.log(formatFeedback('The course covers basic topics'));
```

### Sentiment Scoring

```javascript
const { getSentimentScore } = require('feedback-colorful-formatter');

console.log(getSentimentScore('This is amazing!')); // 2 (very positive)
console.log(getSentimentScore('This is good')); // 1 (positive)
console.log(getSentimentScore('This is okay')); // 0 (neutral)
console.log(getSentimentScore('This is bad')); // -1 (negative)
console.log(getSentimentScore('This is terrible')); // -2 (very negative)
```

### Emoji Enhancement

```javascript
const { formatWithEmoji } = require('feedback-colorful-formatter');

console.log(formatWithEmoji('I love this course!')); // 😍 [green text]
console.log(formatWithEmoji('This is confusing')); // 😕 [red text]
```

### Detailed Analysis

```javascript
const { analyzeFeedback } = require('feedback-colorful-formatter');

const analysis = analyzeFeedback('This course is absolutely fantastic!');

console.log(analysis);
// Output:
// {
//   originalText: "This course is absolutely fantastic!",
//   formattedText: "[green colored text]",
//   score: 2,
//   sentiment: "Very Positive",
//   description: "This feedback indicates strong satisfaction",
//   withEmoji: "😍 [green colored text]"
// }
```

## 🎯 API Reference

### `formatFeedback(text)`

Formats text with sentiment-based colors.

- **Parameters:** `text` (string) - The feedback text to format
- **Returns:** Colorfully formatted string using chalk
- **Colors:** Red (negative), Green (positive), Blue (neutral keywords), Yellow (default)

### `getSentimentScore(text)`

Analyzes text and returns numerical sentiment score.

- **Parameters:** `text` (string) - The feedback text to analyze
- **Returns:** Number from -2 to 2 representing sentiment intensity

### `formatWithEmoji(text)`

Formats text with both colors and emoji indicators.

- **Parameters:** `text` (string) - The feedback text to format
- **Returns:** Formatted string with emoji prefix

### `analyzeFeedback(text)`

Provides comprehensive sentiment analysis.

- **Parameters:** `text` (string) - The feedback text to analyze
- **Returns:** Object with detailed analysis including score, sentiment, and description

## 🔤 Sentiment Keywords

**Very Positive:** excellent, amazing, love, best, awesome, fantastic, perfect  
**Positive:** good, great, helpful, clear, informative  
**Neutral:** okay, average, fine, normal, standard, decent  
**Negative:** bad, boring, poor, disappointing, confusing, difficult  
**Very Negative:** terrible, awful, hate, worst, useless

## 🎨 Color Scheme

- 🔴 **Red Bold:** Very negative sentiment
- 🟢 **Green Bold:** Positive sentiment
- 🔵 **Blue:** Neutral keywords
- 🟡 **Yellow:** Default/unclassified text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use in your projects!

## 🏷 Tags

`sentiment-analysis` `feedback` `cli` `chalk` `colors` `text-formatting` `nodejs` `npm-package`
