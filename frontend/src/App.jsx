import React, { useState } from 'react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import TheoriesWindow from './components/TheoriesWindow';
import CitationsWindow from './components/CitationsWindow';
import AssumptionsWindow from './components/AssumptionsWindow';
import ContradictionsWindow from './components/ContradictionsWindow';
import ProvenanceWindow from './components/ProvenanceWindow';
import './styles/App.css';

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  const openWindow = (app) => {
    if (windows.some(w => w.id === app.id)) {
      setActiveWindowId(app.id);
      return;
    }

    const newWindow = {
      id: app.id,
      title: app.name,
      component: app.id,
      position: {
        x: 100 + windows.length * 30,
        y: 100 + windows.length * 30
      }
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(app.id);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const focusWindow = (id) => {
    setActiveWindowId(id);
  };

  const getWindowComponent = (componentId) => {
    const components = {
      theories: <TheoriesWindow />,
      citations: <CitationsWindow />,
      assumptions: <AssumptionsWindow />,
      contradictions: <ContradictionsWindow />,
      provenance: <ProvenanceWindow />,
    };
    return components[componentId] || <div>Unknown component</div>;
  };

  return (
    <div className="app">
      <div className="desktop">
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 0,
          opacity: 0.3
        }}>
          <pre style={{ fontSize: '10px', lineHeight: '1.2' }}>
{`
 ██╗   ██╗███╗   ██╗██████╗ ██╗ █████╗ ███████╗   █████╗ ██╗
 ██║   ██║████╗  ██║██╔══██╗██║██╔══██╗██╔════╝  ██╔══██╗██║
 ██║   ██║██╔██╗ ██║██████╔╝██║███████║███████╗  ███████║██║
 ██║   ██║██║╚██╗██║██╔══██╗██║██╔══██║╚════██║  ██╔══██║██║
 ╚██████╔╝██║ ╚████║██████╔╝██║██║  ██║███████║██╗██║  ██║██║
  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝
  
        RESEARCH PLATFORM v1.0.0 | THEORY VALIDATION SYSTEM
`}
          </pre>
        </div>

        {windows.map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            defaultPosition={window.position}
            onClose={closeWindow}
            onFocus={focusWindow}
            isActive={activeWindowId === window.id}
          >
            {getWindowComponent(window.component)}
          </Window>
        ))}

        {windows.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: 0.5
          }}>
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>
              WELCOME TO UNBIAS.AI
            </p>
            <p style={{ fontSize: '12px' }}>
              SELECT A MODULE FROM THE TASKBAR TO BEGIN
            </p>
          </div>
        )}
      </div>

      <Taskbar
        windows={windows}
        onOpenWindow={openWindow}
        onSelectWindow={focusWindow}
        activeWindowId={activeWindowId}
      />
    </div>
  );
}

export default App;
