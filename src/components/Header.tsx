import React from 'react';
import { UserRole, AppScreen, ModalType } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenModal: (modal: ModalType) => void;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentScreen,
  onNavigate,
  onOpenModal,
  onToggleRole,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#070f19]/90 backdrop-blur-xl z-50 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-b border-[#18202b]">
      {/* Brand & Left Cluster */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={() => onNavigate('ddns')}
          className="flex items-center gap-2.5 text-left group"
        >
          <img
            alt="FR_OS Logo Hex Vault"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline-sm text-lg text-[#dbe3f2] tracking-wider font-bold">
              FR<span className="text-[#4cd7f6]">_</span>OS
            </span>
            <span className="font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] tracking-widest uppercase">
              v4.8.2
            </span>
          </div>
        </button>

        {/* Global Nav Bar */}
        <nav className="hidden xl:flex items-center gap-5 ml-2">
          <button
            onClick={() => onNavigate('auditor-control-plane')}
            className={`font-label-md text-xs uppercase tracking-wider transition-colors ${
              currentScreen === 'auditor-control-plane'
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onOpenModal('device-inspector')}
            className="font-label-md text-xs uppercase tracking-wider text-[#bcc9cd] hover:text-[#dbe3f2] transition-colors flex items-center gap-1"
          >
            <span>Device Inspector</span>
            <span className="px-1 py-0.2 text-[9px] rounded bg-[#18202b] text-[#4cd7f6]">L2/L3</span>
          </button>
          <button
            onClick={() => onNavigate('ddns')}
            className={`font-label-md text-xs uppercase tracking-wider transition-colors ${
              currentScreen === 'ddns'
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
            }`}
          >
            Dynamic DNS
          </button>
          <button
            onClick={() => onNavigate('operator-cockpit')}
            className={`font-label-md text-xs uppercase tracking-wider transition-colors ${
              currentScreen === 'operator-cockpit' || currentScreen === 'vlan10-convergence'
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
            }`}
          >
            JIT Cockpit
          </button>
          <button
            onClick={() => onNavigate('audit-receipt')}
            className={`font-label-md text-xs uppercase tracking-wider transition-colors ${
              currentScreen === 'audit-receipt'
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
            }`}
          >
            Audit Ledger
          </button>
          <button
            onClick={() => onNavigate('pdf-cert-sheet1')}
            className={`font-label-md text-xs uppercase tracking-wider transition-colors ${
              currentScreen === 'pdf-cert-sheet1' || currentScreen === 'pdf-cert-sheet2'
                ? 'text-[#4cd7f6] font-semibold'
                : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
            }`}
          >
            Certificate (PDF)
          </button>
        </nav>
      </div>

      {/* Right Telemetry & Status Cluster */}
      <div className="flex items-center gap-3">
        {/* Node Live State Badge */}
        <div className="hidden lg:flex items-center gap-3 bg-[#141c27] px-3 py-1.5 rounded-lg border border-[#232a36]/60">
          <div className="flex items-center gap-1.5 font-label-sm text-xs text-[#dbe3f2]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-mono">node-01.lab.internal</span>
            <span className="text-[#4edea3] text-[10px] font-bold">[ONLINE]</span>
          </div>
          <div className="w-px h-3.5 bg-[#2d3541]"></div>
          <div className="font-label-sm text-[11px] text-[#bcc9cd] flex items-center gap-2.5 font-mono">
            <span>
              CPU <span className="text-[#4cd7f6] font-bold">14%</span>
            </span>
            <span>
              RAM <span className="text-[#4cd7f6] font-bold">38%</span>
            </span>
            <span>
              TEMP <span className="text-[#4edea3] font-bold">41°C</span>
            </span>
          </div>
        </div>

        {/* DPDK / Fastpath Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#141c27] px-2.5 py-1.5 rounded-lg border border-[#232a36]/60">
          <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">bolt</span>
          <span className="font-label-sm text-[10px] text-[#4cd7f6] uppercase font-bold tracking-wider">
            DPDK / XDP Active
          </span>
        </div>

        {/* Role Indicator & Quick Toggle Switcher */}
        <div
          onClick={onToggleRole}
          title="Click to toggle between Read-Only Auditor and Operator Elevated modes"
          className="flex items-center gap-2 bg-[#141c27] hover:bg-[#18202b] cursor-pointer px-2.5 py-1.5 rounded-lg border border-[#232a36] transition-all"
        >
          {currentRole === 'operator_elevated' ? (
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
              </span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-[11px] text-[#dbe3f2] font-bold leading-none">
                  operator_elevated
                </span>
                <span className="font-label-sm text-[8px] text-[#4cd7f6] font-bold tracking-wider">
                  OPERATOR L2 R/W
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">visibility</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-[11px] text-[#dbe3f2] font-semibold leading-none">
                  viewer_readonly
                </span>
                <span className="font-label-sm text-[8px] text-[#869397] tracking-wider uppercase font-bold">
                  Auditor Mode
                </span>
              </div>
              <span className="material-symbols-outlined text-[13px] text-[#869397]">lock</span>
            </div>
          )}
          <span className="material-symbols-outlined text-[16px] text-[#869397]">unfold_more</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => alert('All security invariants verified. No uncommitted BPF filter mutations.')}
          className="p-2 text-[#bcc9cd] hover:text-[#dbe3f2] hover:bg-[#232a36] rounded-lg transition-colors flex items-center justify-center relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold shadow-[0_0_10px_rgba(76,215,246,0.3)]">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};
