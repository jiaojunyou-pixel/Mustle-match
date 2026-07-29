import React, { useState } from 'react';
import { AppScreen, UserRole, Gender } from '../../types';
import { Dumbbell, Heart, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';

interface SignUpScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSignUpComplete: (role: UserRole) => void;
  onSignUpWithEmail?: (email: string, pass: string, role: UserRole, name: string, gender: Gender) => Promise<void>;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigate, onSignUpComplete, onSignUpWithEmail }) => {
  const [role, setRole] = useState<UserRole>('trainee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('ニックネームを入力してください。');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('メールアドレスを入力してください。');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('パスワードは6文字以上で入力してください。');
      return;
    }

    if (onSignUpWithEmail) {
      setLoading(true);
      setErrorMsg(null);
      try {
        await onSignUpWithEmail(email, password, role, name, gender);
        onNavigate('profile_creation');
      } catch (err: any) {
        console.error('Signup error:', err);
        let msg = 'アカウント登録に失敗しました。入力内容を確認してください。';
        if (err?.code === 'auth/email-already-in-use') {
          msg = 'このメールアドレスは既に登録されています。ログインをお試しください。';
        } else if (err?.code === 'auth/invalid-email') {
          msg = '有効なメールアドレス形式を入力してください。';
        } else if (err?.code === 'auth/weak-password') {
          msg = 'パスワードが弱すぎます。6文字以上の英数字を入力してください。';
        }
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    } else {
      onSignUpComplete(role);
      onNavigate('profile_creation');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black italic uppercase tracking-wider text-white">SIGN UP</h1>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          MUSCLE MATCH へようこそ！スタンスを選択してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Role Selector */}
        <div>
          <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 font-mono">
            STEP 1. YOUR ROLE
          </label>

          <div className="grid grid-cols-2 gap-3">
            
            {/* Option 1: Trainee */}
            <button
              type="button"
              onClick={() => {
                setRole('trainee');
                setGender('male');
              }}
              className={`p-4 rounded-3xl text-left border transition relative ${
                role === 'trainee'
                  ? 'bg-zinc-900 border-orange-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              {role === 'trainee' && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-orange-500 text-zinc-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-8 h-8 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-2">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-white">筋肉を磨く人</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                筋トレ男子・トレーニー
              </p>
            </button>

            {/* Option 2: Muscle Lover */}
            <button
              type="button"
              onClick={() => {
                setRole('muscle_lover');
                setGender('female');
              }}
              className={`p-4 rounded-3xl text-left border transition relative ${
                role === 'muscle_lover'
                  ? 'bg-zinc-900 border-orange-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              {role === 'muscle_lover' && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-orange-500 text-zinc-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="w-8 h-8 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center mb-2">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-white">筋肉を愛する人</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                筋肉好き・ボディメイクファン
              </p>
            </button>

          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3 pt-2">
          
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
              NICKNAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'trainee' ? '例: TAKUMI' : '例: MISAKI'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
              GENDER
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 text-xs rounded-2xl border font-bold ${
                  gender === 'male'
                    ? 'bg-orange-500 text-zinc-950 border-orange-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                男性
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 text-xs rounded-2xl border font-bold ${
                  gender === 'female'
                    ? 'bg-orange-500 text-zinc-950 border-orange-500'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                女性
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@musclematch.jp"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上の英数字"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Terms */}
        <div className="pt-2">
          <label className="flex items-start space-x-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-zinc-800 bg-zinc-900 text-orange-500 focus:ring-orange-500"
              required
            />
            <span>
              18歳以上であり、<a href="#terms" onClick={(e) => e.preventDefault()} className="text-orange-500 underline">利用規約</a> および <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-orange-500 underline">プライバシーポリシー</a> に同意します。
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>アカウント作成中...</span>
            </>
          ) : (
            <>
              <span>プロフィール作成へ進む</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Login redirect */}
      <div className="text-center pt-6 border-t border-zinc-900 mt-6">
        <p className="text-xs text-zinc-500">
          すでにアカウントをお持ちの場合
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-orange-500 hover:underline mt-1"
        >
          ログイン画面へはこちら →
        </button>
      </div>

    </div>
  );
};
