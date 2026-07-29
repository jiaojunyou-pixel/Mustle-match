import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ShieldAlert, Ban, Flag, CheckCircle2, X } from 'lucide-react';
import { blockUserInFirebase, reportUserInFirebase } from '../../services/firebaseService';

interface BlockReportModalProps {
  currentUser: UserProfile;
  targetUser: UserProfile;
  onClose: () => void;
  onBlocked: () => void;
}

export const BlockReportModal: React.FC<BlockReportModalProps> = ({
  currentUser,
  targetUser,
  onClose,
  onBlocked
}) => {
  const [activeTab, setActiveTab] = useState<'block' | 'report'>('report');
  const [reportReason, setReportReason] = useState('不適切なコンテンツ・画像');
  const [reportDetails, setReportDetails] = useState('');
  const [blockReason, setBlockReason] = useState('関わりたくない');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reportOptions = [
    '不適切なコンテンツ・画像',
    'スパム・営業・勧誘目的',
    '成りすまし・偽アカウント',
    '嫌がらせ・不快な発言',
    'その他'
  ];

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await reportUserInFirebase(currentUser.id, targetUser.id, reportReason, reportDetails);
    setLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleBlock = async () => {
    if (!confirm(`${targetUser.name} さんをブロックしますか？マッチングやメッセージは解除され、お互いに表示されなくなります。`)) {
      return;
    }
    setLoading(true);
    await blockUserInFirebase(currentUser.id, targetUser.id, blockReason);
    setLoading(false);
    onBlocked();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-zinc-100 space-y-4 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2 text-orange-500 font-black italic text-xs uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>SAFETY & REPORT</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white">通報を受け付けました</h3>
            <p className="text-xs text-zinc-400">
              運営チームにて確認のうえ、適切に対処いたします。ご協力ありがとうございます。
            </p>
          </div>
        ) : (
          <>
            {/* Tab Switch */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'report' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>通報する</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('block')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'block' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>ブロックする</span>
              </button>
            </div>

            {/* Target info */}
            <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center space-x-3">
              <img src={targetUser.avatar} alt={targetUser.name} className="w-9 h-9 rounded-full object-cover border border-zinc-800" referrerPolicy="no-referrer" />
              <div>
                <h4 className="font-bold text-xs text-white">{targetUser.name} ({targetUser.age})</h4>
                <p className="text-[10px] text-zinc-400 font-mono">ID: {targetUser.id.substring(0, 10)}...</p>
              </div>
            </div>

            {/* Form tab: Report */}
            {activeTab === 'report' ? (
              <form onSubmit={handleReport} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">通報理由を選択</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-white focus:outline-none focus:border-orange-500"
                  >
                    {reportOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">詳細・状況の説明 (任意)</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                    placeholder="具体的に問題が発生した状況を入力してください..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-400 transition flex items-center justify-center gap-1.5"
                >
                  <Flag className="w-4 h-4" />
                  <span>{loading ? '送信中...' : '通報を送信'}</span>
                </button>
              </form>
            ) : (
              /* Form tab: Block */
              <div className="space-y-3 text-xs">
                <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-[11px]">
                  ブロックすると、{targetUser.name} さんからの検索やメッセージ受信が遮断され、マッチング一覧からも即座に削除されます。
                </p>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">ブロック理由</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-white focus:outline-none focus:border-rose-500"
                    placeholder="理由を入力 (任意)"
                  />
                </div>

                <button
                  onClick={handleBlock}
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-rose-500 transition flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>{loading ? '処理中...' : 'ユーザーをブロックする'}</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
