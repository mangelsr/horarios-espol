import { SchedulerProvider, useScheduler } from './context/SchedulerContext'
import { SearchPanel } from './components/SearchPanel/SearchPanel'
import { SchedulePanel } from './components/SchedulePanel/SchedulePanel'

function AppContent() {
  const { state } = useScheduler()
  const student = state.studentInfo

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-5 flex items-center justify-between shrink-0 z-50">
        <div>
          <h1 className="font-bold text-xl  text-white">{student ? `${student.nombres} ${student.apellidos}` : 'ESPOL'}</h1>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[3%] -mt-0.5">{student ? student.matricula : 'Planificador de Horarios'}</p>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        <aside className="w-[450px] shrink-0 bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800 overflow-hidden flex flex-col">
          <SearchPanel />
        </aside>

        <section className="flex-1 bg-zinc-900 rounded-[2.5rem] p-0 border border-zinc-800 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-10 py-8 border-b border-zinc-800 bg-zinc-800/20">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Mi Semestre</h2>
              <p className="text-zinc-500 font-medium text-sm mt-1 flex items-center gap-2">
                {student?.carrera ? student.carrera : 'Carrera no cargada'} <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> Segundo Ciclo 2024
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-zinc-400 rounded-xl font-bold text-xs hover:bg-zinc-700 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Añadir Materia
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <SchedulePanel />
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <SchedulerProvider>
      <AppContent />
    </SchedulerProvider>
  )
}

export default App
