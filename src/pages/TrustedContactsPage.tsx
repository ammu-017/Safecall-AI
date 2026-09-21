import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrustedContact } from '../types';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  ShieldCheck,
  Bell,
  Trash2,
  Edit2,
  Send,
  Info,
  HeartHandshake,
  CheckCircle2,
  X,
} from 'lucide-react';

export const TrustedContactsPage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, testFamilyNotification } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notifyOnHighRisk, setNotifyOnHighRisk] = useState(true);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRelationship('Son');
    setPhoneNumber('');
    setEmail('');
    setNotifyOnHighRisk(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: TrustedContact) => {
    setEditingContact(c);
    setName(c.name);
    setRelationship(c.relationship);
    setPhoneNumber(c.phoneNumber);
    setEmail(c.email);
    setNotifyOnHighRisk(c.notifyOnHighRisk);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) return;

    if (editingContact) {
      await updateContact(editingContact.id, {
        name,
        relationship,
        phoneNumber,
        email,
        notifyOnHighRisk,
      });
    } else {
      await addContact({
        name,
        relationship,
        phoneNumber,
        email,
        notifyOnHighRisk,
        consentStatus: 'confirmed',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Family & Trusted Contacts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Caregivers and family members who receive urgent alerts when high-risk scams are intercepted
          </p>
        </div>

        <button
          id="add-contact-btn"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trusted Contact</span>
        </button>
      </div>

      {/* PRIVACY EXPLANATION BANNER */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 flex items-start space-x-3">
        <HeartHandshake className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Family Protection Guarantee:</strong> Trusted contacts are notified only when you enable this feature and severe scam conditions are met (e.g., OTP theft or digital arrest threats). Routine or private family calls are never disclosed.
        </div>
      </div>

      {/* CONTACTS GRID */}
      {contacts.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No Trusted Contacts Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Add your children, family caregivers, or close neighbors so SafeCall AI can immediately dispatch an SMS warning if an extortion call occurs.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
          >
            Add Your First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{contact.name}</h3>
                    <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mt-1">
                      {contact.relationship}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      contact.consentStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {contact.consentStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{contact.phoneNumber}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Auto-SMS Alert on Threat:</span>
                  <span
                    className={`font-bold ${
                      contact.notifyOnHighRisk ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {contact.notifyOnHighRisk ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => testFamilyNotification(contact)}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  title="Simulate SMS Dispatch"
                >
                  <Send className="w-3.5 h-3.5 text-teal-600" />
                  <span>Test SMS Alert</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingContact ? 'Edit Trusted Contact' : 'Add Trusted Family Contact'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Family Caregiver">Family Caregiver</option>
                  <option value="Doctor">Doctor / Physician</option>
                  <option value="Trusted Neighbor">Trusted Neighbor</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@family.net"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnHighRisk}
                    onChange={(e) => setNotifyOnHighRisk(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-700 font-semibold">
                    Automatically dispatch SMS alert on critical scam threat
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm"
                >
                  {editingContact ? 'Save Changes' : 'Confirm Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
