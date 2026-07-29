import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { Dumbbell, Lock, Mail, ArrowRight, Sparkles, UserCheck, ChevronDown, ChevronUp, AlertCircle, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onLoginAs: (role: 'trainee' | 'muscle_lover') => void;
  onEmailLogin?: (email: string, pass: string) => Promise<void>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginAs, onEmailLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoBox, setShowDemoBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }

    if (onEmailLogin) {
      setLoading(true);
      setErrorMsg(null);
      try {
        await onEmailLogin(email, password);
        onNavigate('discovery');
      } catch (err: any) {
        console.error('Login error:', err);
        let msg = 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。';
        if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
          msg = 'メールアドレスまたはパスワードが正しくありません。';
        } else if (err?.code === 'auth/invalid-email') {
          msg = '有効なメールアドレスを入力してください。';
        } else if (err?.code === 'auth/too-many-requests') {
          msg = '試行回数が多すぎます。時間をおいて再試行してください。';
        }
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    } else {
      onLoginAs('trainee');
      onNavigate('discovery');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 flex flex-col justify-between max-w-md mx-auto">
      <div>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 p-0.5 shadow-xl shadow-orange-500/20 mx-auto mb-3">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-orange-500" />
            </div>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-wider text-white">WELCOME BACK</h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            MUSCLE MATCH アカウントにログイン
          </p>
        </div>

        {/* Social / OAuth Login Options (Future Expansion Structure) */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => {
              onLoginAs('trainee');
              onNavigate('discovery');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white hover:border-zinc-700 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.7-.5-2.6z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
            </svg>
            <span>Googleでログイン</span>
          </button>

          <button
            onClick={() => {
              onLoginAs('trainee');
              onNavigate('discovery');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white hover:border-zinc-700 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.81 1.13-1.94.99-3.07-1 .04-2.22.67-2.93 1.5-.63.73-1.18 1.89-1.03 3 .12 0 .25.01.37.01 1.09 0 2.22-.61 2.6-1.44z"/>
            </svg>
            <span>Appleでログイン</span>
          </button>

          <button
            onClick={() => {
              onLoginAs('trainee');
              onNavigate('discovery');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#06C755]/10 border border-[#06C755]/30 text-xs font-bold text-[#06C755] hover:bg-[#06C755]/20 transition flex items-center justify-center space-x-2"
          >
            <span className="font-extrabold tracking-wider">LINE</span>
            <span>LINEでログイン</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-mono">
            <span className="bg-zinc-950 px-3 text-zinc-500">またはメールでログイン</span>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Standard Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                placeholder="example@musclematch.jp"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                PASSWORD
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[10px] text-orange-500 hover:underline">
                パスワード再設定
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                placeholder="パスワード"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>ログイン中...</span>
              </>
            ) : (
              <>
                <span>ログイン</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development & Demo Instant Login Drawer (Separated from production UI) */}
        <div className="mt-8 border-t border-zinc-900 pt-4">
          <button
            type="button"
            onClick={() => setShowDemoBox(!showDemoBox)}
            className="w-full flex items-center justify-between text-[11px] text-zinc-500 hover:text-orange-400 font-mono font-bold transition"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" /> 開発者・デモ用クイックログイン
            </span>
            {showDemoBox ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDemoBox && (
            <div className="mt-3 p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 animate-in fade-in duration-200">
              <p className="text-[10px] text-zinc-400 mb-2 font-medium">
                本番環境では非表示化可能なデモ用ログインボタンです。
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoginAs('trainee');
                    onNavigate('discovery');
                  }}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-orange-500 transition"
                >
                  <div className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" /> 男子トレーニー
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">TAKUMI (27)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoginAs('muscle_lover');
                    onNavigate('discovery');
                  }}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-left hover:border-orange-500 transition"
                >
                  <div className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> 筋肉好き女性
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">MISAKI (24)</div>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer Link */}
      <div className="text-center pt-6 border-t border-zinc-900 mt-6">
        <p className="text-xs text-zinc-500">
          まだアカウントをお持ちでない方
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="text-xs font-bold text-orange-500 hover:underline mt-1"
        >
          新規会員登録はこちら →
        </button>
      </div>
    </div>
  );
};
