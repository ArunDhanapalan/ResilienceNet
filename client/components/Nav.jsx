// client/components/Nav.jsx
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  MapPin, 
  Users, 
  FileText, 
  Plus, 
  Building2, 
  LogOut,
  Home,
  Settings,
  TrendingUp,
  Landmark
} from 'lucide-react';

const Nav = ({ user, setView, currentView, logout }) => {
  return (
    <>
      {/* Universal Bottom Navigation - works for both mobile and desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {user?.role !== 'govt' ? (
            <>
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('home')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </Button>
              <Button
                variant={currentView === 'community' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('community')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Community</span>
              </Button>
              <Button
                variant={currentView === 'my_issues' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('my_issues')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">My Issues</span>
              </Button>
              <Button
                variant={currentView === 'report' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('report')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Report</span>
              </Button>
              <Button
                variant={currentView === 'infra_updates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('infra_updates')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs">Alerts</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex flex-col items-center hover:bg-red-600/60 space-y-1 h-16 w-16"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-xs">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('home')}
                className="flex flex-col items-center space-y-1 p-x-2 h-16 w-16"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </Button>
              <Button
                variant={currentView === 'community' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('community')}
                className="flex flex-col items-center space-y-1 p-x-2 h-16 w-16"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Issues</span>
              </Button>
              <Button
                variant={currentView === 'infra' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('infra')}
                className="flex flex-col items-center space-y-1 p-x-2 h-16 w-16"
              >
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Add Alert</span>
              </Button>
              {/* <Button variant={`disabled`} className={`w-fit h-fit flex flex-col rounded-full hover-none bg-purple-200`}>
                <Landmark className='h-10 w-10'  />
                <p>Government</p>
              </Button> */}
              <Button
                variant={currentView === 'infra_updates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('infra_updates')}
                className="flex flex-col items-center space-y-1 h-16 w-16"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs m-x-2">Alert Status</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex flex-col items-center hover:bg-red-400/90 space-y-1 p-x-2 h-16 w-16"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-xs">Logout</span>
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;