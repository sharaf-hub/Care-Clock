
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Scan, Save } from 'lucide-react';
import { recognizeText, parseOcrText } from '@/utils/ocr';
import { addMedication } from '@/services/medicationService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const OCRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [medicationData, setMedicationData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    instructions: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setPreviewImage(URL.createObjectURL(file));
    setScanning(true);
    setProcessing(true);

    try {
      // Process the image with OCR
      const ocrText = await recognizeText(file);
      console.log('OCR Text:', ocrText);
      
      // Parse the OCR text
      const parsedData = parseOcrText(ocrText);
      console.log('Parsed Data:', parsedData);
      
      // Update the medication data with the parsed information
      setMedicationData({
        name: parsedData.name,
        dosage: parsedData.dosage,
        frequency: 'Daily', // Default
        instructions: parsedData.instructions,
      });
      
      // Show the confirmation dialog
      setShowDialog(true);
    } catch (error) {
      console.error('OCR processing error:', error);
      toast({
        variant: "destructive",
        title: "OCR Error",
        description: "Failed to process the image. Please try again.",
      });
    } finally {
      setProcessing(false);
      setScanning(false);
    }
  };

  const handleSaveMedication = () => {
    try {
      // Add the medication to storage
      addMedication({
        name: medicationData.name,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        instructions: medicationData.instructions,
        image: previewImage || undefined,
      });
      
      // Reset the form and close the dialog
      setShowDialog(false);
      setPreviewImage(null);
      setMedicationData({
        name: '',
        dosage: '',
        frequency: 'Daily',
        instructions: '',
      });
      
      toast({
        title: "Medication Added",
        description: "Your medication has been added successfully.",
      });
      
    } catch (error) {
      console.error('Error saving medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the medication. Please try again.",
      });
    }
  };

  return (
    <>
      <Card className="border-dashed border-2 border-primary-300 hover:border-primary-400 transition-colors">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {previewImage ? (
            <div className="relative w-full max-w-xs mx-auto">
              <img
                src={previewImage}
                alt="Medication"
                className="w-full h-auto rounded-md object-cover"
              />
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center ocr-overlay rounded-md">
                  <div className="ocr-container p-6 rounded-md text-white">
                    <Scan className="w-12 h-12 mx-auto mb-2 animate-pulse-slow" />
                    <p>Scanning...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-full bg-primary-100 p-4 mx-auto">
                <Camera className="h-10 w-10 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Scan Medication Label</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Take a picture of your medication label to quickly add it
                </p>
              </div>
              <Button onClick={handleCapture} className="bg-primary-400 hover:bg-primary-500">
                <Camera className="mr-2 h-4 w-4" /> Capture Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Medication Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={medicationData.name}
                onChange={(e) => setMedicationData({ ...medicationData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Input
                id="dosage"
                value={medicationData.dosage}
                onChange={(e) => setMedicationData({ ...medicationData, dosage: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <select
                id="frequency"
                value={medicationData.frequency}
                onChange={(e) => setMedicationData({ ...medicationData, frequency: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Three Times Daily">Three Times Daily</option>
                <option value="Four Times Daily">Four Times Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructions" className="text-right pt-2">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                value={medicationData.instructions}
                onChange={(e) => setMedicationData({ ...medicationData, instructions: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMedication} className="bg-primary-400 hover:bg-primary-500">
              <Save className="mr-2 h-4 w-4" /> Save Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OCRScanner;
