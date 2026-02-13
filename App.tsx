
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Layers, 
  CheckSquare, 
  Clock, 
  Search, 
  Plus, 
  Bell, 
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { 
  User, 
  UserRole, 
  ContentTask, 
  ContentStatus, 
  Priority, 
  Client 
} from './types';
import { 
  MOCK_USERS, 
  MOCK_CLIENTS, 
} from './constants';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { StatCard } from './components/StatCard';
import { TaskModal } from './components/TaskModal';
import { ClientsModule } from './components/ClientsModule';
import { CalendarModule } from './components/CalendarModule';
import { ReportsModule } from './components/ReportsModule';
import { CreateTaskModal } from './components/CreateTaskModal';
import { UsersModule } from './components/UsersModule';
import { CreateUserModal } from './components/CreateUserModal';
import { CreateClientModal } from './components/CreateClientModal';

const INITIAL_TASKS: ContentTask[] = [
  {
    id: 't1',
    clientId: 'c1',
    title: 'Post Instagram: Promoção de Verão',
    briefing: 'Criar arte para carrossel anunciando 30% OFF em smartwatches. Usar paleta vibrante.',
    format: 'Post Carrossel',
    channel: 'Instagram',
    priority: Priority.ALTA,
    status: ContentStatus.EM_PRODUCAO,
    deadline: '2024-06-25',
    assignedTo: 'u2',
    attachments: [],
    links: ['https://drive.google.com/share/ref1'],
    createdAt: '2024-06-15'
  },
  {
    id: 't2',
    clientId: 'c1',
    title: 'Reel: Unboxing Novo Smartphone',
    briefing: 'Roteiro de unboxing rápido destacando a câmera de 100MP.',
    format: 'Reel',
    channel: 'Instagram/TikTok',
    priority: Priority.MEDIA,
    status: ContentStatus.EM_REVISAO,
    deadline: '2024-06-28',
    assignedTo: 'u3',
    attachments: [],
    links: [],
    createdAt: '2024-06-16'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<ContentTask[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS as User[]);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (users.length > 0) {
      setCurrentUser(users[0]);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogout = () => setCurrentUser(null);
  
  const handleUpdateStatus = (taskId: string, newStatus: ContentStatus, comment?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: newStatus, 
          reviewComment: comment || t.reviewComment,
          reviewedBy: (newStatus === ContentStatus.APROVADO || newStatus === ContentStatus.AJUSTES_SOLICITADOS) ? currentUser?.id : t.reviewedBy,
          reviewedAt: (newStatus === ContentStatus.APROVADO || newStatus === ContentStatus.AJUSTES_SOLICITADOS) ? new Date().toISOString() : t.reviewedAt
        };
      }
      return t;
    }));
  };

  const handleSaveNewTask = (taskData: Omit<ContentTask, 'id' | 'createdAt'>) => {
    const newTask: ContentTask = {
      ...taskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...userData, id: editingUser.id } as User : u));
      setEditingUser(null);
    } else {
      const newUser: User = { ...userData, id: `u${Date.now()}` } as User;
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: `c${Date.now()}`
    };
    setClients(prev => [...prev, newClient]);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreateUserModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (currentUser?.role === UserRole.CLIENTE) {
      result = result.filter(t => t.clientId === currentUser.clientId && (t.status === ContentStatus.APROVADO || t.status === ContentStatus.ENTREGUE));
    } else if (currentUser?.role === UserRole.EQUIPE) {
      result = result.filter(t => t.assignedTo === currentUser.id);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(lower) || t.briefing.toLowerCase().includes(lower));
    }
    return result;
  }, [tasks, currentUser, searchTerm]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === ContentStatus.PENDENTE).length,
    inProgress: tasks.filter(t => t.status === ContentStatus.EM_PRODUCAO || t.status === ContentStatus.AJUSTES_SOLICITADOS).length,
    approved: tasks.filter(t => t.status === ContentStatus.APROVADO).length,
    delayed: tasks.filter(t => t.deadline < new Date().toISOString().split('T')[0] && t.status !== ContentStatus.ENTREGUE && t.status !== ContentStatus.APROVADO).length,
  }), [tasks]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Conteúdos Totais" value={stats.total} icon={<Layers className="text-blue-500" />} />
              <StatCard label="Em Produção" value={stats.inProgress} icon={<Clock className="text-amber-500" />} />
              <StatCard label="Aprovados" value={stats.approved} icon={<CheckSquare className="text-emerald-500" />} />
              <StatCard label="Prazos Atrasados" value={stats.delayed} icon={<AlertTriangle className="text-rose-500" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <TrendingUp size={20} className="text-orange-500" />
                    <span>Desempenho da Equipe</span>
                  </h3>
                </div>
                <div className="h-64 flex items-end justify-between space-x-4 px-4">
                  {[45, 78, 52, 90, 65, 82, 48].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition-colors relative" style={{ height: `${val}%` }}></div>
                      <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">S{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
                    <Users size={20} className="text-orange-500" />
                    <span>Clientes Ativos</span>
                  </h3>
                  <div className="space-y-4">
                    {clients.map(client => (
                      <div key={client.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                        <div className="flex items-center space-x-3">
                          <img src={client.logo} className="w-10 h-10 rounded-lg object-cover" />
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{client.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="h-[calc(100vh-180px)] flex flex-col">
            <KanbanBoard tasks={filteredTasks} onTaskClick={setSelectedTask} currentUser={currentUser!} />
          </div>
        );
      case 'clients':
        return <ClientsModule clients={clients} onAddClient={() => setIsCreateClientModalOpen(true)} />;
      case 'team':
        return <UsersModule users={users} onAddUser={() => setIsCreateUserModalOpen(true)} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />;
      case 'calendar':
        return <CalendarModule tasks={tasks} onTaskClick={setSelectedTask} onUpdateStatus={handleUpdateStatus} />;
      case 'reports':
        return <ReportsModule tasks={tasks} />;
      default:
        return null;
    }
  };

  if (!currentUser) return <div className="p-20 text-center dark:text-white">Carregando...</div>;

  const showGlobalCreateTask = currentUser.role === UserRole.ADMIN && (activeTab === 'dashboard' || activeTab === 'tasks');

  const tabLabels: Record<string, string> = {
    dashboard: 'Painel Geral',
    tasks: 'Tarefas de Conteúdo',
    clients: 'Gestão de Clientes',
    team: 'Gestão da Equipe',
    calendar: 'Calendário de Entregas',
    reports: 'Relatórios de Performance'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight transition-colors">{tabLabels[activeTab] || activeTab}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Olá, {currentUser.name}. LVmedia em ação.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-all active:scale-95 shadow-sm"
              title={theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar tarefas..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 w-64 outline-none shadow-sm transition-all" 
              />
            </div>
            {showGlobalCreateTask && (
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all active:scale-95">
                <Plus size={20} />
                <span>Nova Tarefa</span>
              </button>
            )}
          </div>
        </header>
        {renderContent()}
      </main>
      
      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          user={currentUser} 
          onUpdateStatus={(id, status, comment) => {
            handleUpdateStatus(id, status, comment);
            setSelectedTask(null);
          }} 
        />
      )}
      
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleSaveNewTask} 
      />
      
      <CreateUserModal 
        isOpen={isCreateUserModalOpen} 
        onClose={() => {
          setIsCreateUserModalOpen(false);
          setEditingUser(null);
        }} 
        onSave={handleSaveUser} 
        initialData={editingUser} 
      />

      <CreateClientModal
        isOpen={isCreateClientModalOpen}
        onClose={() => setIsCreateClientModalOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default App;
