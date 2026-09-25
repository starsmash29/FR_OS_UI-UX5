import React, { useState } from 'react';

interface DeviceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceInspectorModal: React.FC<DeviceInspectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'conntrack' | 'l7' | 'security' | 'dhcp'>('overview');
  const [hostname, setHostname] = useState('workstation-pro-cad.lab.internal');
  const [isEditingHostname, setIsEditingHostname] = useState(false);
  const [copiedMac, setCopiedMac] = useState(false);

  // Policy Toggles
  const [blockInternet, setBlockInternet] = useState(false);
  const [enforce2fa, setEnforce2fa] = useState(false);
  const [routeWg, setRouteWg] = useState(true);
  const [pcapMirror, setPcapMirror] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyMac = () => {
    navigator.clipboard.writeText('a4:83:e7:2b:99:40');
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  const handleSavePolicy = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJson = () => {
    const data = {
      device: {
        hostname,
        mac: 'a4:83:e7:2b:99:40',
        ipv4: '192.168.10.45',
        ipv6: '2001:db8:85a3::8a2e:370:7334',
        vlan: 10,
        interface: 'bond0.10',
        os: 'macOS Sonoma 14.4.1 (Mac14,14)',
        telemetry: {
          rx_mbps: 412,
          tx_mbps: 84,
          transferred_24h_gb: 171.2,
          conntrack_flows: 184,
          risk_score: 0.02
        },
        policies: {
          block_internet: blockInternet,
          enforce_2fa: enforce2fa,
          wireguard_tunnel: routeWg,
          pcap_mirror: pcapMirror
        }
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hostname}-diagnostic.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070f19]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-[#141c27] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] border border-[#232a36] flex flex-col overflow-hidden max-h-[95vh]">
        {/* Top Tactical Header & Brand Accent Strip */}
        <div className="bg-[#070f19] px-6 py-3 flex items-center justify-between border-b border-[#232a36]">
          <div className="flex items-center gap-3">
            {/* Hex Vault Snowflake Brandmark */}
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#4cd7f6]" fill="none" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
                <polygon fill="#070f19" points="50,2 96,28 96,86 50,113 4,86 4,28" stroke="currentColor" strokeOpacity="0.4" strokeWidth="4"></polygon>
                <polygon fill="#0c141f" points="50,42 63,50 63,65 50,73 37,65 37,50" stroke="#4cd7f6" strokeWidth="3"></polygon>
                <circle cx="50" cy="57.5" fill="#4cd7f6" r="3"></circle>
                <line stroke="#4cd7f6" strokeWidth="3" x1="50" x2="50" y1="42" y2="18"></line>
                <circle cx="50" cy="18" fill="#4cd7f6" r="4"></circle>
                <line stroke="#4cd7f6" strokeWidth="3" x1="50" x2="50" y1="73" y2="97"></line>
                <circle cx="50" cy="97" fill="#4cd7f6" r="4"></circle>
                <line stroke="#4cd7f6" strokeWidth="3" x1="37" x2="16" y1="50" y2="38"></line>
                <circle cx="16" cy="38" fill="#4cd7f6" r="4"></circle>
                <line stroke="#4cd7f6" strokeWidth="3" x1="63" x2="84" y1="50" y2="38"></line>
                <circle cx="84" cy="38" fill="#4cd7f6" r="4"></circle>
              </svg>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-sm text-sm font-bold tracking-tight text-[#dbe3f2]">FR_OS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] inline-block"></span>
              </div>
            </div>

            <div className="h-4 w-px bg-[#2d3541]"></div>

            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-xs font-semibold text-[#dbe3f2] tracking-tight">
                Client Device Inspector
              </span>
              <span className="font-label-sm text-[#869397]">//</span>
              <span className="font-label-sm text-[#4cd7f6] uppercase tracking-wider font-semibold">
                FQDN & Telemetry Profile
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-label-sm text-[10px] font-mono ml-1">
                L2/L3 CONTEXT & DEEP TELEMETRY v4.8
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18202b] border border-[#232a36]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-label-sm text-[11px] text-[#4edea3] font-mono">eBPF HOOK ATTACHED</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded hover:bg-[#232a36] text-[#869397] hover:text-[#dbe3f2] flex items-center justify-center transition-colors"
              title="Close Inspector"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Subtitle description bar */}
        <div className="px-6 py-1.5 bg-[#18202b] border-b border-[#232a36] flex items-center justify-between">
          <p className="font-body-sm text-[11px] text-[#bcc9cd]">
            Detailed hardware fingerprint, dynamic conntrack flows, L7 application breakdown, and perimeter isolation policies for this host.
          </p>
          <span className="font-label-sm text-[10px] text-[#869397] font-mono">
            NODE: gw-01.ord-edge (Zone: LAN_TRUSTED)
          </span>
        </div>

        {/* Device Hero Identity Card */}
        <div className="p-4 bg-[#232a36]/30 border-b border-[#232a36]">
          <div className="bg-[#070f19] rounded-lg p-4 shadow-inner border border-[#232a36]/80 flex flex-col gap-3">
            {/* Top Row: Device Name, Tags, Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#18202b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#18202b] border border-[#232a36] flex items-center justify-center text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[24px]">laptop_mac</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {isEditingHostname ? (
                      <input
                        value={hostname}
                        onChange={(e) => setHostname(e.target.value)}
                        onBlur={() => setIsEditingHostname(false)}
                        autoFocus
                        className="font-headline-md text-sm font-bold text-[#4cd7f6] bg-[#141c27] px-2 py-0.5 rounded outline-none border border-[#4cd7f6]"
                      />
                    ) : (
                      <span className="font-headline-md text-base font-bold text-[#dbe3f2] tracking-tight">
                        {hostname}
                      </span>
                    )}
                    <button
                      onClick={() => setIsEditingHostname(!isEditingHostname)}
                      className="text-[#869397] hover:text-[#4cd7f6] transition-colors"
                      title="Rename alias"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                    </button>
                    <span className="px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] font-label-sm text-[10px] font-mono uppercase font-bold">
                      DHCP PINNED
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#bcc9cd] mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#869397]">devices</span>
                      Apple Mac Studio M2 Max (macOS Sonoma 14.4.1)
                    </span>
                    <span className="text-[#3d494c]">•</span>
                    <span className="font-mono text-[#869397]">Model ID: Mac14,14</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00a572]/15 border border-[#00a572]/30">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3]"></div>
                  <span className="font-label-sm text-xs text-[#4edea3] font-mono font-bold tracking-wide">
                    ONLINE // 4.2 Gbps Link
                  </span>
                </div>
                <span className="font-label-sm text-[10px] text-[#869397] font-mono mt-0.5">
                  Last Active: 2s ago
                </span>
              </div>
            </div>

            {/* Bottom Row: Addressing Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
              {/* MAC */}
              <div className="flex flex-col gap-0.5 bg-[#141c27] p-2.5 rounded border border-[#232a36]">
                <span className="font-label-sm text-[10px] text-[#869397] uppercase tracking-wider">
                  Hardware MAC Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-body-md text-xs font-mono text-[#dbe3f2] font-semibold">
                    a4:83:e7:2b:99:40
                  </span>
                  <button
                    onClick={handleCopyMac}
                    className="text-[#869397] hover:text-[#4cd7f6] transition-colors"
                    title="Copy MAC to clipboard"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedMac ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <span className="font-label-sm text-[10px] text-[#4edea3] font-mono">
                  OUI: Apple, Inc. (Verified)
                </span>
              </div>

              {/* IPv4 */}
              <div className="flex flex-col gap-0.5 bg-[#141c27] p-2.5 rounded border border-[#232a36]">
                <span className="font-label-sm text-[10px] text-[#869397] uppercase tracking-wider">
                  Assigned IPv4 Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-body-md text-xs font-mono text-[#4cd7f6] font-bold">
                    192.168.10.45
                  </span>
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[15px]">lock</span>
                </div>
                <span className="font-label-sm text-[10px] text-[#869397] font-mono">
                  Static DHCP Lease (Pinned)
                </span>
              </div>

              {/* IPv6 */}
              <div className="flex flex-col gap-0.5 bg-[#141c27] p-2.5 rounded border border-[#232a36]">
                <span className="font-label-sm text-[10px] text-[#869397] uppercase tracking-wider">
                  Assigned IPv6 Address
                </span>
                <span className="font-body-sm text-xs font-mono text-[#dbe3f2] truncate" title="2001:db8:85a3::8a2e:370:7334">
                  2001:db8:85a3::8a2e:370:7334
                </span>
                <span className="font-label-sm text-[10px] text-[#869397] font-mono">
                  SLAAC / Stable Privacy
                </span>
              </div>

              {/* VLAN & Trunk */}
              <div className="flex flex-col gap-0.5 bg-[#141c27] p-2.5 rounded border border-[#232a36]">
                <span className="font-label-sm text-[10px] text-[#869397] uppercase tracking-wider">
                  Topology & Trunk
                </span>
                <span className="font-body-sm text-xs font-mono text-[#d0bcff] truncate">
                  VLAN 10 — Trusted Workstations
                </span>
                <span className="font-label-sm text-[10px] text-[#869397] font-mono">
                  bond0.10 (SFP+ Port 3, 10GbE FD)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-[#18202b] px-4 flex items-center justify-between border-b border-[#232a36]">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors border-t-2 ${
                activeTab === 'overview'
                  ? 'text-[#4cd7f6] bg-[#141c27] border-[#4cd7f6]'
                  : 'text-[#bcc9cd] hover:text-[#dbe3f2] border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">monitoring</span>
              Overview & Telemetry
            </button>

            <button
              onClick={() => setActiveTab('conntrack')}
              className={`px-3 py-2 font-label-md text-xs flex items-center gap-1.5 transition-colors border-t-2 ${
                activeTab === 'conntrack'
                  ? 'text-[#4cd7f6] bg-[#141c27] border-[#4cd7f6]'
                  : 'text-[#bcc9cd] hover:text-[#dbe3f2] border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">sync_alt</span>
              Active Flows & Conntrack
              <span className="px-1.5 py-0.2 rounded-full bg-[#2d3541] text-[#4cd7f6] font-mono text-[10px]">
                24
              </span>
            </button>

            <button
              onClick={() => setActiveTab('l7')}
              className={`px-3 py-2 font-label-md text-xs flex items-center gap-1.5 transition-colors border-t-2 ${
                activeTab === 'l7'
                  ? 'text-[#4cd7f6] bg-[#141c27] border-[#4cd7f6]'
                  : 'text-[#bcc9cd] hover:text-[#dbe3f2] border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">layers</span>
              L7 Application & DPI
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-2 font-label-md text-xs flex items-center gap-1.5 transition-colors border-t-2 ${
                activeTab === 'security'
                  ? 'text-[#4cd7f6] bg-[#141c27] border-[#4cd7f6]'
                  : 'text-[#bcc9cd] hover:text-[#dbe3f2] border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">security</span>
              Security & Isolation
            </button>

            <button
              onClick={() => setActiveTab('dhcp')}
              className={`px-3 py-2 font-label-md text-xs flex items-center gap-1.5 transition-colors border-t-2 ${
                activeTab === 'dhcp'
                  ? 'text-[#4cd7f6] bg-[#141c27] border-[#4cd7f6]'
                  : 'text-[#bcc9cd] hover:text-[#dbe3f2] border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">dns</span>
              DHCP & DNS Pinning
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#869397] font-label-sm text-[10px] font-mono">
            <span>STREAM: 1,000ms</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[60vh] bg-[#070f19]">
          {/* 4 KPI Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="bg-[#18202b] rounded-lg p-3 flex flex-col justify-between border border-[#232a36]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#869397]">
                  Current Bandwidth
                </span>
                <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">speed</span>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-display text-2xl text-[#dbe3f2] font-mono">412</span>
                  <span className="font-label-md text-xs text-[#4cd7f6] font-mono font-bold">Mbps RX</span>
                </div>
                <div className="font-body-sm text-[11px] text-[#869397] font-mono flex items-center gap-1">
                  <span>84 Mbps TX</span>
                  <span className="text-[#bcc9cd]">• Peak 820 Mbps</span>
                </div>
              </div>
              {/* Sparkline */}
              <div className="h-7 w-full mt-2">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <defs>
                    <linearGradient id="cyanSpark" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0,20 Q10,18 20,12 T40,15 T60,5 T80,11 T100,2 L100,24 L0,24 Z" fill="url(#cyanSpark)"></path>
                  <path d="M0,20 Q10,18 20,12 T40,15 T60,5 T80,11 T100,2" fill="none" stroke="#4cd7f6" strokeWidth="2"></path>
                  <circle cx="100" cy="2" fill="#4cd7f6" r="2.5"></circle>
                </svg>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#18202b] rounded-lg p-3 flex flex-col justify-between border border-[#232a36]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#869397]">
                  Total Transferred (24h)
                </span>
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">data_usage</span>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-display text-2xl text-[#dbe3f2] font-mono">171.2</span>
                  <span className="font-label-md text-xs text-[#4edea3] font-mono font-bold">GB Total</span>
                </div>
                <div className="font-body-sm text-[11px] text-[#869397] font-mono">
                  142.8 GB Down / 28.4 GB Up
                </div>
              </div>
              <div className="w-full bg-[#232a36] h-1.5 rounded-full overflow-hidden mt-2 flex">
                <div className="bg-[#4edea3] h-full" style={{ width: '83%' }}></div>
                <div className="bg-[#4cd7f6] h-full" style={{ width: '17%' }}></div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#18202b] rounded-lg p-3 flex flex-col justify-between border border-[#232a36]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#869397]">
                  Active Conntrack
                </span>
                <span className="material-symbols-outlined text-[#d0bcff] text-[16px]">hub</span>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-display text-2xl text-[#dbe3f2] font-mono">184</span>
                  <span className="font-label-md text-xs text-[#d0bcff] font-mono font-bold">Flows</span>
                </div>
                <div className="font-body-sm text-[11px] text-[#869397] font-mono">
                  184 Established • 0 Drops
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 font-label-sm text-[10px] font-mono">
                <span className="px-1 py-0.2 rounded bg-[#232a36] text-[#dbe3f2]">TCP: 142</span>
                <span className="px-1 py-0.2 rounded bg-[#232a36] text-[#dbe3f2]">UDP: 38</span>
                <span className="px-1 py-0.2 rounded bg-[#232a36] text-[#dbe3f2]">ICMP: 4</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#18202b] rounded-lg p-3 flex flex-col justify-between border border-[#232a36]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#869397]">
                  Threat & IPS Risk
                </span>
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified_user</span>
              </div>
              <div className="mt-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-display text-2xl text-[#4edea3] font-mono">0.02</span>
                  <span className="font-label-md text-xs text-[#4edea3] font-mono font-bold">LOW RISK</span>
                </div>
                <div className="font-body-sm text-[11px] text-[#869397] font-mono truncate">
                  Clean JA4 • 0 IPS Triggers
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 bg-[#232a36] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4edea3] h-full" style={{ width: '2%' }}></div>
                </div>
                <span className="font-label-sm text-[9px] text-[#4edea3] font-mono">NORMAL</span>
              </div>
            </div>
          </div>

          {/* Two-Column Deep-Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left: Hardware Fingerprint */}
            <div className="lg:col-span-5 bg-[#18202b] rounded-lg p-3.5 flex flex-col gap-2.5 border border-[#232a36]">
              <div className="flex items-center justify-between pb-1 border-b border-[#232a36]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">fingerprint</span>
                  <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">
                    Hardware & Stack Fingerprint
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#869397] font-label-sm text-[9px] font-mono">
                  PASSIVE DPI
                </span>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                {/* DHCP Opt 55 */}
                <div className="bg-[#141c27] p-2 rounded border border-[#232a36]/60">
                  <div className="flex items-center justify-between text-[#869397] text-[10px]">
                    <span className="uppercase">DHCP Option 55 Request</span>
                    <span className="text-[#4cd7f6]">Darwin Kernel</span>
                  </div>
                  <div className="text-[#dbe3f2] text-[11px] font-semibold mt-0.5">
                    1, 3, 6, 15, 119, 95, 252, 44, 46, 47
                  </div>
                  <div className="text-[#869397] text-[10px] mt-0.5">
                    Vendor ID: <span className="text-[#dbe3f2]">dhcpcd-9.4.0 / Darwin Kernel 23.4.0</span>
                  </div>
                </div>

                {/* Bonjour / mDNS */}
                <div className="bg-[#141c27] p-2 rounded border border-[#232a36]/60">
                  <div className="flex items-center justify-between text-[#869397] text-[10px]">
                    <span className="uppercase">Advertised mDNS Services</span>
                    <span className="text-[#4edea3]">3 Broadcasts</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] text-[10px]">
                      _ssh._tcp.local
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] text-[10px]">
                      _airplay._tcp.local
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] text-[10px]">
                      _smb._tcp.local
                    </span>
                  </div>
                </div>

                {/* TLS JA3/JA4 */}
                <div className="bg-[#141c27] p-2 rounded border border-[#232a36]/60">
                  <div className="flex items-center justify-between text-[#869397] text-[10px]">
                    <span className="uppercase">TLS Fingerprints (JA3 / JA4)</span>
                    <span className="text-[#4edea3]">VALIDATED</span>
                  </div>
                  <div className="text-[10px] text-[#869397] mt-0.5">
                    JA3: <span className="text-[#dbe3f2] font-mono">66918128f1b9b03303d77c6f2eefd128</span>
                  </div>
                  <div className="text-[10px] text-[#869397]">
                    JA4: <span className="text-[#4cd7f6] font-mono font-bold">t13d1516h2_8daaf6152771_b1239</span>
                  </div>
                </div>

                {/* MTU & Link */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#141c27] p-1.5 rounded border border-[#232a36]/60">
                    <span className="text-[#869397] text-[9px] block">MTU Size</span>
                    <span className="text-[#4cd7f6] font-bold text-xs">9000 (Jumbo)</span>
                  </div>
                  <div className="bg-[#141c27] p-1.5 rounded border border-[#232a36]/60">
                    <span className="text-[#869397] text-[9px] block">Gateway RTT</span>
                    <span className="text-[#4edea3] font-bold text-xs">0.18 ms</span>
                  </div>
                  <div className="bg-[#141c27] p-1.5 rounded border border-[#232a36]/60">
                    <span className="text-[#869397] text-[9px] block">Packet Loss</span>
                    <span className="text-[#4edea3] font-bold text-xs">0.00%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: L7 Protocol Breakdown */}
            <div className="lg:col-span-7 bg-[#18202b] rounded-lg p-3.5 flex flex-col gap-2.5 border border-[#232a36]">
              <div className="flex items-center justify-between pb-1 border-b border-[#232a36]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">query_stats</span>
                  <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">
                    L7 Protocol & Top Remote Endpoints (24h)
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#232a36] text-[#869397] font-label-sm text-[9px] font-mono">
                  DPI ENGINE
                </span>
              </div>

              {/* Protocol Bars */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-[#dbe3f2] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                      GitHub & Git SSH (Port 22/443)
                    </span>
                    <span className="text-[#bcc9cd]">58.2 GB (41%)</span>
                  </div>
                  <div className="w-full bg-[#070f19] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4cd7f6] h-full" style={{ width: '41%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-[#dbe3f2] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                      Docker & Registries (ghcr.io)
                    </span>
                    <span className="text-[#bcc9cd]">34.1 GB (24%)</span>
                  </div>
                  <div className="w-full bg-[#070f19] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4edea3] h-full" style={{ width: '24%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-[#dbe3f2] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]"></span>
                      AWS S3 & Cloud Storage
                    </span>
                    <span className="text-[#bcc9cd]">22.6 GB (16%)</span>
                  </div>
                  <div className="w-full bg-[#070f19] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#d0bcff] h-full" style={{ width: '16%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-[#dbe3f2] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#acedff]"></span>
                      Web Browsing (HTTPS/QUIC)
                    </span>
                    <span className="text-[#bcc9cd]">16.4 GB (12%)</span>
                  </div>
                  <div className="w-full bg-[#070f19] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#acedff] h-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="mt-1 bg-[#141c27] rounded border border-[#232a36] overflow-hidden">
                <table className="w-full font-mono text-[11px] text-left">
                  <thead className="bg-[#232a36] text-[#869397] text-[10px]">
                    <tr>
                      <th className="py-1 px-2.5">REMOTE DESTINATION</th>
                      <th className="py-1 px-2.5">RESOLVED HOSTNAME</th>
                      <th className="py-1 px-2.5 text-right">VOLUME</th>
                      <th className="py-1 px-2.5 text-right">POLICY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232a36]/60">
                    <tr>
                      <td className="py-1 px-2.5 text-[#dbe3f2]">140.82.121.4:443</td>
                      <td className="py-1 px-2.5 text-[#4cd7f6]">github.com</td>
                      <td className="py-1 px-2.5 text-right text-[#bcc9cd]">52.4 GB</td>
                      <td className="py-1 px-2.5 text-right">
                        <span className="px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] text-[9px] font-bold">
                          ALLOWED
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-[#dbe3f2]">52.216.144.18:443</td>
                      <td className="py-1 px-2.5 text-[#4cd7f6]">s3.amazonaws.com</td>
                      <td className="py-1 px-2.5 text-right text-[#bcc9cd]">21.0 GB</td>
                      <td className="py-1 px-2.5 text-right">
                        <span className="px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] text-[9px] font-bold">
                          ALLOWED
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 text-[#dbe3f2]">1.1.1.1:853</td>
                      <td className="py-1 px-2.5 text-[#d0bcff]">one.one.one.one (DoT)</td>
                      <td className="py-1 px-2.5 text-right text-[#bcc9cd]">450 MB</td>
                      <td className="py-1 px-2.5 text-right">
                        <span className="px-1.5 py-0.2 rounded bg-[#d0bcff]/20 text-[#d0bcff] text-[9px] font-bold">
                          ENCRYPTED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Perimeter Isolation & Security Action Matrix */}
          <div className="bg-[#18202b] rounded-lg p-3.5 flex flex-col gap-3 border border-[#232a36]">
            <div className="flex items-center justify-between pb-1 border-b border-[#232a36]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">gavel</span>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">
                  Perimeter Isolation & Security Action Matrix
                </span>
              </div>
              <span className="font-label-sm text-[10px] text-[#869397] font-mono">
                FIREWALL TARGET: nftables / eBPF cgroup
              </span>
            </div>

            {/* 4 Policy Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
              <label
                onClick={() => setBlockInternet(!blockInternet)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                  blockInternet ? 'bg-[#93000a]/20 border-[#ffb4ab]' : 'bg-[#141c27] border-transparent hover:bg-[#232a36]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={blockInternet}
                  onChange={(e) => setBlockInternet(e.target.checked)}
                  className="mt-0.5 accent-[#ffb4ab] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className={`font-body-md text-xs font-semibold ${blockInternet ? 'text-[#ffb4ab]' : 'text-[#dbe3f2]'}`}>
                    Block Internet Access
                  </span>
                  <span className="font-body-sm text-[10px] text-[#869397]">
                    Isolate strictly to local LAN subnet
                  </span>
                </div>
              </label>

              <label
                onClick={() => setEnforce2fa(!enforce2fa)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                  enforce2fa ? 'bg-[#4cd7f6]/20 border-[#4cd7f6]' : 'bg-[#141c27] border-transparent hover:bg-[#232a36]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={enforce2fa}
                  onChange={(e) => setEnforce2fa(e.target.checked)}
                  className="mt-0.5 accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-body-md text-xs font-semibold text-[#dbe3f2]">
                    Enforce 2FA Challenge
                  </span>
                  <span className="font-body-sm text-[10px] text-[#869397]">
                    Trigger WebAuthn captive gate
                  </span>
                </div>
              </label>

              <label
                onClick={() => setRouteWg(!routeWg)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                  routeWg ? 'bg-[#00a572]/20 border-[#4edea3]' : 'bg-[#141c27] border-transparent hover:bg-[#232a36]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={routeWg}
                  onChange={(e) => setRouteWg(e.target.checked)}
                  className="mt-0.5 accent-[#4edea3] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-body-md text-xs font-semibold text-[#dbe3f2]">
                    Route via WireGuard
                  </span>
                  <span className="font-body-sm text-[10px] text-[#869397]">
                    Tunnel all egress to wg0 node
                  </span>
                </div>
              </label>

              <label
                onClick={() => setPcapMirror(!pcapMirror)}
                className={`flex items-start gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                  pcapMirror ? 'bg-[#b395ff]/20 border-[#d0bcff]' : 'bg-[#141c27] border-transparent hover:bg-[#232a36]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pcapMirror}
                  onChange={(e) => setPcapMirror(e.target.checked)}
                  className="mt-0.5 accent-[#d0bcff] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-body-md text-xs font-semibold text-[#dbe3f2]">
                    Full PCAP Mirroring
                  </span>
                  <span className="font-body-sm text-[10px] text-[#869397]">
                    Live span port to Wireshark UNIX sock
                  </span>
                </div>
              </label>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#232a36]">
              <span className="font-label-sm text-[10px] text-[#869397] uppercase font-mono">
                Immediate Remediation Routines:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => alert('Sent SIGTERM to 184 conntrack states for 192.168.10.45')}
                  className="px-3 py-1 rounded bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#869397]">link_off</span>
                  Kill Conntrack (184)
                </button>

                <button
                  onClick={() => {
                    if (confirm('Quarantine host 192.168.10.45 to isolated VLAN 99?')) {
                      alert('Host moved to quarantine VLAN 99.');
                    }
                  }}
                  className="px-3 py-1 rounded bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffb4ab] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">do_not_disturb_on</span>
                  Quarantine Host (VLAN 99)
                </button>

                <button
                  onClick={() => alert('WoL Magic packet broadcasted to a4:83:e7:2b:99:40')}
                  className="px-3 py-1 rounded bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#4edea3]">power_settings_new</span>
                  Send WoL Magic Packet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Audit & Commit Strip */}
        <div className="bg-[#070f19] px-6 py-3 border-t border-[#232a36] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#869397] font-label-sm text-[11px] font-mono">
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>First seen: 28d ago</span>
            <span>•</span>
            <span>
              Pinned by: <strong className="text-[#bcc9cd]">admin@node-01.lab.internal</strong>
            </span>
            <span>•</span>
            <span className="text-[#4edea3]">Infinite Static Lease</span>
          </div>

          <div className="flex items-center gap-2.5">
            {savedSuccess && (
              <span className="text-[#4edea3] text-xs font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span>
                eBPF map updated!
              </span>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] font-label-md text-xs transition-colors"
            >
              Close Inspector
            </button>
            <button
              onClick={handleExportJson}
              className="px-3.5 py-1.5 rounded-lg bg-[#18202b] hover:bg-[#232a36] text-[#dbe3f2] font-label-md text-xs font-mono flex items-center gap-1.5 border border-[#3d494c]/60"
            >
              <span className="material-symbols-outlined text-[15px] text-[#869397]">download</span>
              Export Diagnostic JSON
            </button>
            <button
              onClick={handleSavePolicy}
              className="px-4 py-1.5 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-label-md text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_14px_rgba(6,182,212,0.35)] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              Save Policy Changes & Sync eBPF Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
