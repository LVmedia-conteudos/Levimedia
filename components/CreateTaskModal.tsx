
import React, { useState } from 'react';
import { X, Sparkles, Calendar, User as UserIcon, Building2, Layout, Target, Link as LinkIcon } from 'lucide-react';
import { ContentTask, ContentStatus, Priority, User, Client, UserRole } from '../types';
import { MOCK_CLIENTS, MOCK_USERS } from '../constants';
import { generateBriefing } from '../services/geminiService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<ContentTask, 'id' | 'createdAt'>) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientId: MOCK_CLIENTS[0].id,
    format: 'Post Instagram',
    channel: 'Instagram',
    priority: Priority.MEDIA,
    deadline: new Date().toISOString().split('T')[0],
    assignedTo: MOCK_USERS.find(u => u.role === UserRole.EQUIPE)?.id || '',
    briefing: '',
    links: ['']
  });

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    if (!formData.title) return alert('Por favor, insira um título primeiro.');
    setIsAiLoading(true);
    const briefing = await generateBriefing(formData.title, formData.format, formData.channel);
    setFormData(prev => ({ ...prev, briefing }));
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.briefing) return alert('Título e briefing são obrigatórios.');
    
    onSave({
      ...formData,
      status: ContentStatus.PENDENTE,
      attachments: [],
      links: formData.links.filter(l => l.trim() !== '')
    });
    
    setFormData({
      title: '',
      clientId: MOCK_CLIENTS[0].id,
      format: 'Post Instagram',
      channel: 'Instagram',
      priority: Priority.MEDIA,
      deadline: new Date().toISOString().split('T')[0],
      assignedTo: MOCK_USERS.find(u => u.role === UserRole.EQUIPE)?.id || '',
      briefing: '',
      links: ['']
    });
    onClose();
  };

  const addLink = () => setFormData(prev => ({ ...prev, links: [...prev.links, ''] }));
  const updateLink = (index: number, val: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = val;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Criar Nova Tarefa</h2>
            <p className="text-xs text-slate-500 font-medium">Preencha os detalhes do conteúdo para a equipe.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Target size={14} />
                <span>Título do Conteúdo</span>
              </label>
              <input 
                required
                type="text"
                placeholder="Ex: Campanha Dia dos Pais - Carrossel"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-slate-800"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Building2 size={14} />
                <span>Cliente</span>
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-slate-800"
                value={formData.clientId}
                onChange={e => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              >
                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                <UserIcon size={14} />
                <span>Responsável</span>
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium text-slate-800"
                value={formData.assignedTo}
                onChange={e => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                {MOCK_USERS.filter(u => u.role !== UserRole.CLIENTE).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Layout size={14} />
                <span>Canal / Plataforma</span>
              </label>
              <input 
                type="text"
                placeholder="Ex: Instagram"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800"
                value={formData.channel}
                onChange={e => setFormData(prev => ({ ...prev, channel: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
                <Calendar size={14} />
                <span>Prazo Final</span>
              </label>
              <input 
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-800"
                value={formData.deadline}
                onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase">Briefing Detalhado</label>
              <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="flex items-center space-x-2 text-[10px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 transition-all disabled:opacity-50"
              >
                <Sparkles size={12} className={isAiLoading ? 'animate-spin' : ''} />
                <span>{isAiLoading ? 'Gerando Briefing...' : 'Gerar com Inteligência Artificial'}</span>
              </button>
            </div>
            <textarea 
              required
              rows={6}
              placeholder="Descreva o que deve ser feito..."
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-slate-700 text-sm resize-none"
              value={formData.briefing}
              onChange={e => setFormData(prev => ({ ...prev, briefing: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-2">
              <LinkIcon size={14} />
              <span>Links de Referência / Drive</span>
            </label>
            {formData.links.map((link, idx) => (
              <input 
                key={idx}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 focus:ring-1 focus:ring-orange-500 outline-none"
                value={link}
                onChange={e => updateLink(idx, e.target.value)}
              />
            ))}
            <button 
              type="button"
              onClick={addLink}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
            >
              + Adicionar outro link
            </button>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end space-x-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
};
