import React from 'react';
import './InitAnimation.css';

interface InitAnimationProps {
  onEnter: () => void;
}

export const InitAnimation: React.FC<InitAnimationProps> = ({ onEnter }) => {
  return (
    <div className="init-animation-container">
      <div className="init-animation">
        <div className="logo-container">
          <svg className="git-logo" viewBox="0 0 24 24" width="48" height="48">
            <path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583 2.988 2.988 0 0 1-2.668 1.67h-2.99a4.456 4.456 0 0 0-2.989 1.165V7.4a3.737 3.737 0 1 0-1.494 0v9.117a3.776 3.776 0 1 0 1.816.099 2.99 2.99 0 0 1 2.668-1.667h2.99a4.484 4.484 0 0 0 4.223-3.039 3.736 3.736 0 0 0 3.25-3.687zM4.565 3.738a2.242 2.242 0 1 1 4.484 0 2.242 2.242 0 0 1-4.484 0zm4.484 16.441a2.242 2.242 0 1 1-4.484 0 2.242 2.242 0 0 1 4.484 0zm8.221-9.715a2.242 2.242 0 1 1 0-4.485 2.242 2.242 0 0 1 0 4.485z"/>
          </svg>
        </div>
        <div className="text-container">
          <span className="app-name">YAAC</span>
          <span className="tagline">Your Artistic Aide for Commits</span>
        </div>
        <button 
          className="enter-button"
          onClick={onEnter}
        >
          <i className="codicon codicon-arrow-right" />
          Enter
        </button>
      </div>
    </div>
  );
};
