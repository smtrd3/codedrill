import React, { useCallback, useMemo, useState } from 'react';
import {
  Code,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Brain,
  Trophy,
  Play,
  BarChart3,
  Keyboard,
  CheckCircle,
} from 'lucide-react';
import { TypingTest } from './TypingTest/TypingTest';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import { authClient } from '~/lib/client/auth-client';
import { useQuery } from '@tanstack/react-query';

const codeSnippet = `dfs(root) {
  if (root === null) return;
  dfs(root.left);
  dfs(root.right);
}`;

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const onToggleModal = useCallback(() => {
    setModalOpen(prev => !prev);
  }, []);

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const data = await authClient.getSession();
      return data.data;
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="flex justify-end p-6">
        <Link
          to={session ? '/app' : '/auth'}
          className="bg-indigo-600 text-white px-4 py-1 rounded-md font-sans text-sm hover:bg-indigo-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : session ? 'Start Typing' : 'Sign In'}
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Pattern Recognition Over Problem Solving
          </div>
          <h1 className="text-6xl font-bold mb-6 text-slate-50 font-['Inter']">
            Master DSA Templates
            <br />
            <span className="text-indigo-600">Through Muscle Memory</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-['Inter']">
            Stop wasting time thinking during interviews. Build lightning-fast
            typing skills for DFS, BFS, DP, and 50+ other algorithmic patterns.
            When templates are in your fingers, solutions flow naturally.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-16">
          <Link
            to="/app"
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Typing Now
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="bg-indigo-500/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">50+ Templates</h3>
            <p className="text-slate-400">
              DFS, BFS, Sliding Window, Two Pointers, and more
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-500/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Precision Focus</h3>
            <p className="text-slate-400">
              No distractions, just pure pattern memorization
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-500/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-slate-400">
              Analytics that keep you motivated and improving
            </p>
          </div>
        </div>

        <div className="rounded-2xl shadow-2xl shadow-indigo-900/20 mx-auto text-left">
          <TypingTest
            text={codeSnippet}
            onComplete={() => {
              onToggleModal();
            }}
            onTestStart={() => {}}
            onStateChange={() => {}}
            showOptions={false}
            key={modalOpen ? 'modal-open' : 'modal-closed'}
            disableFocus={true}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-50 font-['Inter']">
              Why Memorization Wins
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              In the heat of an interview, thinking is slow. Muscle memory is
              instant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-lg flex-shrink-0">
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Instant Pattern Recognition
                    </h3>
                    <p className="text-slate-400">
                      Your fingers know the template before your brain finishes
                      reading the problem. That&apos;s the advantage of muscle
                      memory.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Save Mental Energy
                    </h3>
                    <p className="text-slate-400">
                      Stop burning cognitive load on syntax and structure. Focus
                      that brainpower on the unique aspects of each problem.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-lg flex-shrink-0">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Interview Confidence
                    </h3>
                    <p className="text-slate-400">
                      When templates flow from your fingers automatically, you
                      project competence and stay calm under pressure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://placehold.co/500x400/1e293b/94a3b8?text=Typing+Practice"
                alt="Typing Practice Interface"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://placehold.co/600x400/0f172a/94a3b8?text=Analytics+Dashboard"
                alt="Analytics Dashboard"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-50 font-['Inter']">
                Track Every Keystroke
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Detailed analytics show exactly where you&apos;re improving and
                which templates need more practice.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">
                    Words per minute for each template
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">
                    Time spent practicing each pattern
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">
                    Accuracy trends over time
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">
                    Daily practice streaks and habits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-50 font-['Inter']">
              Addictive Practice Modes
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Gamified experiences that make repetitive practice feel like play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950 p-8 rounded-xl">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Speed Challenges</h3>
              <p className="text-slate-400 mb-4">
                Race against the clock to type templates faster each day.
              </p>
              <img
                src="https://placehold.co/300x150/1e293b/94a3b8?text=Speed+Mode"
                alt="Speed Challenge"
                className="rounded-lg w-full"
              />
            </div>

            <div className="bg-slate-950 p-8 rounded-xl">
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accuracy Focus</h3>
              <p className="text-slate-400 mb-4">
                Perfect your templates with zero-error challenges.
              </p>
              <img
                src="https://placehold.co/300x150/1e293b/94a3b8?text=Accuracy+Mode"
                alt="Accuracy Mode"
                className="rounded-lg w-full"
              />
            </div>

            <div className="bg-slate-950 p-8 rounded-xl">
              <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pattern Mix</h3>
              <p className="text-slate-400 mb-4">
                Random template combinations keep you sharp.
              </p>
              <img
                src="https://placehold.co/300x150/1e293b/94a3b8?text=Mix+Mode"
                alt="Pattern Mix"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 font-['Inter']">
            Ready to Build Coding Muscle Memory?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of developers who&apos;ve turned algorithmic thinking
            into automatic typing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/auth"
              className="bg-slate-50 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-200 transition-colors flex items-center"
            >
              <Keyboard className="w-5 h-5 mr-2" />
              Start for free
            </Link>
          </div>

          <p className="text-indigo-200 text-sm">
            No signup required to start • 50+ templates included • Track your
            progress
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Code className="w-8 h-8 text-indigo-400 mr-3" />
            <span className="text-xl font-semibold text-white font-['Inter']">
              Code drills
            </span>
          </div>
          <p className="mb-4">
            Making algorithmic interviews more about execution than inspiration.
          </p>
          <p className="text-sm">
            © 2025 TemplateType. Built for developers who believe practice
            makes permanent.
          </p>
        </div>
      </footer>
      <AlertDialog.Root open={modalOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Test completed!</AlertDialog.Title>
          <AlertDialog.Description size="2">
            You&apos;ve completed the test.
          </AlertDialog.Description>
          <Flex justify="end" pt="4">
            <AlertDialog.Action>
              <Button
                variant="soft"
                color="indigo"
                onClick={onToggleModal}
                className="min-w-12"
              >
                Ok
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
