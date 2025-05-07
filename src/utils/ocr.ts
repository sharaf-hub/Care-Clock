
import { toast } from '../components/ui/use-toast';

let ocrWorker: any = null;

export const initializeOcr = async () => {
  if (!ocrWorker) {
    try {
      // In a real application, we would use proper OCR libraries like Tesseract.js
      // For this demo, we'll simulate the OCR process
      console.log('OCR initialized');
    } catch (error) {
      console.error('Error initializing OCR:', error);
      toast({
        variant: "destructive",
        title: "OCR Error",
        description: "Failed to initialize OCR functionality",
      });
    }
  }
  return ocrWorker;
};

export const recognizeText = async (imageFile: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeOcr();
      
      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, process the image and extract text
      // For demo purposes, return a mock result based on the image name
      const imageName = imageFile.name.toLowerCase();
      
      if (imageName.includes('advil') || imageFile.size % 5 === 0) {
        resolve("Advil (Ibuprofen) 200mg\nTake 1-2 tablets every 4-6 hours\nDo not exceed 6 tablets in 24 hours");
      } else if (imageName.includes('tylenol') || imageFile.size % 5 === 1) {
        resolve("Tylenol (Acetaminophen) 500mg\nTake 2 tablets every 6 hours\nDo not exceed 8 tablets in 24 hours");
      } else if (imageName.includes('aspirin') || imageFile.size % 5 === 2) {
        resolve("Aspirin 81mg\nTake 1 tablet daily\nTake with food");
      } else if (imageName.includes('lisinopril') || imageFile.size % 5 === 3) {
        resolve("Lisinopril 10mg\nTake 1 tablet daily\nTake at the same time each day");
      } else {
        resolve("Generic Medication 50mg\nTake as directed by your physician\nStore at room temperature");
      }
    } catch (error) {
      console.error('Error recognizing text:', error);
      reject("Failed to process image. Please try again.");
    }
  });
};

export const parseOcrText = (text: string): { 
  name: string; 
  dosage: string; 
  instructions: string;
} => {
  try {
    // In a real application, use NLP or pattern matching to extract info
    // For this demo, we'll parse the mock responses
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 2) {
      return {
        name: 'Unknown Medication',
        dosage: 'Unknown Dosage',
        instructions: text || 'No instructions available'
      };
    }
    
    // Try to extract name and dosage from first line
    const firstLine = lines[0];
    let name = firstLine;
    let dosage = '';
    
    // Look for dosage pattern (e.g., 50mg, 100 mg)
    const dosageMatch = firstLine.match(/(\d+\s*(?:mg|mcg|ml|g|IU))/i);
    if (dosageMatch) {
      dosage = dosageMatch[0];
      name = firstLine.replace(dosageMatch[0], '').trim();
      // Remove parentheses content if present (usually generic name)
      const parenthesesMatch = name.match(/\(([^)]+)\)/);
      if (parenthesesMatch) {
        name = name.replace(/\s*\([^)]+\)/, '').trim();
      }
    } else {
      // If no dosage in first line, check second line
      const secondLineMatch = lines[1].match(/(\d+\s*(?:mg|mcg|ml|g|IU))/i);
      if (secondLineMatch) {
        dosage = secondLineMatch[0];
      }
    }
    
    // Join remaining lines as instructions
    const instructions = lines.slice(1).join('\n');
    
    return {
      name: name || 'Unknown Medication',
      dosage: dosage || 'Unknown Dosage',
      instructions: instructions || 'No instructions available'
    };
  } catch (error) {
    console.error('Error parsing OCR text:', error);
    return {
      name: 'Error Parsing Medication',
      dosage: 'Unknown',
      instructions: 'Failed to parse medication information'
    };
  }
};
