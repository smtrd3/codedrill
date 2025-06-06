/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  KeyboardEvent,
  ComponentType,
} from 'react';
import { Timer, Zap, Repeat, Shuffle, Skull } from 'lucide-react';
import { Character, CharacterProps } from './Character';
import { useInterval } from './hooks/useInterval';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  color: string;
}

type TypingOption =
  | 'power-mode'
  | 'back-to-back'
  | 'randomization'
  | 'instant-death';

export type TestStats = {
  time: number;
  mistakes: number;
  wpm: number;
  accuracy: number;
} & {
  typingOptions: Set<TypingOption>;
};

interface TypingTestProps {
  text: string;
  onComplete: (stats: TestStats) => void;
  width?: string;
  height?: string;
  powerMode?: boolean;
}

const typingOptionsConfig: {
  option: TypingOption;
  Icon: ComponentType<{ size: number }>;
  tooltip: string;
  ariaLabel: string;
}[] = [
  {
    option: 'power-mode',
    Icon: Zap,
    tooltip: 'Enable power mode',
    ariaLabel: 'Toggle Power Mode',
  },
  {
    option: 'back-to-back',
    Icon: Repeat,
    tooltip: 'Enable back to back mode',
    ariaLabel: 'Toggle Back-to-back Mode',
  },
  {
    option: 'randomization',
    Icon: Shuffle,
    tooltip: 'Enable randomization',
    ariaLabel: 'Toggle Randomization',
  },
  {
    option: 'instant-death',
    Icon: Skull,
    tooltip: 'Enable instant death mode',
    ariaLabel: 'Toggle Instant Death Mode',
  },
];

// TypingTest Core Component with Power Mode
export const TypingTest: React.FC<TypingTestProps> = ({
  text,
  onComplete,
  width = '100%',
  height = 'auto',
  powerMode = true,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [enabledOptions, setEnabledOptions] = useState<Set<TypingOption>>(
    () => {
      const initialOptions = new Set<TypingOption>();
      if (powerMode) {
        initialOptions.add('power-mode');
      }
      return initialOptions;
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const totalChars = text.length;

  const focusContainer = useCallback(() => {
    // The main div doesn't receive focus, the inner one does.
    // So we request focus on the interactive div.
    containerRef.current
      ?.querySelector<HTMLDivElement>('#typing-test-container')
      ?.focus();
  }, []);

  // Focus the container on mount to capture key presses
  useEffect(() => {
    focusContainer();
  }, [focusContainer]);

  // Timer logic
  useInterval(() => {
    if (startTime && !isFinished) {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }
  }, 1000);

  // Particle animation loop
  useInterval(() => {
    if (!enabledOptions.has('power-mode')) return;
    setParticles(currentParticles => {
      const updatedParticles = currentParticles.map(p => {
        const newVy = p.vy + 0.1; // gravity
        return {
          ...p,
          x: p.x + p.vx,
          y: p.y + newVy,
          vy: newVy,
          opacity: p.opacity - 0.02,
        };
      });
      return updatedParticles.filter(p => p.opacity > 0);
    });
  }, 16); // ~60fps

  // Function to create particles at the cursor's location
  const triggerParticles = useCallback(() => {
    const interactiveContainer =
      containerRef.current?.querySelector<HTMLDivElement>('[tabindex="0"]');
    if (!cursorRef.current || !interactiveContainer) return;

    const containerRect = interactiveContainer.getBoundingClientRect();
    const cursorRect = cursorRef.current.getBoundingClientRect();

    const newParticles: Particle[] = Array.from({ length: 5 }).map(() => ({
      id: Math.random(),
      x: cursorRect.left - containerRect.left + cursorRect.width / 2 + 30,
      y: cursorRect.top - containerRect.top + cursorRect.height / 2 + 30,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.7) * 6,
      opacity: 1,
      size: Math.random() * 5 + 2,
      // Use the full color spectrum for more vibrant particles
      color: `hsl(${Math.random() * 360}, 90%, 65%)`,
    }));

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const handleOptionToggle = useCallback((option: TypingOption) => {
    setEnabledOptions(prev => {
      const newOptions = new Set(prev);
      if (newOptions.has(option)) {
        newOptions.delete(option);
      } else {
        newOptions.add(option);
      }
      return newOptions;
    });
  }, []);

  // Key press handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (isFinished) return;
      if (
        !startTime &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setStartTime(Date.now());
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        setUserInput(current => current + '  ');
      } else if (e.key === 'Backspace') {
        setUserInput(current => current.slice(0, -1));
      } else if (e.key === 'Enter') {
        setUserInput(current => current + '\n');
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (text[userInput.length] === e.key) {
          if (enabledOptions.has('power-mode')) triggerParticles();
        } else {
          setMistakes(m => m + 1);
        }
        setUserInput(current => current + e.key);
      }
    },
    [isFinished, startTime, text, userInput, enabledOptions, triggerParticles]
  );

  const resetTest = useCallback(() => {
    setUserInput('');
    setMistakes(0);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    focusContainer();
  }, [focusContainer]);

  // Completion check
  useEffect(() => {
    if (userInput.length === totalChars && !isFinished && startTime) {
      setIsFinished(true);
      const finalTime = (Date.now() - startTime) / 1000;
      const words = totalChars / 5;
      const wpm = (words / finalTime) * 60;
      const accuracy = Math.max(
        0,
        ((totalChars - mistakes) / totalChars) * 100
      );

      onComplete({
        time: finalTime,
        mistakes,
        wpm: parseFloat(wpm.toFixed(2)),
        accuracy: parseFloat(accuracy.toFixed(2)),
        typingOptions: enabledOptions,
      });
    }
  }, [
    userInput,
    totalChars,
    isFinished,
    startTime,
    mistakes,
    onComplete,
    enabledOptions,
  ]);

  // Memoize rendered characters for performance
  const characters = useMemo(() => {
    return text.split('').map((char, index) => {
      let state: CharacterProps['state'] = 'pending';
      if (index < userInput.length) {
        state = userInput[index] === text[index] ? 'correct' : 'incorrect';
      }
      const hasCursor = index === userInput.length;
      return (
        <Character
          ref={hasCursor ? cursorRef : null}
          key={`${char}-${index}`}
          char={char}
          state={state}
          hasCursor={hasCursor}
        />
      );
    });
  }, [text, userInput]);

  // Calculate live WPM
  const wpm = useMemo(() => {
    if (!startTime || elapsedTime < 2) return 0;
    const wordsTyped = userInput.length / 5;
    const minutes = elapsedTime / 60;
    return Math.floor(wordsTyped / minutes);
  }, [userInput, elapsedTime, startTime]);

  useEffect(() => {
    resetTest();
  }, [text, resetTest]);

  return (
    <div
      className="p-6 rounded-sm shadow-lg w-full flex flex-col items-center"
      ref={containerRef}
    >
      <div className="w-full h-full relative">
        {enabledOptions.has('power-mode') &&
          particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: 'translate(-50%, -50%)',
                transition: 'opacity 0.5s ease-out',
              }}
            />
          ))}
        <div className="w-full flex justify-between items-center mb-2 text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer size={18} />{' '}
              <span className="font-bold font-code">{elapsedTime}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} />{' '}
              <span className="font-bold font-code">{wpm} WPM</span>
            </div>
          </div>
          <span className="text-sm font-bold font-code">
            {userInput.length} / {totalChars}
          </span>
        </div>
        <div
          id="typing-test-container"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="w-full p-4 bg-slate-900 rounded-sm font-mono tracking-wider leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500 select-none"
          style={{ width, height, cursor: 'text' }}
        >
          <div className="h-full content-start font-code">{characters}</div>
        </div>
        <div className="mt-8 flex w-full justify-center gap-2">
          {typingOptionsConfig.map(({ option, Icon, tooltip, ariaLabel }) => (
            <div
              key={option}
              className="relative group flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => handleOptionToggle(option)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  enabledOptions.has(option)
                    ? 'bg-slate-900 text-cyan-400'
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                }`}
                aria-label={ariaLabel}
              >
                <Icon size={18} />
              </button>
              <div className="pointer-events-none absolute top-full mt-2 w-max rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100 font-code">
                {tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
