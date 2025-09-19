// client/components/Navbar.jsx
import React from 'react';
import { Button } from './ui/button';

const Navbar = ({ user, setView, currentView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:top-0 md:flex-row flex-col flex items-center justify-between p-4 bg-white shadow-lg md:shadow-none z-50 md:z-auto">
      <div className="flex flex-col md:flex-row items-center md:space-x-4 w-full md:w-auto">
        <h1 className="text-2xl font-bold text-orange-600 mb-2 md:mb-0">ResilienceNet</h1>
        <div className="flex space-x-2 md:space-x-4">
          <Button variant={currentView === 'map' ? 'default' : 'ghost'} onClick={() => setView('map')}>Map</Button>
          <Button variant={currentView === 'community' ? 'default' : 'ghost'} onClick={() => setView('community')}>Community</Button>
          {user?.role === 'citizen' && (
            <>
              <Button variant={currentView === 'my_issues' ? 'default' : 'ghost'} onClick={() => setView('my_issues')}>My Issues</Button>
              <Button variant={currentView === 'report' ? 'default' : 'ghost'} onClick={() => setView('report')}>Report</Button>
            </>
          )}
          {user?.role === 'govt' && (
              <>
                <Button variant={currentView === 'infra' ? 'default' : 'ghost'} onClick={() => setView('infra')}>Add Infra</Button>
              </>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 mt-2 md:mt-0">
          <Button variant="outline" onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Logout
          </Button>
      </div>
    </nav>
  );
};

export default Navbar;