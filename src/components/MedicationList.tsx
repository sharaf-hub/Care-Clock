
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Clock, Calendar, Trash2, CheckCircle, Trophy } from 'lucide-react';
import { getMedications, deleteMedication, updateMedication } from '@/services/medicationService';
import { Medication } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import RewardModal from './RewardModal';

const MedicationList: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const { user, updateUserPoints } = useAuth();

  useEffect(() => {
    // Load medications from localStorage
    const loadedMedications = getMedications();
    setMedications(loadedMedications);
  }, []);

  const confirmDelete = (id: string) => {
    setMedicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (medicationToDelete) {
      try {
        deleteMedication(medicationToDelete);
        setMedications(medications.filter(med => med.id !== medicationToDelete));
        toast({
          title: "Medication deleted",
          description: "The medication has been removed from your list.",
        });
      } catch (error) {
        console.error('Failed to delete medication:', error);
      }
      setDeleteDialogOpen(false);
      setMedicationToDelete(null);
    }
  };

  const handleComplete = (medication: Medication) => {
    try {
      // Check if the medication was completed today
      const today = new Date().setHours(0, 0, 0, 0);
      const lastCompleted = medication.lastCompleted ? new Date(medication.lastCompleted).setHours(0, 0, 0, 0) : 0;
      
      // Only give points if not already completed today
      if (lastCompleted < today) {
        const points = 10; // Points earned per medication taken
        setEarnedPoints(points);
        
        // Update medication status
        const updatedMedication = {
          ...medication,
          completed: true,
          lastCompleted: Date.now()
        };
        
        updateMedication(medication.id, updatedMedication);
        
        // Update medications list
        setMedications(medications.map(med => med.id === medication.id ? updatedMedication : med));
        
        // Update user points
        if (updateUserPoints) {
          updateUserPoints(points);
        }
        
        // Show reward modal
        setShowRewardModal(true);
      } else {
        toast({
          title: "Already completed today",
          description: "You've already taken this medication today.",
        });
      }
    } catch (error) {
      console.error('Failed to mark medication as completed:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isTakenToday = (lastCompleted?: number) => {
    if (!lastCompleted) return false;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const completedDate = new Date(lastCompleted).setHours(0, 0, 0, 0);
    return completedDate === today;
  };

  if (medications.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted mt-6">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="rounded-full bg-muted p-4 mx-auto">
            <Pill className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mt-4">No Medications</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You haven't added any medications yet. Use the OCR scanner to add one.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Medications</h2>
        {user?.points !== undefined && (
          <div className="flex items-center gap-2 bg-primary-100 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">{user.points} points</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4 mt-2">
        {medications.map(medication => {
          const takenToday = isTakenToday(medication.lastCompleted);
          
          return (
            <Card key={medication.id} className="overflow-hidden pill-shadow border-0">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary-500">
                      {medication.dosage}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {takenToday && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Taken
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(medication.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span>{medication.frequency}</span>
                  </div>
                  {medication.instructions && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{medication.instructions}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Added on {formatDate(medication.createdAt)}</span>
                </div>
                {!takenToday && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => handleComplete(medication)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Mark as taken
                  </Button>
                )}
              </CardFooter>
              {medication.image && (
                <div className="h-1 bg-gradient-to-r from-primary-300 to-primary-500"></div>
              )}
            </Card>
          );
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medication</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RewardModal 
        open={showRewardModal} 
        onClose={() => setShowRewardModal(false)}
        points={earnedPoints}
      />
    </>
  );
};

export default MedicationList;
