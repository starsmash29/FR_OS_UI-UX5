import React, { useState, useEffect } from 'react';
import { DdnsProfile, ModalType } from '../types';

interface DdnsViewProps {
  onOpenModal: (modal: ModalType) => void;
}

const INITIAL_PROFILES: DdnsProfile[] = [
  {
    id: 'cf-gw',
    status: 'SYNCD',
    hostname: 'gateway.lab.domain.net',
    zoneInfo: 'A-Record • Zone: 89f41b9...',
    provider: 'Cloudflare v4',
    providerType: 'Cloudflare v4',
    isProxied: true,
    boundUplink: 'WAN1 [eth0]',
    uplinkColor: 'primary',
    resolvedIp: '198.51.100.2',
    ttl: 'TTL 120s',
    lastAuditTime: '14:18:22 UTC',
    lastAuditStatus: '200 OK (verified)',
    lastAuditCode: '200'
  },
  {
    id: 'aws-vpn',
    status: 'SYNCD',
    hostname: 'vpn-telework.homelab.org',
    zoneInfo: 'A + AAAA • HostedZone: Z0194883',
    provider: 'AWS Route53',
    providerType: 'AWS Route53',
    isProxied: false,
    boundUplink: 'WAN1 [eth0]',
    uplinkColor: 'primary',
    resolvedIp: '198.51.100.2',
    ttl: 'TTL 60s',
    lastAuditTime: '14:10:44 UTC',
    lastAuditStatus: 'TX_ID: 9bf2-410a',
    lastAuditCode: '200'
  },
  {
    id: 'cf-backup',
    status: 'SYNCD',
    hostname: 'backup-wan.lab.domain.net',
    zoneInfo: 'A-Record • Zone: 89f41b9...',
    provider: 'Cloudflare v4 (DNS Only)',
    providerType: 'Cloudflare v4',
    isProxied: false,
    boundUplink: 'WAN2 [eth1]',
    uplinkColor: 'tertiary',
    resolvedIp: '203.0.113.88',
    ttl: 'TTL 300s',
    lastAuditTime: '13:45:11 UTC',
    lastAuditStatus: '200 OK',
    lastAuditCode: '200'
  },
  {
    id: 'duck-iot',
    status: 'SYNCD',
    hostname: 'iot-tunnel.duckdns.org',
    zoneInfo: 'Dynamic Token Bound',
    provider: 'DuckDNS API',
    providerType: 'DuckDNS',
    isProxied: false,
    boundUplink: 'WAN1 [eth0]',
    uplinkColor: 'primary',
    resolvedIp: '198.51.100.2',
    ttl: 'TTL 60s',
    lastAuditTime: '14:15:02 UTC',
    lastAuditStatus: 'HTTP 200 OK',
    lastAuditCode: '200'
  },
  {
    id: 'edge-metrics',
    status: 'PAUSED',
    hostname: 'metrics-ingest.edge.io',
    zoneInfo: 'Custom Endpoint Webhook',
    provider: 'REST / JSON POST',
    providerType: 'Custom REST',
    isProxied: false,
    boundUplink: 'Global Egress',
    uplinkColor: 'outline',
    resolvedIp: 'Suspended',
    ttl: '',
    lastAuditTime: '12:00:15 UTC',
    lastAuditStatus: 'Disabled by admin',
    lastAuditCode: 'PAUSED'
  }
];

export const DdnsView: React.FC<DdnsViewProps> = ({ onOpenModal }) => {
  const [profiles, setProfiles] = useState<DdnsProfile[]>(INITIAL_PROFILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'syncd' | 'paused'>('all');
  const [secondsLeft, setSecondsLeft] = useState(252);
  const [detectionMode, setDetectionMode] = useState<'netlink' | 'reflector' | 'stun'>('netlink');
  const [pollInterval, setPollInterval] = useState(300);
  const [failoverTrigger, setFailoverTrigger] = useState(true);
  const [forceUpdatePeriod, setForceUpdatePeriod] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const [logs, setLogs] = useState<string[]>([
    '[14:18:18] inadyn[2841]: Started background daemon worker PID 2841',
    '[14:18:20] inadyn[2841]: Checking public IP on interface eth0 via Netlink API...',
    '[14:18:21] inadyn[2841]: Detected IP 198.51.100.2 matches cached WAN1 state.',
    "[14:18:22] cloudflare_api: Verified DNS A-record 'gateway.lab.domain.net' -> 198.51.100.2 [No change needed, cached 180s].",
    "[14:15:02] duckdns: Heartbeat sent for 'iot-tunnel.duckdns.org' -> HTTP 200 SUCCESS.",
    '[14:10:44] route53: ChangeResourceRecordSets committed (TX_ID: 9bf2-410a, Status: INSYNC).',
    '[14:05:00] stun_client: STUN UDP ping to stun.l.google.com:19302 verified NAT Type: Full Cone.',
    '[14:00:12] netlink_watcher: eth1 (WAN2) carrier up, IP assigned: 203.0.113.88.'
  ]);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleForceRefresh = () => {
    setIsRefreshing(true);
    const ts = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev,
      `[${ts}] inadyn[2841]: Triggering immediate forced sync for all active profiles...`
    ]);

    setTimeout(() => {
      setIsRefreshing(false);
      setLogs((prev) => [
        ...prev,
        `[${ts}] daemon: 4 of 4 synchronized profiles validated (0 errors). Authoritative resolvers verified.`
      ]);
    }, 800);
  };

  const handleSyncRow = (hostname: string) => {
    const ts = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev,
      `[${ts}] worker: Force sync requested for '${hostname}' -> HTTP 200 SUCCESS`
    ]);
  };

  const handleSavePreferences = () => {
    setSaveToast(true);
    const ts = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev,
      `[${ts}] config: DDNS engine preferences saved. Method: ${detectionMode.toUpperCase()}, Interval: ${pollInterval}s, Failover Trigger: ${failoverTrigger}`
    ]);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.boundUplink.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'syncd') return p.status === 'SYNCD';
    if (filterTab === 'paused') return p.status === 'PAUSED' || p.status === 'WARNING';
    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Top Breadcrumb & Executive Control Bar */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-label-sm text-[11px]">
              <span className="uppercase tracking-widest text-[#869397]">Network</span>
              <span className="text-[#3d494c]">/</span>
              <span className="uppercase tracking-wider text-[#4cd7f6] font-bold">
                Dynamic DNS (DDNS) Client & Domain Sync
              </span>
            </div>
            <h1 className="font-headline-xl text-3xl text-[#dbe3f2] tracking-tight">
              Dynamic DNS Services & FQDN Sync Engine
            </h1>
            <p className="font-body-md text-xs text-[#bcc9cd] max-w-4xl leading-relaxed">
              Automated public IPv4/IPv6 tracking, multi-WAN interface binding, Cloudflare v4 proxy toggling, Route53 Zone synchronization, and deterministic TTL verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#232a36] text-[#dbe3f2] hover:text-[#4cd7f6] hover:bg-[#323a46] transition-colors font-label-md text-xs border border-[#3d494c]/50 shadow-sm"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isRefreshing ? 'Syncing...' : 'Force Refresh All'}</span>
            </button>

            <button
              onClick={() => alert('API Tokens Vault: 3 Active Secrets stored in kernel keyring (Ed25519 sealed).')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#232a36] text-[#dbe3f2] hover:text-[#4edea3] hover:bg-[#323a46] transition-colors font-label-md text-xs border border-[#3d494c]/50 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span>API Tokens Vault</span>
            </button>

            <button
              onClick={() => onOpenModal('create-ddns')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#06b6d4] text-[#003640] font-bold hover:bg-[#4cd7f6] transition-all font-label-md text-xs shadow-md shadow-[#06b6d4]/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ Add DDNS Profile</span>
            </button>
          </div>
        </div>

        {/* Active Daemon State Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-[#070f19] p-2 rounded-xl border border-[#18202b]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00a572]/20 text-[#4edea3] font-label-sm text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="tracking-wide uppercase font-bold">DDNS Daemon Active (inadyn/ddclient)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18202b] text-[#bcc9cd] font-label-sm text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">schedule</span>
            <span>NEXT POLL:</span>
            <span className="text-[#4cd7f6] font-bold font-mono">{formatCountdown(secondsLeft)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18202b] text-[#bcc9cd] font-label-sm text-[11px]">
            <span className="text-[#869397] uppercase">WAN1 (eth0):</span>
            <span className="text-[#dbe3f2] font-semibold font-mono">198.51.100.2</span>
            <span className="text-[#4edea3]">[Active Primary]</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18202b] text-[#bcc9cd] font-label-sm text-[11px]">
            <span className="text-[#869397] uppercase">WAN2 (eth1):</span>
            <span className="text-[#dbe3f2] font-semibold font-mono">203.0.113.88</span>
            <span className="text-[#d0bcff]">[Standby Backup]</span>
          </div>

          <div className="ml-auto hidden xl:flex items-center gap-1.5 text-[#869397] font-label-sm text-[11px] pr-2">
            <span>RESOLVER:</span>
            <span className="text-[#dbe3f2] font-bold font-mono">1.1.1.1 (DoT/853)</span>
          </div>
        </div>
      </section>

      {/* KPI Telemetry Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
              Configured Profiles
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">dns</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-metric-display text-2xl text-[#4cd7f6]">4</span>
            <span className="font-headline-md text-base text-[#bcc9cd]">/ 5 Total</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#bcc9cd]">
            <span>Cloudflare, Route53, DuckDNS</span>
            <span className="px-1.5 py-0.5 rounded bg-[#18202b] text-[#869397] font-label-sm text-[10px]">
              1 Paused
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
              Last Address Sync
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">verified</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-metric-display text-2xl text-[#4edea3]">42s ago</span>
            <span className="px-1.5 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-label-sm text-[10px]">
              200 OK
            </span>
          </div>
          <div className="text-xs text-[#bcc9cd] truncate">
            gate.lab.domain.net → <span className="text-[#dbe3f2] font-semibold font-mono">198.51.100.2</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
              Discovery Source
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">router</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg text-lg text-[#dbe3f2]">Interface + STUN</span>
          </div>
          <div className="text-xs text-[#bcc9cd] truncate">
            Fallback: <span className="text-[#4cd7f6] font-mono">checkip.amazonaws.com</span> (TLS 1.3)
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#869397] font-semibold">
              Multi-WAN Pinning
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#d0bcff]">alt_route</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="font-headline-lg text-lg text-[#4edea3]">Failover Aware</span>
          </div>
          <div className="text-xs text-[#bcc9cd]">
            Auto-repoints records if WAN1 drops to WAN2
          </div>
        </div>
      </section>

      {/* Interactive DDNS Profiles Manager Table */}
      <section className="flex flex-col rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm overflow-hidden">
        {/* Section Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#18202b]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">domain_verification</span>
            <div>
              <h2 className="font-headline-sm text-sm text-[#dbe3f2] font-semibold">
                Configured DDNS Hostnames & Provider Profiles
              </h2>
              <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                Real-time binding and authoritative verification engine
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Bar */}
            <div className="flex items-center bg-[#070f19] px-2.5 py-1.5 rounded-lg text-[#bcc9cd] border border-[#232a36]">
              <span className="material-symbols-outlined text-[16px] text-[#869397]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none px-2 font-body-sm text-xs text-[#dbe3f2] placeholder:text-[#869397] w-48 sm:w-60"
                placeholder="Filter hostname, provider, tag..."
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#869397] hover:text-[#dbe3f2]"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#070f19] border border-[#232a36]">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded font-label-sm text-xs transition-colors ${
                  filterTab === 'all'
                    ? 'bg-[#232a36] text-[#4cd7f6] font-bold'
                    : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
                }`}
                type="button"
              >
                All (5)
              </button>
              <button
                onClick={() => setFilterTab('syncd')}
                className={`px-2.5 py-1 rounded font-label-sm text-xs transition-colors ${
                  filterTab === 'syncd'
                    ? 'bg-[#232a36] text-[#4cd7f6] font-bold'
                    : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
                }`}
                type="button"
              >
                Synchronized (4)
              </button>
              <button
                onClick={() => setFilterTab('paused')}
                className={`px-2.5 py-1 rounded font-label-sm text-xs transition-colors ${
                  filterTab === 'paused'
                    ? 'bg-[#232a36] text-[#4cd7f6] font-bold'
                    : 'text-[#bcc9cd] hover:text-[#dbe3f2]'
                }`}
                type="button"
              >
                Warning / Paused (1)
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-md text-xs">
            <thead className="bg-[#232a36] font-label-sm text-[10px] text-[#869397] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Hostname / FQDN</th>
                <th className="py-2.5 px-4">Provider & Engine</th>
                <th className="py-2.5 px-4">Bound Uplink</th>
                <th className="py-2.5 px-4 text-center">Resolved IP vs Target</th>
                <th className="py-2.5 px-4 text-right">Last Audit / Verified</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202b] text-[#dbe3f2]">
              {filteredProfiles.map((profile) => (
                <tr
                  key={profile.id}
                  className={`hover:bg-[#18202b] transition-colors group ${
                    profile.status === 'PAUSED' ? 'opacity-75' : ''
                  }`}
                >
                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {profile.status === 'SYNCD' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-label-sm text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                        SYNCD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#232a36] text-[#869397] font-label-sm text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#869397]"></span>
                        PAUSED
                      </span>
                    )}
                  </td>

                  {/* Hostname / FQDN */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#dbe3f2] tracking-tight group-hover:text-[#4cd7f6] transition-colors font-mono">
                        {profile.hostname}
                      </span>
                      <span className="text-[11px] text-[#bcc9cd]">{profile.zoneInfo}</span>
                    </div>
                  </td>

                  {/* Provider & Engine */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#232a36] text-[#4cd7f6] font-label-sm text-[10px] font-mono">
                        {profile.provider}
                      </span>
                      {profile.isProxied && (
                        <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/20 text-[#4cd7f6] font-label-sm text-[10px] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">cloud_done</span> Proxy On
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Bound Uplink */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          profile.uplinkColor === 'primary'
                            ? 'bg-[#4cd7f6]'
                            : profile.uplinkColor === 'tertiary'
                            ? 'bg-[#d0bcff]'
                            : 'bg-[#869397]'
                        }`}
                      ></span>
                      <span className="font-semibold text-[#dbe3f2] font-mono">{profile.boundUplink}</span>
                    </div>
                  </td>

                  {/* Resolved IP */}
                  <td className="py-3 px-4 text-center font-label-sm text-xs whitespace-nowrap">
                    {profile.status === 'SYNCD' ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#070f19] border border-[#232a36]">
                        <span className="text-[#dbe3f2] font-mono">{profile.resolvedIp}</span>
                        <span className="material-symbols-outlined text-[14px] text-[#4edea3]">check_circle</span>
                        <span className="text-[#869397] font-mono text-[10px]">{profile.ttl}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#070f19] text-[#869397]">
                        <span>Suspended</span>
                        <span className="material-symbols-outlined text-[14px]">pause_circle</span>
                      </div>
                    )}
                  </td>

                  {/* Last Audit */}
                  <td className="py-3 px-4 text-right font-label-sm text-xs whitespace-nowrap text-[#bcc9cd]">
                    <div className="font-mono">{profile.lastAuditTime}</div>
                    <div
                      className={`font-semibold text-[11px] ${
                        profile.status === 'SYNCD' ? 'text-[#4edea3]' : 'text-[#869397]'
                      }`}
                    >
                      {profile.lastAuditStatus}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleSyncRow(profile.hostname)}
                        className="p-1 rounded hover:bg-[#232a36] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors"
                        title="Sync now"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">sync</span>
                      </button>
                      <button
                        onClick={() => onOpenModal('create-ddns')}
                        className="p-1 rounded hover:bg-[#232a36] text-[#bcc9cd] hover:text-[#dbe3f2] transition-colors"
                        title="Configure Profile"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                      </button>
                      <button
                        onClick={() => {
                          const ts = new Date().toISOString().substring(11, 19);
                          setLogs((prev) => [
                            ...prev,
                            `[${ts}] inspect: Opened audit history for ${profile.hostname}`
                          ]);
                        }}
                        className="p-1 rounded hover:bg-[#232a36] text-[#bcc9cd] hover:text-[#dbe3f2] transition-colors"
                        title="View Log"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Split Operational Panel: Strategy Configuration & Live Audit Terminal */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Strategy Config (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col p-4 rounded-xl bg-[#141c27] border border-[#232a36] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#232a36]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">tune</span>
              <h3 className="font-headline-sm text-sm text-[#dbe3f2] font-semibold">
                Public IP Detection Strategy
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#18202b] text-[#4cd7f6] font-label-sm text-[10px] uppercase font-bold">
              Engine Config
            </span>
          </div>

          {/* Detection Method Radio Group */}
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-[10px] text-[#869397] uppercase font-semibold">
              Primary Address Source
            </label>

            <label
              onClick={() => setDetectionMode('netlink')}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                detectionMode === 'netlink'
                  ? 'bg-[#18202b] border-[#4cd7f6]/40'
                  : 'bg-[#18202b]/60 border-transparent hover:bg-[#18202b]'
              }`}
            >
              <input
                type="radio"
                name="detection_mode"
                checked={detectionMode === 'netlink'}
                onChange={() => setDetectionMode('netlink')}
                className="mt-0.5 accent-[#4cd7f6]"
              />
              <div className="flex flex-col">
                <span className="font-body-md text-xs text-[#dbe3f2] font-semibold">
                  Direct Netlink Interface Polling
                </span>
                <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                  Extracts public IPv4/v6 from eth0 / eth1 sockets (Zero latency, no remote dependency).
                </span>
              </div>
            </label>

            <label
              onClick={() => setDetectionMode('reflector')}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                detectionMode === 'reflector'
                  ? 'bg-[#18202b] border-[#4cd7f6]/40'
                  : 'bg-[#18202b]/60 border-transparent hover:bg-[#18202b]'
              }`}
            >
              <input
                type="radio"
                name="detection_mode"
                checked={detectionMode === 'reflector'}
                onChange={() => setDetectionMode('reflector')}
                className="mt-0.5 accent-[#4cd7f6]"
              />
              <div className="flex flex-col">
                <span className="font-body-md text-xs text-[#dbe3f2] font-semibold">
                  External HTTPS Reflectors (Round-Robin)
                </span>
                <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                  Queries Cloudflare trace • checkip.amazonaws.com • icanhazip.com via TLS 1.3.
                </span>
              </div>
            </label>

            <label
              onClick={() => setDetectionMode('stun')}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                detectionMode === 'stun'
                  ? 'bg-[#18202b] border-[#4cd7f6]/40'
                  : 'bg-[#18202b]/60 border-transparent hover:bg-[#18202b]'
              }`}
            >
              <input
                type="radio"
                name="detection_mode"
                checked={detectionMode === 'stun'}
                onChange={() => setDetectionMode('stun')}
                className="mt-0.5 accent-[#4cd7f6]"
              />
              <div className="flex flex-col">
                <span className="font-body-md text-xs text-[#dbe3f2] font-semibold">
                  STUN UDP Transversal
                </span>
                <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                  stun.l.google.com:19302 (Ideal behind Carrier-Grade NAT/CGNAT detection).
                </span>
              </div>
            </label>
          </div>

          {/* Polling Interval & Failover Controls */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-[#869397] uppercase font-semibold">
                  Polling Interval
                </span>
                <span className="font-label-sm text-xs text-[#4cd7f6] font-bold font-mono">
                  {Math.round(pollInterval / 60)} min ({pollInterval}s)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={pollInterval}
                onChange={(e) => setPollInterval(Number(e.target.value))}
                className="w-full accent-[#4cd7f6] cursor-pointer"
              />
              <div className="flex justify-between font-label-sm text-[10px] text-[#869397]">
                <span>1m</span>
                <span>5m</span>
                <span>15m</span>
                <span>30m</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#18202b]">
              <div className="flex flex-col pr-2">
                <span className="font-body-md text-xs text-[#dbe3f2] font-semibold">
                  Multi-WAN Failover Trigger
                </span>
                <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                  Instantly push DDNS updates upon WAN gateway state transitions.
                </span>
              </div>
              <input
                type="checkbox"
                checked={failoverTrigger}
                onChange={(e) => setFailoverTrigger(e.target.checked)}
                className="w-4 h-4 accent-[#4cd7f6] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#18202b]">
              <div className="flex flex-col pr-2">
                <span className="font-body-md text-xs text-[#dbe3f2] font-semibold">
                  Force Update Period
                </span>
                <span className="font-body-sm text-[11px] text-[#bcc9cd]">
                  Send refresh every 24h even if IP is unchanged (prevent provider purge).
                </span>
              </div>
              <input
                type="checkbox"
                checked={forceUpdatePeriod}
                onChange={(e) => setForceUpdatePeriod(e.target.checked)}
                className="w-4 h-4 accent-[#4cd7f6] cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saveToast ? (
              <span className="text-[#4edea3] font-label-sm text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Saved to Kernel daemon!
              </span>
            ) : (
              <span></span>
            )}
            <button
              onClick={handleSavePreferences}
              className="px-4 py-1.5 rounded-lg bg-[#06b6d4] text-[#003640] font-bold hover:bg-[#4cd7f6] transition-all font-label-md text-xs shadow-md"
              type="button"
            >
              Save Engine Preferences
            </button>
          </div>
        </div>

        {/* Right Column: Live Audit Terminal (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl bg-[#070f19] border border-[#18202b] shadow-sm overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#141c27] border-b border-[#232a36]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
              <span className="font-label-sm text-[11px] text-[#dbe3f2] font-bold ml-2 uppercase tracking-wider">
                Live DDNS Update & Resolver Audit Console
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-label-sm text-[10px] text-[#4edea3] uppercase font-semibold">
                Stream Live
              </span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-4 font-label-sm text-[11px] space-y-1.5 overflow-y-auto max-h-80 select-text leading-relaxed font-mono">
            {logs.map((log, index) => {
              const isInfo = log.includes('inadyn');
              const isCf = log.includes('cloudflare');
              const isDuck = log.includes('duckdns');
              const isRoute = log.includes('route53');
              const isNetlink = log.includes('netlink');

              return (
                <div key={index} className="text-[#bcc9cd]">
                  {isInfo && <span className="text-[#4cd7f6]">{log}</span>}
                  {isCf && <span className="text-[#4edea3]">{log}</span>}
                  {isDuck && <span className="text-[#4edea3]">{log}</span>}
                  {isRoute && <span className="text-[#d0bcff]">{log}</span>}
                  {isNetlink && <span className="text-[#acedff]">{log}</span>}
                  {!isInfo && !isCf && !isDuck && !isRoute && !isNetlink && <span>{log}</span>}
                </div>
              );
            })}
          </div>

          {/* Terminal Footer Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#18202b] border-t border-[#232a36] font-label-sm text-[10px] text-[#869397]">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="material-symbols-outlined text-[14px]">folder_open</span>
              <span>
                Source: <span className="text-[#dbe3f2]">/var/log/ddns.log</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setLogs(['[Console buffer cleared by operator - listening for socket events...]'])
                }
                className="text-[#bcc9cd] hover:text-[#dbe3f2] transition-colors"
                type="button"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ddns-audit-${Date.now()}.log`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-[#4cd7f6] hover:text-[#acedff] transition-colors flex items-center gap-0.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">download</span>
                Download Full Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Notes & Compliance Strip */}
      <section className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#141c27] border border-[#232a36] text-[#869397] font-label-sm text-[10px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">verified_user</span>
          <span>
            FR_OS DDNS Engine v4.8 • RFC 2136 Dynamic DNS & Provider REST API Compliant • Async Netlink Socket Forwarding
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#bcc9cd]">
          <span>
            DNS Security: <span className="text-[#4edea3] font-semibold">DNSSEC Validated</span>
          </span>
          <span>
            Failover Latency: <span className="text-[#4cd7f6] font-semibold">&lt; 1.8s</span>
          </span>
        </div>
      </section>
    </div>
  );
};
