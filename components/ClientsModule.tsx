
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, ExternalLink, Mail, Phone, Building2 } from 'lucide-react';
import { Client } from '../types';

interface ClientsModuleProps {
  clients: Client[];
  onAddClient: () => void;
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ clients, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProjects = (clientName: string) => {
    alert(`Visualizando projetos detalhados de: ${clientName}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar clientes por nome ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm transition-all"
          />
        </div>
        <button 
          onClick={onAddClient}
          className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden animate-in zoom-in-95">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                  <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
                </div>
                <button className="text-slate-300 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-tight mb-1">{client.name}</h3>
              <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
                <Building2 size={12} />
                <span>{client.sector}</span>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center space-x-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Mail size={16} className="text-slate-300 dark:text-slate-700" />
                  <span>contato@{client.name.toLowerCase().replace(/\s/g, '')}.com</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <Phone size={16} className="text-slate-300 dark:text-slate-700" />
                  <span>(11) 98765-4321</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 transition-colors">
              <span className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${client.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700 shadow-none'} shadow-sm shadow-emerald-500/20`}></span>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {client.active ? 'Ativo' : 'Inativo'}
                </span>
              </span>
              <button 
                onClick={() => handleViewProjects(client.name)}
                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-colors"
              >
                <span>Projetos</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
               <Building2 size={32} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Nenhum cliente</p>
          </div>
        )}
      </div>
    </div>
  );
};
