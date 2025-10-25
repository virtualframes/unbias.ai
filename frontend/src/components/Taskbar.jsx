import React from 'react';

const Taskbar = ({ windows, onOpenWindow, onSelectWindow, activeWindowId }) => {
  const availableApps = [
    { id: 'theories', name: 'Theories', icon: '📚' },
    { id: 'citations', name: 'Citations', icon: '📝' },
    { id: 'assumptions', name: 'Assumptions', icon: '🤔' },
    { id: 'contradictions', name: 'Contradictions', icon: '⚠️' },
    { id: 'provenance', name: 'Provenance', icon: '🔍' },
  ];

  return (
    <div className="taskbar">
      {availableApps.map(app => (
        <button
          key={app.id}
          className={`taskbar-button ${windows.some(w => w.id === app.id) ? 'active' : ''}`}
          onClick={() => {
            const existingWindow = windows.find(w => w.id === app.id);
            if (existingWindow) {
              onSelectWindow(app.id);
            } else {
              onOpenWindow(app);
            }
          }}
        >
          {app.icon} {app.name}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;
