import React from 'react';

export interface CharacterProps {
  char: string;
  state: 'pending' | 'correct' | 'incorrect';
  hasCursor: boolean;
}

// Character Component: Renders each character with improved cursor styling
export const Character = React.memo(
  React.forwardRef<HTMLSpanElement, CharacterProps>(
    ({ char, state, hasCursor }, ref) => {
      const stateClasses = {
        pending: 'text-slate-500',
        correct: 'text-slate-100',
        incorrect: 'text-red-400',
      } as const;

      const isSpace = char === ' ';
      const isNewLine = char === '\n';

      const cursorClass = hasCursor
        ? "relative before:content-[''] before:absolute before:inset-0 before:bg-cyan-400 before:bg-opacity-80 before:rounded-sm before:animate-[cursor-pulse_1.2s_infinite]"
        : '';

      const characterColorClass = hasCursor
        ? 'text-slate-900'
        : stateClasses[state];

      return (
        <span
          ref={ref}
          className={`${cursorClass} transition-colors duration-100 ease-in-out whitespace-break-spaces font-bold`}
          role="presentation"
        >
          <span
            className={`relative z-10 ${characterColorClass} ${isSpace ? 'text-opacity-20' : ''}`}
          >
            {isNewLine ? ' \n' : isSpace ? '.' : char}
          </span>
        </span>
      );
    }
  )
);
