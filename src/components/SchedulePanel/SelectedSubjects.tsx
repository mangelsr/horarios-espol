import { useMemo } from 'react';
import {
  useScheduler,
  useSelectedParallels,
} from '../../context/SchedulerContext';
import { twMerge } from 'tailwind-merge';

export function SelectedSubjects() {
  const selected = useSelectedParallels();
  const { dispatch } = useScheduler();
  const removeSubject = (parallelIds: string[]) => {
    parallelIds.forEach((id) =>
      dispatch({ type: 'REMOVE_PARALLEL', payload: id }),
    );
  };

  // Group by subject code to keep summary compact
  const grouped = useMemo(() => {
    const map = new Map<string, typeof selected>();
    selected.forEach((p) => {
      if (!map.has(p.subjectCode)) map.set(p.subjectCode, []);
      map.get(p.subjectCode)!.push(p);
    });
    return Array.from(map.values());
  }, [selected]);

  if (selected.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grouped.map((parallels) => {
          const first = parallels[0];
          return (
            <div
              key={first.subjectCode}
              className="bg-zinc-900/50 border-zinc-800 rounded-2xl p-3 flex justify-between relative overflow-hidden group transition-all border"
            >
              <div className="flex gap-2.5">
                <button
                  onClick={() =>
                    removeSubject(parallels.map((item) => item.id))
                  }
                  className="bg-red-500 aspect-square rounded-lg h-full hover:text-white text-[11px] leading-none cursor-pointer"
                  title={`Eliminar ${first.subjectName}`}
                  aria-label={`Eliminar ${first.subjectName}`}
                >
                  <svg
                    className="w-4 h-4 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M18 6L6 18M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">
                    {first.subjectCode}
                  </span>
                  <span className="text-sm font-extrabold text-white leading-tight">
                    {first.subjectName}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-2">
                {parallels.map((p) => (
                  <div
                    key={p.id}
                    className={twMerge(
                      'flex text-xs font-bold items-center gap-2 h-fit px-2 py-1.5 rounded-lg',
                      p.tipoparalelo === 'TEORICO'
                        ? 'bg-emerald-600'
                        : 'bg-blue-600',
                    )}
                  >
                    <span>{p.paralelo}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
