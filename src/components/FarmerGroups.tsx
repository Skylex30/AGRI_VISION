import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  adminId: string;
}

export const FarmerGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'groups'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
      setGroups(groupsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'groups');
    });
    return () => unsubscribe();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'groups'), {
        name: newName,
        description: newDesc,
        members: [auth.currentUser.uid],
        adminId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'groups');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Farmer Communities</h2>
          <p className="text-white/40">Join groups to sell jointly and access better logistics rates.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, i) => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <Users size={28} />
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    U{n}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-emerald-500 flex items-center justify-center text-[10px] font-bold">
                  +{group.members.length}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
            <p className="text-white/40 text-sm mb-6 line-clamp-2">{group.description}</p>

            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <ArrowRight size={16} />
                <span>Join Group</span>
              </button>
              <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all">
                <MessageSquare size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] border border-white/10 p-8 rounded-[3rem] max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Start a Community</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase mb-2 block">Group Name</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="e.g. Northern Grains Cooperative"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase mb-2 block">Description</label>
                <textarea 
                  required
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 h-32"
                  placeholder="What is the goal of this group?"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
