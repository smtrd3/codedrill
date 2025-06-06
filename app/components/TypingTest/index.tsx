import React, { useState, useCallback } from 'react';
import { TypingTest } from './TypingTest';
import type { TestStats } from './TypingTest';

export default function TypingPadNew() {
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [testKey, setTestKey] = useState(0);

  const sampleText = `function() {
  return 1;
}
`;

  const handleTestComplete = useCallback((stats: TestStats) => {
    setTestStats(stats);
    handleRestart();
  }, []);

  const handleRestart = () => {
    setTestStats(null);
    setTestKey(prevKey => prevKey + 1);
  };

  return (
    <TypingTest
      key={testKey}
      text={sampleText}
      onComplete={handleTestComplete}
      width="100%"
      height="auto"
      powerMode={true}
    />
  );
}
