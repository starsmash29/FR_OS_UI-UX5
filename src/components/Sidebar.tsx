import React from 'react';
import { AppScreen, ModalType, UserRole } from '../types';

interface SidebarProps {
  currentScreen: AppScreen;
  currentRole: UserRole;
  onNavigate: (screen: AppScreen) => void;
  onOpenModal: (modal: ModalType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  currentRole,
  onNavigate,
  onOpenModal,
}) => {
  const isAuditor = currentRole === 'viewer_readonly';

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#070f19] z-40 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.6)] border-r border-[#18202b] overflow-y-auto">
      <div className="py-3">
        <div className="px-5 mb-2 flex items-center justify-between">
          <span className="font-label-sm text-[10px] tracking-widest text-[#869397] uppercase font-bold">
            Network / Routing & Services
          </span>
          <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded bg-[#141c27] text-[#4edea3]">
            L7 DPI
          </span>
        </div>

        <nav className="space-y-0.5 px-3">
          <button
            onClick={() => onNavigate('auditor-control-plane')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'auditor-control-plane'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
            <span>Control Plane</span>
          </button>

          <button
            onClick={() => onNavigate('ddns')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'ddns'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span>Dynamic DNS (DDNS)</span>
          </button>

          <button
            onClick={() => onOpenModal('device-inspector')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">devices</span>
              <span>Client Inspector</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#141c27] text-[#4cd7f6] text-[9px] font-mono">
              L2/L3
            </span>
          </button>

          <button
            onClick={() => onNavigate('operator-cockpit')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'operator-cockpit'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
              <span>Operator Cockpit</span>
            </div>
            {isAuditor ? (
              <span className="material-symbols-outlined text-[14px] text-[#869397]">lock</span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[9px] font-bold">
                ACTIVE
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('vlan10-convergence')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'vlan10-convergence'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>VLAN 10 Convergence</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#141c27] text-[#d0bcff] text-[9px] font-mono">
              +30m
            </span>
          </button>

          <button
            onClick={() => onNavigate('lease-expired')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'lease-expired'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-[#ffb4ab]">timer_off</span>
              <span>Teardown & Expiry</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#93000a]/30 text-[#ffb4ab] text-[9px] font-mono">
              00:00
            </span>
          </button>

          <button
            onClick={() => onNavigate('audit-receipt')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'audit-receipt'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Audit Receipt & Report</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#141c27] text-[#4edea3] text-[9px] font-mono">
              eBPF
            </span>
          </button>

          <button
            onClick={() => onNavigate('pdf-cert-sheet1')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-label-md text-xs transition-all text-left ${
              currentScreen === 'pdf-cert-sheet1' || currentScreen === 'pdf-cert-sheet2'
                ? 'bg-[#06b6d4] text-[#003640] font-bold shadow-sm'
                : 'text-[#bcc9cd] hover:bg-[#232a36] hover:text-[#dbe3f2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>PDF Certificate (1/2)</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] text-[9px] font-mono">
              Ed25519
            </span>
          </button>
        </nav>
      </div>

      {/* DPDK Hardware Telemetry Card */}
      <div className="p-3 m-3 bg-[#141c27] rounded-xl border border-[#232a36]/80 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-label-sm text-[10px] text-[#4edea3] uppercase font-bold tracking-wider">
              DPDK / XDP Active
            </span>
          </div>
          <span className="font-label-sm text-[10px] text-[#3d494c] font-mono">CORE 0-3</span>
        </div>

        <div className="space-y-1 font-label-sm text-[11px] text-[#bcc9cd]">
          <div className="flex justify-between items-center">
            <span className="text-[#869397]">Throughput:</span>
            <span className="text-[#4cd7f6] font-semibold font-mono">4.2 Gbps</span>
          </div>
          <div className="w-full bg-[#070f19] h-1 rounded-full overflow-hidden mb-1">
            <div className="bg-[#4cd7f6] h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#869397]">Packets:</span>
            <span className="text-[#dbe3f2] font-semibold font-mono">142.8 kpps</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#869397]">Uptime:</span>
            <span className="text-[#dbe3f2] font-mono">42d 18h 14m</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#232a36] flex items-center justify-between text-[10px] font-mono text-[#869397]">
          <span>gw-01.ord-edge</span>
          <span className="text-[#4edea3]">v4.8-PRO</span>
        </div>
      </div>
    </aside>
  );
};
