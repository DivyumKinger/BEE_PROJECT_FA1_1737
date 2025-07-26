// Test script for feedback-colorful-formatter package
const {
  formatFeedback,
  getSentimentScore,
  formatWithEmoji,
  analyzeFeedback,
} = require('./index');

console.log('🎨 Testing Feedback Colorful Formatter Package\n');

// Test cases
const testFeedbacks = [
  'This course is absolutely excellent!',
  'The lectures are boring and confusing',
  "It's okay, nothing special",
  'I love the interactive sessions',
  'This is the worst course ever',
  'The content is informative and helpful',
  'Average quality, could be better',
];

console.log('=== Basic Formatting Test ===');
testFeedbacks.forEach((feedback, index) => {
  console.log(`${index + 1}. ${formatFeedback(feedback)}`);
});

console.log('\n=== Sentiment Scoring Test ===');
testFeedbacks.forEach((feedback, index) => {
  const score = getSentimentScore(feedback);
  console.log(`${index + 1}. Score: ${score} | Text: "${feedback}"`);
});

console.log('\n=== Emoji Formatting Test ===');
testFeedbacks.forEach((feedback, index) => {
  console.log(`${index + 1}. ${formatWithEmoji(feedback)}`);
});

console.log('\n=== Detailed Analysis Test ===');
const detailedExample = 'This course is fantastic and very helpful!';
const analysis = analyzeFeedback(detailedExample);
console.log('Analysis Result:');
console.log(`- Original: ${analysis.originalText}`);
console.log(`- Sentiment: ${analysis.sentiment} (Score: ${analysis.score})`);
console.log(`- Description: ${analysis.description}`);
console.log(`- With Emoji: ${analysis.withEmoji}`);

console.log('\n✅ Package testing completed!');
