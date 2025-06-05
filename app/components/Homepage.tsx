import React from 'react';
import {
  Code,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Brain,
  Trophy,
  Play,
  ArrowRight,
  BarChart3,
  Keyboard,
  CheckCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="flex justify-end p-6">
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Pattern Recognition Over Problem Solving
          </div>
          <h1 className="text-6xl font-bold mb-6 text-slate-900 font-['Inter']">
            Master DSA Templates
            <br />
            <span className="text-indigo-600">Through Muscle Memory</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-['Inter']">
            Stop wasting time thinking during interviews. Build lightning-fast
            typing skills for DFS, BFS, DP, and 50+ other algorithmic patterns.
            When templates are in your fingers, solutions flow naturally.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-16">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Start Typing Now
          </button>
          {/* <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-slate-400 transition-colors">
            View Templates
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">50+ Templates</h3>
            <p className="text-slate-600">
              DFS, BFS, Sliding Window, Two Pointers, and more
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Precision Focus</h3>
            <p className="text-slate-600">
              No distractions, just pure pattern memorization
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-slate-600">
              Analytics that keep you motivated and improving
            </p>
          </div>
        </div>

        <img
          src="https://placehold.co/800x500/e2e8f0/64748b?text=App+Preview"
          alt="App Preview"
          className="rounded-2xl shadow-2xl mx-auto"
        />
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 font-['Inter']">
              Why Memorization Wins
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              In the heat of an interview, thinking is slow. Muscle memory is
              instant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                    <Brain className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Instant Pattern Recognition
                    </h3>
                    <p className="text-slate-600">
                      Your fingers know the template before your brain finishes
                      reading the problem. That's the advantage of muscle
                      memory.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Save Mental Energy
                    </h3>
                    <p className="text-slate-600">
                      Stop burning cognitive load on syntax and structure. Focus
                      that brainpower on the unique aspects of each problem.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Interview Confidence
                    </h3>
                    <p className="text-slate-600">
                      When templates flow from your fingers automatically, you
                      project competence and stay calm under pressure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://placehold.co/500x400/f1f5f9/64748b?text=Typing+Practice"
                alt="Typing Practice Interface"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="bg-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://placehold.co/600x400/e2e8f0/64748b?text=Analytics+Dashboard"
                alt="Analytics Dashboard"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900 font-['Inter']">
                Track Every Keystroke
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Detailed analytics show exactly where you're improving and which
                templates need more practice.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">
                    Words per minute for each template
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">
                    Time spent practicing each pattern
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">
                    Accuracy trends over time
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">
                    Daily practice streaks and habits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 font-['Inter']">
              Addictive Practice Modes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Gamified experiences that make repetitive practice feel like play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Speed Challenges</h3>
              <p className="text-slate-600 mb-4">
                Race against the clock to type templates faster each day.
              </p>
              <img
                src="https://placehold.co/300x150/f8fafc/64748b?text=Speed+Mode"
                alt="Speed Challenge"
                className="rounded-lg w-full"
              />
            </div>

            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accuracy Focus</h3>
              <p className="text-slate-600 mb-4">
                Perfect your templates with zero-error challenges.
              </p>
              <img
                src="https://placehold.co/300x150/f8fafc/64748b?text=Accuracy+Mode"
                alt="Accuracy Mode"
                className="rounded-lg w-full"
              />
            </div>

            <div className="bg-slate-50 p-8 rounded-xl">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pattern Mix</h3>
              <p className="text-slate-600 mb-4">
                Random template combinations keep you sharp.
              </p>
              <img
                src="https://placehold.co/300x150/f8fafc/64748b?text=Mix+Mode"
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
            Join thousands of developers who've turned algorithmic thinking into
            automatic typing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center">
              <Keyboard className="w-5 h-5 mr-2" />
              Start for free
            </button>
            {/* <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-colors flex items-center">
              View All Templates
              <ArrowRight className="w-5 h-5 ml-2" />
            </button> */}
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
    </div>
  );
}
