
import { Medication } from '../types';
import { toast } from '../components/ui/use-toast';

const STORAGE_KEY = 'pill-pal-medications';

export const getMedications = (): Medication[] => {
  try {
    const storedMeds = localStorage.getItem(STORAGE_KEY);
    return storedMeds ? JSON.parse(storedMeds) : [];
  } catch (error) {
    console.error('Error getting medications:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load your medications",
    });
    return [];
  }
};

export const addMedication = (medication: Omit<Medication, 'id' | 'createdAt'>): Medication => {
  try {
    const medications = getMedications();
    
    const newMedication: Medication = {
      ...medication,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    
    const updatedMedications = [newMedication, ...medications];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
    
    toast({
      title: "Medication Added",
      description: `${newMedication.name} has been added to your medications.`,
    });
    
    return newMedication;
  } catch (error) {
    console.error('Error adding medication:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to add medication",
    });
    throw error;
  }
};

export const updateMedication = (id: string, updates: Partial<Medication>): Medication => {
  try {
    const medications = getMedications();
    const index = medications.findIndex(med => med.id === id);
    
    if (index === -1) {
      throw new Error('Medication not found');
    }
    
    const updatedMedication = { ...medications[index], ...updates };
    const updatedMedications = [
      ...medications.slice(0, index),
      updatedMedication,
      ...medications.slice(index + 1)
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
    
    return updatedMedication;
  } catch (error) {
    console.error('Error updating medication:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update medication",
    });
    throw error;
  }
};

export const deleteMedication = (id: string): void => {
  try {
    const medications = getMedications();
    const medication = medications.find(med => med.id === id);
    
    if (!medication) {
      throw new Error('Medication not found');
    }
    
    const updatedMedications = medications.filter(med => med.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMedications));
    
    toast({
      title: "Medication Deleted",
      description: `${medication.name} has been removed.`,
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to delete medication",
    });
    throw error;
  }
};

export const getMedicationById = (id: string): Medication | undefined => {
  try {
    const medications = getMedications();
    return medications.find(med => med.id === id);
  } catch (error) {
    console.error('Error getting medication:', error);
    return undefined;
  }
};
