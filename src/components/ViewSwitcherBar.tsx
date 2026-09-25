import React from 'react';
import { AppScreen, ModalType, UserRole } from '../types';

interface ViewSwitcherBarProps {
  currentScreen: AppScreen;
  activeModal: ModalType;
  currentRole: UserRole;
  onNavigate: (screen: AppScreen) => void;
  onOpenModal: (modal: ModalType) => void;
  onCloseModal: () => void;
}

export const ViewSwitcherBar: React.FC<ViewSwitcherBarProps> = ({
  currentScreen,
  activeModal,
  currentRole,
  onNavigate,
  onOpenModal,
  onCloseModal,
}) => {
  return (
    <div className="w-full bg-[#141c27] border-b border-[#232a36] px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        <span className="font-label-sm text-[10px] uppercase font-bold text-[#869397] tracking-wider shrink-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
          Screen Navigator:
        </span>

        {/* 1. DDNS */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('ddns');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'ddns' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>1. DDNS Engine</span>
        </button>

        {/* 2. Create DDNS Modal */}
        <button
          onClick={() => onOpenModal('create-ddns')}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            activeModal === 'create-ddns'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">add_circle</span>
          <span>2. Add DDNS Modal</span>
        </button>

        {/* 3. Device Inspector */}
        <button
          onClick={() => onOpenModal('device-inspector')}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            activeModal === 'device-inspector'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">laptop_mac</span>
          <span>3. Device Inspector</span>
        </button>

        {/* 4. Auditor Control Plane */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('auditor-control-plane');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'auditor-control-plane' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>4. Auditor Plane</span>
        </button>

        {/* 5. Request Elevation Modal */}
        <button
          onClick={() => onOpenModal('request-elevation')}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            activeModal === 'request-elevation'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">verified_user</span>
          <span>5. Elevate Modal</span>
        </button>

        {/* 6. Operator Cockpit */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('operator-cockpit');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'operator-cockpit' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>6. JIT Active Cockpit</span>
        </button>

        {/* 8. Extend Lease Modal */}
        <button
          onClick={() => onOpenModal('extend-lease')}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            activeModal === 'extend-lease'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#4cd7f6]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px]">timer</span>
          <span>8. Extend Modal</span>
        </button>

        {/* 9. VLAN 10 Convergence */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('vlan10-convergence');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'vlan10-convergence' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>9. +30m Extended</span>
        </button>

        {/* 10. Revoke Privileges Modal */}
        <button
          onClick={() => onOpenModal('revoke-privilege')}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            activeModal === 'revoke-privilege'
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#ffb4ab]'
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-[#ffb4ab]">key_off</span>
          <span>10. Revoke Modal</span>
        </button>

        {/* 7. Lease Expired */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('lease-expired');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'lease-expired' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>7. Lease Expired</span>
        </button>

        {/* 11. Audit Receipt */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('audit-receipt');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'audit-receipt' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>11. Audit Receipt</span>
        </button>

        {/* 12. PDF Sheet 1 */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('pdf-cert-sheet1');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'pdf-cert-sheet1' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>12. PDF Sheet 1</span>
        </button>

        {/* 13. PDF Sheet 2 */}
        <button
          onClick={() => {
            onCloseModal();
            onNavigate('pdf-cert-sheet2');
          }}
          className={`px-2.5 py-1 rounded font-label-md transition-all shrink-0 flex items-center gap-1.5 ${
            currentScreen === 'pdf-cert-sheet2' && !activeModal
              ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
              : 'bg-[#18202b] text-[#bcc9cd] hover:text-[#dbe3f2]'
          }`}
        >
          <span>13. PDF Sheet 2 (Hex)</span>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0 font-label-sm text-[11px] text-[#869397]">
        <span>Current Session:</span>
        <span className="font-mono text-[#dbe3f2]">INC-84920</span>
        <span className="text-[#3d494c]">•</span>
        <span className="text-[#4edea3]">eBPF Linked</span>
      </div>
    </div>
  );
};
