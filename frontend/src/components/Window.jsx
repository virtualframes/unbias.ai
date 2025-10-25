import React from 'react';
import Draggable from 'react-draggable';

const Window = ({ 
  id, 
  title, 
  children, 
  onClose, 
  onFocus, 
  isActive,
  defaultPosition = { x: 100, y: 100 },
  width = 600,
  height = 400
}) => {
  return (
    <Draggable
      handle=".window-header"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <div 
        className={`window ${isActive ? 'active' : ''}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={() => onFocus(id)}
      >
        <div className="window-header">
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button className="window-control" onClick={(e) => e.stopPropagation()}>
              _
            </button>
            <button className="window-control" onClick={(e) => e.stopPropagation()}>
              □
            </button>
            <button 
              className="window-control close" 
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div className="window-content">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;
