const chalk = require('chalk');

/**
 * Formats feedback text with sentiment-based colorful output
 * @param {string} text - The feedback text to format
 * @returns {string} - Colorfully formatted text based on sentiment
 */
function formatFeedback(text) {
  if (!text || typeof text !== 'string') {
    return chalk.gray('No feedback provided');
  }

  const lowerText = text.toLowerCase();

  // Enhanced negative sentiment keywords
  const negativeKeywords = [
    'bad',
    'boring',
    'terrible',
    'awful',
    'hate',
    'worst',
    'poor',
    'disappointing',
    'useless',
    'waste',
    'confusing',
    'difficult',
  ];

  // Enhanced positive sentiment keywords
  const positiveKeywords = [
    'good',
    'great',
    'excellent',
    'amazing',
    'love',
    'best',
    'awesome',
    'fantastic',
    'wonderful',
    'brilliant',
    'outstanding',
    'perfect',
    'helpful',
    'clear',
    'informative',
  ];

  // Mixed sentiment keywords
  const neutralKeywords = [
    'okay',
    'average',
    'fine',
    'normal',
    'standard',
    'decent',
  ];

  const hasNegative = negativeKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );
  const hasPositive = positiveKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );
  const hasNeutral = neutralKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  if (hasNegative) {
    return chalk.red.bold(text);
  }
  if (hasPositive) {
    return chalk.green.bold(text);
  }
  if (hasNeutral) {
    return chalk.blue(text);
  }

  // Default neutral formatting
  return chalk.yellow(text);
}

/**
 * Gets sentiment score from -2 to 2 (enhanced scoring)
 * @param {string} text - The feedback text to analyze
 * @returns {number} - Sentiment score (-2: very negative, -1: negative, 0: neutral, 1: positive, 2: very positive)
 */
function getSentimentScore(text) {
  if (!text || typeof text !== 'string') return 0;

  const lowerText = text.toLowerCase();

  const veryNegativeKeywords = [
    'terrible',
    'awful',
    'hate',
    'worst',
    'useless',
  ];
  const negativeKeywords = [
    'bad',
    'boring',
    'poor',
    'disappointing',
    'confusing',
  ];
  const neutralKeywords = ['okay', 'average', 'fine', 'normal', 'standard'];
  const positiveKeywords = ['good', 'great', 'helpful', 'clear', 'informative'];
  const veryPositiveKeywords = [
    'excellent',
    'amazing',
    'love',
    'best',
    'awesome',
    'fantastic',
    'perfect',
  ];

  if (veryNegativeKeywords.some((keyword) => lowerText.includes(keyword)))
    return -2;
  if (negativeKeywords.some((keyword) => lowerText.includes(keyword)))
    return -1;
  if (veryPositiveKeywords.some((keyword) => lowerText.includes(keyword)))
    return 2;
  if (positiveKeywords.some((keyword) => lowerText.includes(keyword))) return 1;
  if (neutralKeywords.some((keyword) => lowerText.includes(keyword))) return 0;

  return 0; // Default neutral
}

/**
 * Formats feedback with emoji indicators
 * @param {string} text - The feedback text to format
 * @returns {string} - Text with emoji indicators
 */
function formatWithEmoji(text) {
  const score = getSentimentScore(text);
  const formattedText = formatFeedback(text);

  switch (score) {
    case -2:
      return `😠 ${formattedText}`;
    case -1:
      return `😕 ${formattedText}`;
    case 0:
      return `😐 ${formattedText}`;
    case 1:
      return `😊 ${formattedText}`;
    case 2:
      return `😍 ${formattedText}`;
    default:
      return `🤔 ${formattedText}`;
  }
}

/**
 * Analyzes feedback and returns detailed sentiment information
 * @param {string} text - The feedback text to analyze
 * @returns {object} - Detailed sentiment analysis
 */
function analyzeFeedback(text) {
  const score = getSentimentScore(text);
  const formattedText = formatFeedback(text);

  let sentiment;
  let description;

  switch (score) {
    case -2:
      sentiment = 'Very Negative';
      description = 'This feedback indicates strong dissatisfaction';
      break;
    case -1:
      sentiment = 'Negative';
      description = 'This feedback indicates some dissatisfaction';
      break;
    case 0:
      sentiment = 'Neutral';
      description = 'This feedback is neutral or balanced';
      break;
    case 1:
      sentiment = 'Positive';
      description = 'This feedback indicates satisfaction';
      break;
    case 2:
      sentiment = 'Very Positive';
      description = 'This feedback indicates strong satisfaction';
      break;
    default:
      sentiment = 'Unknown';
      description = 'Unable to determine sentiment';
  }

  return {
    originalText: text,
    formattedText,
    score,
    sentiment,
    description,
    withEmoji: formatWithEmoji(text),
  };
}

module.exports = {
  formatFeedback,
  getSentimentScore,
  formatWithEmoji,
  analyzeFeedback,
};
