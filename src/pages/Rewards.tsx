
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { LogOut, User, Star, Trophy, ArrowLeft } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Rewards: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Calculate next reward level (example logic)
  const currentPoints = user?.points || 0;
  const nextLevelThreshold = Math.ceil(currentPoints / 100) * 100;
  const progress = (currentPoints % 100) / 100 * 100;

  // Example rewards based on points milestones
  const rewardsHistory = [
    { name: "First Dose", points: 10, icon: <Star className="text-yellow-400 h-5 w-5" />, unlocked: currentPoints >= 10 },
    { name: "Perfect Week", points: 50, icon: <Star className="text-yellow-400 h-5 w-5" />, unlocked: currentPoints >= 50 },
    { name: "Health Champion", points: 100, icon: <Trophy className="text-yellow-400 h-5 w-5" />, unlocked: currentPoints >= 100 },
    { name: "Medicine Master", points: 250, icon: <Trophy className="text-yellow-400 h-5 w-5" />, unlocked: currentPoints >= 250 },
    { name: "Health Hero", points: 500, icon: <Trophy className="text-yellow-400 h-5 w-5" />, unlocked: currentPoints >= 500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-100">
      <header className="p-4 flex justify-between items-center border-b bg-white">
        <Logo size="md" />
        <div className="flex items-center gap-2">
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
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Your Rewards</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Points</span>
              <span className="text-primary flex items-center">
                {currentPoints} <Star className="ml-1 h-4 w-4 text-yellow-400" />
              </span>
            </CardTitle>
            <CardDescription>Next level: {nextLevelThreshold} points</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm mt-2 text-muted-foreground">
              {nextLevelThreshold - currentPoints} more points needed
            </p>
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <div className="space-y-3">
          {rewardsHistory.map((reward, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                reward.unlocked 
                  ? 'bg-white border-primary-200' 
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${reward.unlocked ? 'bg-primary-100' : 'bg-gray-100'}`}>
                  {reward.icon}
                </div>
                <div>
                  <p className="font-medium">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reward.points} points
                  </p>
                </div>
              </div>
              {reward.unlocked && (
                <Trophy className="h-5 w-5 text-primary-400" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rewards;
