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
import {
  Timer,
  Zap,
  Repeat,
  Skull,
  Dice3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AlertDialog, Badge, BadgeProps, Button, Flex } from '@radix-ui/themes';
import { Character, CharacterProps } from './Character';
import { useInterval } from './hooks/useInterval';
import { TestState } from '~/state';
import { get } from 'lodash-es';

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

export type TypingOption =
  | 'power-mode'
  | 'repeat'
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
  onTestStart?: () => void;
  onFailed?: () => void;
  onStateChange?: (state: TestState) => void;
  width?: string;
  height?: string;
  powerMode?: boolean;
  showOptions?: boolean;
  disableFocus?: boolean;
  typingState?: TestState;
  onPrevious?: () => void;
  onNext?: () => void;
  enabledOptions?: Set<TypingOption>;
  setEnabledOptions?: React.Dispatch<React.SetStateAction<Set<TypingOption>>>;
}

const TEST_STATE_CONFIG: Record<TestState, { color: string; label: string }> = {
  'in-progress': { color: 'green' as const, label: 'RUNNING' },
  complete: { color: 'purple' as const, label: 'COMPLETE' },
  failed: { color: 'red' as const, label: 'FAILED' },
  reset: { color: 'blue' as const, label: 'READY' },
  initial: { color: 'gray' as const, label: 'READY' },
};

const failureMessages = [
  'Are you even trying?',
  'My grandma types faster than you.',
  "I've seen glaciers move with more urgency.",
  'Maybe typing is not for you.',
  'That was... a performance.',
  'Were you typing with your elbows?',
  'I suggest a new hobby. Maybe knitting?',
  "A for effort... just kidding, it's an F.",
];

const AVERAGE_WORD_LENGTH = 10;
const MAX_TEST_TIME = 600; // 10 minutes

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
    option: 'repeat',
    Icon: Repeat,
    tooltip: 'Repeat the same template',
    ariaLabel: 'Repeat the same template',
  },
  {
    option: 'randomization',
    Icon: Dice3,
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
  onTestStart,
  onFailed,
  width = '100%',
  height = 'auto',
  onStateChange,
  showOptions = true,
  disableFocus = false,
  typingState = 'initial',
  onPrevious,
  onNext,
  enabledOptions = new Set<TypingOption>(),
  setEnabledOptions,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [particles, setParticles] = useState<Particle[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const totalChars = text.length;

  const focusContainer = useCallback(() => {
    if (disableFocus) return;
    containerRef.current
      ?.querySelector<HTMLDivElement>('#typing-test-container')
      ?.focus();
  }, [disableFocus]);

  // Focus the container on mount to capture key presses
  useEffect(() => {
    focusContainer();
  }, [focusContainer, disableFocus]);

  const failTest = useCallback(() => {
    setIsFailed(true);
    const randomMessage =
      failureMessages[Math.floor(Math.random() * failureMessages.length)];
    setFailureMessage(randomMessage);
    onFailed?.();
  }, [onFailed]);

  // Timer logic
  useInterval(() => {
    if (startTime && !isFinished && !isFailed) {
      const currentElapsedTime = Math.floor((Date.now() - startTime) / 1000);
      if (currentElapsedTime >= MAX_TEST_TIME) {
        failTest();
      } else {
        setElapsedTime(currentElapsedTime);
      }
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
  }, 8); // ~60fps

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
    setEnabledOptions?.(prev => {
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
      if (isFinished || isFailed) {
        return;
      }
      if (
        !startTime &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setStartTime(Date.now());
        onTestStart?.();
      }
      if (e.key === ' ') {
        e.preventDefault();
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
          if (enabledOptions.has('instant-death')) {
            failTest();
            return;
          }
        }
        setUserInput(current => current + e.key);
      }
    },
    [
      isFinished,
      isFailed,
      startTime,
      text,
      userInput,
      enabledOptions,
      triggerParticles,
      onTestStart,
      failTest,
    ]
  );

  const resetTest = useCallback(() => {
    setUserInput('');
    setMistakes(0);
    setIsFinished(false);
    setIsFailed(false);
    setFailureMessage('');
    setStartTime(null);
    setElapsedTime(0);
    setTimeout(() => {
      focusContainer();
    }, 100);
    onStateChange?.('reset');
  }, [focusContainer, onStateChange]);

  // Completion check
  useEffect(() => {
    if (userInput.length >= totalChars && !isFinished && startTime) {
      setIsFinished(true);
      const finalTime = (Date.now() - startTime) / 1000;
      const words = totalChars / AVERAGE_WORD_LENGTH;
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
    if (!startTime) return 0;
    const wordsTyped = userInput.length / AVERAGE_WORD_LENGTH;
    const minutes = elapsedTime / 60;
    return Math.floor(wordsTyped / (minutes === 0 ? 1 : minutes));
  }, [userInput, elapsedTime, startTime]);

  useEffect(() => {
    resetTest();
  }, [text, resetTest]);

  return (
    <div className="w-full flex flex-col items-center" ref={containerRef}>
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
                zIndex: 1000,
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
          <div className="flex items-center gap-2">
            {(() => {
              const state = get(TEST_STATE_CONFIG, typingState, {
                color: 'gray',
                label: 'READY',
              });
              return (
                <Badge
                  color={state.color as BadgeProps['color']}
                  variant="soft"
                >
                  <span className="font-bold">{state.label}</span>
                </Badge>
              );
            })()}
            <span className="text-sm font-bold font-code">
              {userInput.length} / {totalChars}
            </span>
          </div>
        </div>
        <div
          id="typing-test-container"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative w-full p-4 bg-slate-900 rounded-md font-mono tracking-wider leading-relaxed outline-none focus:ring-0 focus:ring-cyan-500 select-none"
          style={{ width, height, cursor: 'text' }}
        >
          <div className="h-full content-start font-code">{characters}</div>
        </div>
        {showOptions && (
          <div className="flex justify-between items-center px-4 py-2">
            <Button
              variant="ghost"
              color="gray"
              size={'4'}
              style={{ cursor: 'pointer' }}
              radius="small"
              onClick={onPrevious}
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex w-full justify-center gap-2">
              {typingOptionsConfig.map(
                ({ option, Icon, tooltip, ariaLabel }) => (
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
                )
              )}
            </div>

            <Button
              variant="ghost"
              color="gray"
              size={'4'}
              style={{ cursor: 'pointer' }}
              radius="small"
              onClick={onNext}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog.Root
        open={isFailed}
        onOpenChange={open => !open && resetTest()}
      >
        <AlertDialog.Content style={{ maxWidth: 450 }} className="font-sans">
          <AlertDialog.Title>Test Failed!</AlertDialog.Title>
          <AlertDialog.Description size="2" className="font-sans">
            {failureMessage}
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="cyan"
                onClick={resetTest}
                className="font-sans"
              >
                <RefreshCw size={16} /> Restart
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};
