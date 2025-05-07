
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import OCRScanner from '@/components/OCRScanner';
import MedicationList from '@/components/MedicationList';
import ManualEntryForm from '@/components/ManualEntryForm';
import { LogOut, User, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigateToRewards = () => {
    navigate('/rewards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-100">
      <header className="p-4 flex justify-between items-center border-b bg-white">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2 flex items-center gap-1" 
            onClick={handleNavigateToRewards}
          >
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{user?.points || 0}</span>
          </Button>
          <div className="text-sm text-right mr-2 hidden sm:block">
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full bg-primary-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-300 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-md p-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Your Medications</h1>
        
        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="scan">Scan Label</TabsTrigger>
            <TabsTrigger value="medications">My Medications</TabsTrigger>
          </TabsList>
          <TabsContent value="scan" className="space-y-4">
            <OCRScanner />
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <ManualEntryForm />
          </TabsContent>
          <TabsContent value="medications">
            <MedicationList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
