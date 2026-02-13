
import React, { useState, useRef } from 'react';
import { X, Building2, Layout, Camera, Upload } from 'lucide-react';
import { Client } from '../types';

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id'>) => void;
}

export const CreateClientModal: React.FC<CreateClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    logo: '',
    active: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sector) return alert('Nome e setor são obrigatórios.');
    
    onSave({
      ...formData,
      logo: formData.logo || `https://picsum.photos/seed/${formData.name}/100`
    });
    
    setFormData({ name: '', sector: '', logo: '', active: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Novo Cliente</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-600 transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer group hover:border-orange-500 dark:hover:border-orange-500 overflow-hidden transition-all"
            >
              {formData.logo ? (
                <img src={formData.logo} className="w-full h-full object-cover" alt="" />
              ) : (
                <Camera size={28} className="text-slate-300 dark:text-slate-700 group-hover:text-orange-500 transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={24} className="text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase mt-3 tracking-widest">Logo da Empresa</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Nome Fantasia</label>
              <input 
                required
                type="text"
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold transition-all"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Coca-Cola Brasil"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Setor de Atuação</label>
              <input 
                required
                type="text"
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold transition-all"
                value={formData.sector}
                onChange={e => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                placeholder="Ex: Alimentício"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center space-x-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Cancelar</button>
            <button type="submit" className="flex-[2] py-4 bg-slate-950 dark:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-orange-500/20 transition-all active:scale-95">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
