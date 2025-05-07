
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { addMedication } from '@/services/medicationService';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ManualEntryForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [medicationData, setMedicationData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    instructions: '',
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMedicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicationData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Required Field",
        description: "Please enter a medication name.",
      });
      return;
    }

    try {
      addMedication({
        name: medicationData.name,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        instructions: medicationData.instructions,
      });
      
      // Reset form and close dialog
      setMedicationData({
        name: '',
        dosage: '',
        frequency: 'Daily',
        instructions: '',
      });
      setOpen(false);
      
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary-300 hover:bg-primary-400">
          <Plus className="mr-2 h-4 w-4" /> Add Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Enter your medication details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Medication name"
                value={medicationData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Input
                id="dosage"
                name="dosage"
                placeholder="e.g., 50mg"
                value={medicationData.dosage}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <select
                id="frequency"
                name="frequency"
                value={medicationData.frequency}
                onChange={handleChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Three Times Daily">Three Times Daily</option>
                <option value="Four Times Daily">Four Times Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructions" className="text-right pt-2">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                name="instructions"
                placeholder="Special instructions or notes"
                value={medicationData.instructions}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-400 hover:bg-primary-500">
              Add Medication
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualEntryForm;
