
/**
 * Utility for providing voice notifications
 */

/**
 * Speaks the provided text using the browser's speech synthesis API
 * @param text The text to be spoken
 */
export const speak = (text: string) => {
  // Check if speech synthesis is supported by the browser
  if ('speechSynthesis' in window) {
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Configure voice properties
    utterance.volume = 0.8; // 0 to 1
    utterance.rate = 1.0;   // 0.1 to 10
    utterance.pitch = 1.0;  // 0 to 2
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech synthesis is not supported by this browser.");
  }
};
