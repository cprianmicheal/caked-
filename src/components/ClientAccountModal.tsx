import React, { useState } from 'react';
import { X, User, Package, MapPin, LogOut, Check, Calendar } from 'lucide-react';
import { formatNaira } from '../data/patisserie';

export interface ClientOrderRecord {
  id: string;
  date: string;
  itemsSummary: string;
  total: number;
}

export interface ClientReservationRecord {
  ref: string;
  type: 'salon' | 'bespoke';
  date: string;
  detail: string;
}

export interface ClientAccount {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  orders: ClientOrderRecord[];
  reservations: ClientReservationRecord[];
}

interface ClientAccountModalProps {
  open: boolean;
  onClose: () => void;
  account: ClientAccount | null;
  onSignIn: (account: ClientAccount) => void;
  onUpdateAddress: (address: string) => void;
  onSignOut: () => void;
}

export function ClientAccountModal({
  open,
  onClose,
  account,
  onSignIn,
  onUpdateAddress,
  onSignOut,
}: ClientAccountModalProps) {
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [editingAddress, setEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState(account?.address ?? '');
  const [addressSavedToast, setAddressSavedToast] = useState(false);

  if (!open) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter a password (minimum 4 characters).');
      return;
    }

    if (authTab === 'register') {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }
      setError(null);
      onSignIn({
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: phone.trim() || '+234 800 000 0000',
        address: address.trim() || '14 Adeola Odeku, Victoria Island, Lagos',
        orders: [],
        reservations: [],
      });
      return;
    }

    // Sign in with clean client profile derived from existing stored accounts or entered email
    setError(null);
    const derivedName = cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    onSignIn({
      fullName: derivedName || 'Valued Client',
      email: cleanEmail,
      phone: '+234 809 412 0099',
      address: '14 Adeola Odeku, Victoria Island, Lagos',
      orders: [],
      reservations: [],
    });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressDraft.trim().length < 4) return;
    onUpdateAddress(addressDraft.trim());
    setEditingAddress(false);
    setAddressSavedToast(true);
    setTimeout(() => setAddressSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-account-title"
        className="relative z-10 w-full max-w-lg bg-white text-[#1D1918] rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Top Modal Header */}
        <div className="bg-[#211C1B] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#F4D9AC]">
                Rolex Patisserie
              </p>
              <h3 id="client-account-title" className="text-base font-semibold tracking-wide">
                {account ? 'Client Account' : 'Client Portal'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close client account"
            className="p-2 text-white/75 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {account ? (
          /* Signed-In Client Dashboard */
          <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
              <div>
                <h4 className="text-xl font-semibold text-[#1D1918]">{account.fullName}</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {account.email} · {account.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-rose-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Saved Dispatch Address */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-[#211C1B]" />
                  <span>Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAddressDraft(account.address);
                    setEditingAddress((v) => !v);
                  }}
                  className="text-xs font-medium text-[#211C1B] underline underline-offset-4 cursor-pointer"
                >
                  {editingAddress ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingAddress ? (
                <form onSubmit={handleSaveAddress} className="flex gap-2">
                  <input
                    type="text"
                    value={addressDraft}
                    onChange={(e) => setAddressDraft(e.target.value)}
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-xs text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#211C1B] text-white text-xs font-medium cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <p className="text-sm text-stone-700">{account.address}</p>
              )}

              {addressSavedToast && (
                <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  <span>Address updated</span>
                </p>
              )}
            </div>

            {/* Order History */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 mb-3">
                <Package className="w-3.5 h-3.5 text-[#211C1B]" />
                <span>Recent Orders ({account.orders.length})</span>
              </div>

              {account.orders.length === 0 ? (
                <p className="text-xs text-stone-400">
                  Orders you place from your bag will appear here automatically.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {account.orders.map((ord) => (
                    <li
                      key={ord.id}
                      className="flex items-center justify-between gap-3 bg-stone-50 rounded-lg px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#1D1918]">
                          {ord.id} · {ord.date}
                        </p>
                        <p className="text-stone-500 mt-0.5">{ord.itemsSummary}</p>
                      </div>
                      <span className="font-semibold text-[#1D1918] tabular-nums shrink-0">
                        {formatNaira(ord.total)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Salon & Bespoke Reservations */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#211C1B]" />
                <span>Salon & Cake Bookings ({account.reservations.length})</span>
              </div>

              {account.reservations.length === 0 ? (
                <p className="text-xs text-stone-400">
                  No active salon tables or custom cake consultations yet.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {account.reservations.map((res) => (
                    <li
                      key={res.ref}
                      className="bg-stone-50 rounded-lg px-3.5 py-2.5 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-semibold text-[#1D1918]">{res.ref}</p>
                        <p className="text-stone-500 mt-0.5">{res.detail}</p>
                      </div>
                      <span className="text-stone-500 tabular-nums shrink-0">{res.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          /* Sign In / Create Account Form */
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-full mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-[#211C1B] text-white'
                    : 'text-stone-600 hover:text-[#1D1918]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-[#211C1B] text-white'
                    : 'text-stone-600 hover:text-[#1D1918]'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'register' && (
                <div>
                  <label
                    htmlFor="client-name"
                    className="block text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Amaka Okafor"
                    className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="client-email"
                  className="block text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                />
              </div>

              {authTab === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="client-phone"
                      className="block text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="client-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="client-address"
                      className="block text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500 mb-1"
                    >
                      Delivery City / Street
                    </label>
                    <input
                      id="client-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Victoria Island, Lagos"
                      className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="client-password"
                  className="block text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500 mb-1"
                >
                  Password
                </label>
                <input
                  id="client-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-[#1D1918] focus:outline-none focus:border-[#211C1B]"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#211C1B] text-white text-xs font-semibold tracking-[0.16em] uppercase hover:bg-[#332B29] transition-colors cursor-pointer"
              >
                {authTab === 'signin' ? 'Access Client Account' : 'Create Client Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
