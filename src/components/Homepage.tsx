import React, { useState } from 'react';
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
import { Link } from '@tanstack/react-router';
import { authClient } from '~/lib/client/auth-client';
import { useQuery } from '@tanstack/react-query';
import { runCompleteAnimation } from './confetti.js';
import { If, Then } from 'react-if';

const codeSnippet = `dfs(root) {
  if (root === null) return;
  dfs(root.left);
  dfs(root.right);
}`;

export default function LandingPage() {
  const [demoTestStarted, setDemoTestStarted] = useState(false);

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
            Create & Master DSA Templates
            <br />
            <span className="text-indigo-600">Through Muscle Memory</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-['Inter']">
            Stop wasting time writing boilerplate. Create your own templates for
            DFS, BFS, DP, and more. Build lightning-fast typing skills and watch
            solutions flow naturally.
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
            <h3 className="text-xl font-semibold mb-2">
              Create Your Templates
            </h3>
            <p className="text-slate-400">
              Customize and practice the algorithmic patterns you want to
              master.
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

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-50 font-['Inter']">
            Experience It Live
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get a feel for the typing experience with our live demo.
          </p>
        </div>

        <div className="rounded-md shadow-2xl shadow-indigo-900/20 mx-auto text-left relative group p-4">
          {!demoTestStarted && (
            <div
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center rounded-md z-20 cursor-pointer"
              onClick={() => setDemoTestStarted(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setDemoTestStarted(true);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="bg-indigo-600 w-20 h-20 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                <Play
                  className="w-10 h-10 text-white"
                  style={{ transform: 'translateX(3px)' }}
                />
              </div>
            </div>
          )}
          <TypingTest
            text={codeSnippet}
            onComplete={() => {
              setDemoTestStarted(false);
              runCompleteAnimation();
            }}
            onFailed={() => {
              setDemoTestStarted(false);
            }}
            onTestStart={() => {}}
            onStateChange={() => {}}
            showOptions={false}
            key={`demo-typing-test-${demoTestStarted}`}
            disableFocus={!demoTestStarted}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-50 font-['Inter']">
              L1 cache for your brain
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Optimize your mental architecture. Cache frequently-used
              algorithms in your fastest memory layer for zero-latency recall
              during interviews.
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
                src="/brain-l1.png"
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
                src="/analytics.png"
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
                    Words per minute for each of your templates
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
                  <span className="text-slate-300">Daily activity heatmap</span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">
                    Daily practice streaks and habits
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <If condition={false}>
        <Then>
          <section className="bg-slate-900 py-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-slate-50 font-['Inter']">
                  Addictive Practice Modes
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                  Gamified experiences that make repetitive practice feel like
                  play.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-950 p-8 rounded-xl">
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Speed Challenges
                  </h3>
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
        </Then>
      </If>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 font-['Inter']">
            Ready to Build Coding Muscle Memory?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/auth"
              className="bg-slate-50 text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-200 transition-colors flex items-center"
            >
              <Keyboard className="w-5 h-5 mr-2" />
              Start for free
            </Link>
          </div>

          {/* <p className="text-indigo-200 text-sm">
            No signup required to start • Create unlimited templates • Track
            your progress
          </p> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Code className="w-8 h-8 text-indigo-400 mr-3" />
            <span className="text-xl font-semibold text-white font-['Inter']">
              CodeDrill
            </span>
          </div>
          <p className="mb-4">
            Making algorithmic interviews more about execution than inspiration.
          </p>
          {/* <p className="text-sm">
            © 2025 TemplateType. Built for developers who believe practice
            makes permanent.
          </p> */}
        </div>
      </footer>
    </div>
  );
}
