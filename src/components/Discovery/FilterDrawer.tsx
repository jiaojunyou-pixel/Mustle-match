import React, { useState } from 'react';
import { DiscoveryFilter } from '../../types';
import { SlidersHorizontal, X, Trophy } from 'lucide-react';

interface FilterDrawerProps {
  filter: DiscoveryFilter;
  onApplyFilter: (newFilter: DiscoveryFilter) => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filter,
  onApplyFilter,
  onClose
}) => {
  const [localFilter, setLocalFilter] = useState<DiscoveryFilter>({ ...filter });

  const handleApply = () => {
    onApplyFilter(localFilter);
    onClose();
  };

  const handleReset = () => {
    const reset: DiscoveryFilter = {
      roleFilter: 'all',
      minAge: 18,
      maxAge: 45,
      maxDistanceKm: 25,
      minBenchPressKg: 60,
      verifiedOnly: false
    };
    setLocalFilter(reset);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar text-zinc-100">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <h2 className="font-black text-sm uppercase italic text-white">FILTER PREFERENCES</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Form Body */}
        <div className="py-4 space-y-5 text-xs">
          
          {/* Role Filter */}
          <div>
            <label className="block font-bold text-orange-500 uppercase tracking-widest text-[10px] mb-2 font-mono">
              TARGET ROLE
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setLocalFilter({ ...localFilter, roleFilter: 'all' })}
                className={`py-2.5 rounded-2xl border font-bold uppercase text-[11px] transition ${
                  localFilter.roleFilter === 'all'
                    ? 'bg-orange-500 text-zinc-950 border-orange-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                ALL MEMBERS
              </button>
              <button
                onClick={() => setLocalFilter({ ...localFilter, roleFilter: 'trainee' })}
                className={`py-2.5 rounded-2xl border font-bold uppercase text-[11px] transition ${
                  localFilter.roleFilter === 'trainee'
                    ? 'bg-orange-500 text-zinc-950 border-orange-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                TRAINEE 男子
              </button>
              <button
                onClick={() => setLocalFilter({ ...localFilter, roleFilter: 'muscle_lover' })}
                className={`py-2.5 rounded-2xl border font-bold uppercase text-[11px] transition ${
                  localFilter.roleFilter === 'muscle_lover'
                    ? 'bg-orange-500 text-zinc-950 border-orange-500'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                MUSCLE LOVER
              </button>
            </div>
          </div>

          {/* Bench Press MAX Requirement */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5 text-xs">
                <Trophy className="w-4 h-4 text-orange-500" /> BENCH PRESS MAX MIN
              </span>
              <span className="font-mono font-bold text-orange-500">
                {localFilter.minBenchPressKg || 0} kg 以上
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="10"
              value={localFilter.minBenchPressKg || 0}
              onChange={(e) =>
                setLocalFilter({ ...localFilter, minBenchPressKg: Number(e.target.value) })
              }
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1 font-semibold">
              <span>指定なし (0kg)</span>
              <span>100kg+</span>
              <span>150kg+</span>
            </div>
          </div>

          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-bold text-zinc-300">
              <span>年齢範囲</span>
              <span className="font-mono text-orange-500">{localFilter.minAge} 歳 〜 {localFilter.maxAge} 歳</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold">MIN AGE</label>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={localFilter.minAge}
                  onChange={(e) => setLocalFilter({ ...localFilter, minAge: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-center text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase font-bold">MAX AGE</label>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={localFilter.maxAge}
                  onChange={(e) => setLocalFilter({ ...localFilter, maxAge: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-center text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Max Distance */}
          <div>
            <div className="flex justify-between items-center mb-1 font-bold text-zinc-300">
              <span>検索距離</span>
              <span className="font-mono text-orange-500">{localFilter.maxDistanceKm} km 以内</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={localFilter.maxDistanceKm}
              onChange={(e) => setLocalFilter({ ...localFilter, maxDistanceKm: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Verification Check */}
          <div className="pt-2">
            <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilter.verifiedOnly}
                onChange={(e) => setLocalFilter({ ...localFilter, verifiedOnly: e.target.checked })}
                className="rounded border-zinc-800 bg-zinc-950 text-orange-500 focus:ring-orange-500"
              />
              <span>年齢・本人認証済みユーザーのみ</span>
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-zinc-800 flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="w-1/3 py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:text-white transition"
          >
            リセット
          </button>
          <button
            onClick={handleApply}
            className="w-2/3 py-3.5 rounded-2xl bg-orange-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-400 transition"
          >
            条件適用
          </button>
        </div>

      </div>
    </div>
  );
};
