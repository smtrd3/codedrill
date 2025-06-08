import React, { useState, FormEvent } from 'react';
import {
  IconShield,
  IconUser,
  IconLock,
  IconMail,
  IconArrowLeft,
  EyeOpen,
  EyeClose,
} from './icons';
import { If, Then, Else } from 'react-if';

export type AuthComponentMode =
  | 'login'
  | 'register'
  | 'forgot'
  | '2fa'
  | 'verifyEmail';
export type SocialProvider = 'google' | 'github';

interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minStrengthScore: number;
}

interface AuthComponentProps {
  initialMode?: AuthComponentMode;
  enable2FA?: boolean;
  enableEmailVerification?: boolean;
  onLogin?: (
    email: string,
    password: string
  ) => Promise<{ require2FA?: boolean }>;
  onRegister?: (email: string, password: string) => Promise<void>;
  onSocialLogin?: (provider: SocialProvider) => Promise<void>;
  onForgotPassword?: (email: string) => Promise<void>;
  on2FAVerify?: (code: string) => Promise<void>;
  passwordRules?: PasswordRules;
}

interface FormData {
  email: string;
  password: string;
  forgotEmail: string;
  twoFACode: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  forgotEmail?: string;
  twoFACode?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export function AuthComponent({
  initialMode = 'login',
  enable2FA = false,
  onLogin = async () => ({}),
  onRegister = async () => {},
  onSocialLogin = async () => {},
  onForgotPassword = async () => {},
  on2FAVerify = async () => {},
  passwordRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    minStrengthScore: 3,
  },
  enableEmailVerification = true,
}: AuthComponentProps) {
  const [mode, setMode] = useState<AuthComponentMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    forgotEmail: '',
    twoFACode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= passwordRules.minLength) {
      score += 1;
    } else {
      feedback.push(`At least ${passwordRules.minLength} characters`);
    }

    if (passwordRules.requireUppercase && /[A-Z]/.test(password)) {
      score += 1;
    } else if (passwordRules.requireUppercase) {
      feedback.push('One uppercase letter');
    }

    if (passwordRules.requireLowercase && /[a-z]/.test(password)) {
      score += 1;
    } else if (passwordRules.requireLowercase) {
      feedback.push('One lowercase letter');
    }

    if (passwordRules.requireNumbers && /\d/.test(password)) {
      score += 1;
    } else if (passwordRules.requireNumbers) {
      feedback.push('One number');
    }

    if (
      passwordRules.requireSpecialChars &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      score += 1;
    } else if (passwordRules.requireSpecialChars) {
      feedback.push('One special character');
    }

    return { score, feedback };
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Calculate password strength in real-time
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'login') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength.score < passwordRules.minStrengthScore) {
        newErrors.password = 'Password is not strong enough';
      }
    } else if (mode === 'forgot') {
      if (!formData.forgotEmail) {
        newErrors.forgotEmail = 'Email is required';
      } else if (!validateEmail(formData.forgotEmail)) {
        newErrors.forgotEmail = 'Please enter a valid email';
      }
    } else if (mode === '2fa') {
      if (!formData.twoFACode) {
        newErrors.twoFACode = 'Verification code is required';
      } else if (formData.twoFACode.length !== 6) {
        newErrors.twoFACode = 'Code must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await onLogin(formData.email, formData.password);
        if (enable2FA && result?.require2FA) {
          setMode('2fa');
        }
      } else if (mode === 'register') {
        await onRegister(formData.email, formData.password);
        if (enableEmailVerification) {
          setMode('verifyEmail');
        }
      } else if (mode === 'forgot') {
        await onForgotPassword(formData.forgotEmail);
        setMode('login');
      } else if (mode === '2fa') {
        await on2FAVerify(formData.twoFACode);
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleSocialLogin = async (provider: SocialProvider): Promise<void> => {
    try {
      setIsLoading(true);
      await onSocialLogin(provider);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Social login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getStrengthColor = (score: number): string => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number): string => {
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Good';
    if (score <= 4) return 'Strong';
    return 'Very Strong';
  };

  const getTitleText = () => {
    switch (mode) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Create Account';
      case 'forgot':
        return 'Reset Password';
      case '2fa':
        return 'Two-Factor Authentication';
      case 'verifyEmail':
        return 'Check Your Email';
      default:
        return '';
    }
  };

  const getSubtitleText = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your account to continue';
      case 'register':
        return 'Create a new account to get started';
      case 'forgot':
        return 'Enter your email to receive reset instructions';
      case '2fa':
        return 'Enter the 6-digit code from your authenticator app';
      case 'verifyEmail':
        return "We've sent a verification link to your email. Please check your inbox to continue.";
      default:
        return '';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'forgot':
        return 'Send Reset Link';
      case '2fa':
        return 'Verify Code';
      case 'verifyEmail':
        return 'Continue';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <If condition={mode === '2fa' || mode === 'verifyEmail'}>
            <Then>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                {mode === 'verifyEmail' ? IconMail : IconShield}
              </div>
            </Then>
          </If>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-sans">
            {getTitleText()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {getSubtitleText()}
          </p>
        </div>

        <If condition={mode === 'verifyEmail'}>
          <Then />
          <Else>
            {/* Error Message */}
            <If condition={!!errors.general}>
              <Then>
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {errors.general}
                </div>
              </Then>
            </If>

            {/* Social Login */}
            <If condition={mode === 'login'}>
              <Then>
                <div className="mb-8">
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-sans"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium dark:text-white">
                        Google
                      </span>
                    </button>
                    {/* <button
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-sans"
                    >
                      <svg
                        className="w-5 h-5 mr-2 dark:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm font-medium dark:text-white">
                        GitHub
                      </span>
                    </button> */}
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-sans">
                        or continue with email
                      </span>
                    </div>
                  </div>
                </div>
              </Then>
            </If>

            {/* Form */}
            <div className="space-y-6">
              <If condition={mode === 'login' || mode === 'register'}>
                <Then>
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
                    >
                      Email
                    </label>
                    <div className="relative">
                      {IconUser}
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none font-sans ${
                          errors.email
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } dark:text-white dark:placeholder-gray-400`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
                    >
                      Password
                    </label>
                    <div className="relative">
                      {IconLock}
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e =>
                          handleInputChange('password', e.target.value)
                        }
                        className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none font-sans ${
                          errors.password
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } dark:text-white dark:placeholder-gray-400`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? EyeClose : EyeOpen}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <If condition={mode === 'register' && formData.password}>
                      <Then>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Password strength:
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                passwordStrength.score >=
                                passwordRules.minStrengthScore
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {getStrengthText(passwordStrength.score)}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(level => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full ${
                                  level <= passwordStrength.score
                                    ? getStrengthColor(passwordStrength.score)
                                    : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          {passwordStrength.feedback.length > 0 && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-sans">
                              Missing: {passwordStrength.feedback.join(', ')}
                            </p>
                          )}
                        </div>
                      </Then>
                    </If>

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-sans">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </Then>
              </If>

              <If condition={mode === 'forgot'}>
                <Then>
                  <div>
                    <label
                      htmlFor="forgotEmail"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
                    >
                      Email
                    </label>
                    <div className="relative">
                      {IconMail}
                      <input
                        id="forgotEmail"
                        type="email"
                        value={formData.forgotEmail}
                        onChange={e =>
                          handleInputChange('forgotEmail', e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-sans ${
                          errors.forgotEmail
                            ? 'border-red-500 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        } dark:text-white dark:placeholder-gray-400`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.forgotEmail && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 font-sans">
                        {errors.forgotEmail}
                      </p>
                    )}
                  </div>
                </Then>
              </If>

              <If condition={mode === '2fa'}>
                <Then>
                  <div>
                    <label
                      htmlFor="twoFACode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans"
                    >
                      Verification Code
                    </label>
                    <input
                      id="twoFACode"
                      type="text"
                      value={formData.twoFACode}
                      onChange={e =>
                        handleInputChange(
                          'twoFACode',
                          e.target.value.replace(/\D/g, '').slice(0, 6)
                        )
                      }
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-2xl tracking-widest font-sans ${
                        errors.twoFACode
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } dark:text-white dark:placeholder-gray-400`}
                      placeholder="000000"
                      maxLength={6}
                    />
                    {errors.twoFACode && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.twoFACode}
                      </p>
                    )}
                  </div>
                </Then>
              </If>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (mode === 'register' &&
                  passwordStrength.score < passwordRules.minStrengthScore)
              }
              className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                getButtonText()
              )}
            </button>
          </Else>
        </If>

        {/* Navigation Links */}
        <div className="flex flex-col m-4 space-y-3 text-center">
          <If condition={mode === 'login'}>
            <Then>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Don&apos;t have an account? Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Forgot your password?
              </button>
            </Then>
          </If>

          <If condition={mode === 'register'}>
            <Then>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-sans"
              >
                {IconArrowLeft} Already have an account? Sign in
              </button>
            </Then>
          </If>

          <If
            condition={
              mode === 'forgot' || mode === '2fa' || mode === 'verifyEmail'
            }
          >
            <Then>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-sans"
              >
                {IconArrowLeft} Back to login
              </button>
            </Then>
          </If>
        </div>
      </div>
    </div>
  );
}
