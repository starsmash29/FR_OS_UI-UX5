import React, { useState } from 'react';

interface CreateDdnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated?: (profile: any) => void;
}

export const CreateDdnsModal: React.FC<CreateDdnsModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated
}) => {
  const [provider, setProvider] = useState<'cloudflare' | 'route53' | 'duckdns' | 'rfc2136' | 'custom_rest'>('cloudflare');
  const [alias, setAlias] = useState('primary-gw-cloudflare');
  const [hostname, setHostname] = useState('vpn.lab.domain.net');
  const [ttl, setTtl] = useState('Auto (60s Default)');
  const [ipv4, setIpv4] = useState(true);
  const [ipv6, setIpv6] = useState(true);
  const [proxyOn, setProxyOn] = useState(true);
  const [apiToken, setApiToken] = useState('cfl_token_9f81a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1');
  const [zoneId, setZoneId] = useState('89f41b9d03429fa2a88e7b1a03e');
  const [showToken, setShowToken] = useState(false);
  const [uplink, setUplink] = useState('WAN1 Primary (eth0 — 198.51.100.2)');
  const [ipMethod, setIpMethod] = useState<'netlink' | 'reflector' | 'stun'>('netlink');
  const [failoverPinning, setFailoverPinning] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(true);
  const [dryRunOutput, setDryRunOutput] = useState<string[]>([
    "RESOLVER: Authoritative query for 'vpn.lab.domain.net' -> Current Live IP: 198.51.100.1",
    "PROPOSED CHANGE: Modify A-Record from 198.51.100.1 to 198.51.100.2 via Cloudflare v4 REST",
    "DNSSEC VERIFY: Chain signature valid for zone 'domain.net' | TTL: 60s | Proxy: ACTIVE (Orange)"
  ]);
  const [isDryRunning, setIsDryRunning] = useState(false);

  if (!isOpen) return null;

  const handleDryRun = () => {
    setIsDryRunning(true);
    setTimeout(() => {
      setIsDryRunning(false);
      const ts = new Date().toISOString().substring(11, 19);
      setDryRunOutput([
        `[${ts}] RESOLVER: Authoritative query for '${hostname}' -> Current Live IP: 198.51.100.1`,
        `[${ts}] PROPOSED CHANGE: Modify A-Record from 198.51.100.1 to 198.51.100.2 via ${provider.toUpperCase()} API`,
        `[${ts}] HANDSHAKE SUCCESS: Zone ID verified. HTTP 200 OK. Ready to commit to inadyn daemon.`
      ]);
    }, 700);
  };

  const handleSave = () => {
    if (onProfileCreated) {
      onProfileCreated({
        hostname,
        provider,
        alias,
        proxyOn,
        uplink
      });
    }
    alert(`DDNS Profile '${hostname}' created & provisioned to kernel daemon!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070f19]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-[#141c27] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] border border-[#232a36] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Radiant Ice Cyan Accent Glow */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4cd7f6]/20 via-[#4cd7f6] to-[#4cd7f6]/20"></div>

        {/* 1. Modal Header */}
        <div className="px-6 py-4 bg-[#070f19] flex items-start justify-between border-b border-[#232a36]">
          <div className="flex items-start gap-4">
            <div className="relative p-2 rounded-xl bg-[#232a36] shrink-0 shadow-inner border border-[#3d494c]/40">
              <img
                alt="FR_OS Sentinel"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WPKRcOXkcZgtJ0SxofeSvq-4XjCZ3kYiWwzevdFqjei30cX5hu2FUKswPX-5iMepGKSoGk7Xf-jJHwM8P-nBZCEOZq2bJY3HR0X94n_tggpvGknSy8r__Xnb0uDTUE7-zTTSUz3VvqUbSEq5056hvwVCWnpuVj_613KyMY5wEpb1YaX4mnGrxqmxc17T9d7MIJ1sRh92OzwudOzbmlNkmz1UFok-yvGfCEMhR7c_gtZgOxN8lUCn_Uf-9o"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-headline-md text-base text-[#dbe3f2] font-semibold tracking-tight">
                  Create Dynamic DNS Profile
                </span>
                <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] uppercase font-bold tracking-wider">
                  DDNS SENTINEL v4.8
                </span>
                <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#232a36] text-[#869397] uppercase font-semibold">
                  RFC 2136 / REST API
                </span>
              </div>
              <p className="font-body-sm text-xs text-[#bcc9cd] max-w-2xl leading-relaxed">
                Provision automated public IP tracking and authoritative FQDN record updates across global DNS providers with failover awareness.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-[#bcc9cd] hover:text-[#dbe3f2] p-1.5 rounded-lg bg-[#232a36]/60 hover:bg-[#232a36] transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#141c27] divide-y divide-[#232a36]/60">
          {/* 2. Provider & Engine Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-xs uppercase tracking-wider text-[#4cd7f6] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                1. Select Authoritative DNS Engine / Provider
              </label>
              <span className="font-label-sm text-[10px] text-[#869397]">
                Provider Handshake Layer: REST / JSON / BIND TSIG
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Cloudflare */}
              <label
                onClick={() => setProvider('cloudflare')}
                className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                  provider === 'cloudflare'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#18202b]/50 border-transparent hover:bg-[#18202b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">cloud_sync</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      provider === 'cloudflare' ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]' : 'bg-[#2d3541]'
                    }`}
                  ></span>
                </div>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">Cloudflare</span>
                <span className="font-label-sm text-[10px] text-[#4cd7f6] mt-0.5">v4 API REST</span>
                <span className="font-body-sm text-[10px] text-[#869397] mt-1.5 leading-tight">
                  Zone API Token & Orange CDN Proxy toggle support
                </span>
              </label>

              {/* AWS Route 53 */}
              <label
                onClick={() => setProvider('route53')}
                className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                  provider === 'route53'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#18202b]/50 border-transparent hover:bg-[#18202b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="material-symbols-outlined text-[#bcc9cd] text-[22px]">public</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      provider === 'route53' ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]' : 'bg-[#2d3541]'
                    }`}
                  ></span>
                </div>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">AWS Route 53</span>
                <span className="font-label-sm text-[10px] text-[#bcc9cd] mt-0.5">ChangeResourceSets</span>
                <span className="font-body-sm text-[10px] text-[#869397] mt-1.5 leading-tight">
                  Hosted Zone IAM Token Dual-Stack A/AAAA
                </span>
              </label>

              {/* DuckDNS */}
              <label
                onClick={() => setProvider('duckdns')}
                className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                  provider === 'duckdns'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#18202b]/50 border-transparent hover:bg-[#18202b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="material-symbols-outlined text-[#4edea3] text-[22px]">bolt</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      provider === 'duckdns' ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]' : 'bg-[#2d3541]'
                    }`}
                  ></span>
                </div>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">DuckDNS</span>
                <span className="font-label-sm text-[10px] text-[#4edea3] mt-0.5">Token Auth HTTP</span>
                <span className="font-body-sm text-[10px] text-[#869397] mt-1.5 leading-tight">
                  Fast lightweight subdomains with token key
                </span>
              </label>

              {/* RFC 2136 BIND */}
              <label
                onClick={() => setProvider('rfc2136')}
                className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                  provider === 'rfc2136'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#18202b]/50 border-transparent hover:bg-[#18202b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="material-symbols-outlined text-[#d0bcff] text-[22px]">dns</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      provider === 'rfc2136' ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]' : 'bg-[#2d3541]'
                    }`}
                  ></span>
                </div>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">RFC 2136 BIND</span>
                <span className="font-label-sm text-[10px] text-[#d0bcff] mt-0.5">TSIG HMAC-SHA256</span>
                <span className="font-body-sm text-[10px] text-[#869397] mt-1.5 leading-tight">
                  Self-hosted authoritative DNS servers
                </span>
              </label>

              {/* Custom Webhook */}
              <label
                onClick={() => setProvider('custom_rest')}
                className={`relative flex flex-col p-3 rounded-xl cursor-pointer transition-all border ${
                  provider === 'custom_rest'
                    ? 'bg-[#18202b] border-[#4cd7f6] shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                    : 'bg-[#18202b]/50 border-transparent hover:bg-[#18202b]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="material-symbols-outlined text-[#bcc9cd] text-[22px]">terminal</span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      provider === 'custom_rest' ? 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]' : 'bg-[#2d3541]'
                    }`}
                  ></span>
                </div>
                <span className="font-headline-sm text-xs text-[#dbe3f2] font-semibold">Custom Webhook</span>
                <span className="font-label-sm text-[10px] text-[#bcc9cd] mt-0.5">REST GET/POST</span>
                <span className="font-body-sm text-[10px] text-[#869397] mt-1.5 leading-tight">
                  User-defined payload & custom auth headers
                </span>
              </label>
            </div>
          </div>

          {/* 3. Hostname & Domain Configuration */}
          <div className="pt-4 space-y-3">
            <label className="font-label-md text-xs uppercase tracking-wider text-[#4cd7f6] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
              2. Hostname & Domain Specification
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Profile Alias */}
              <div className="md:col-span-4 space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd] flex items-center justify-between">
                  <span>PROFILE ALIAS</span>
                  <span className="text-[#869397]">e.g. Identifier</span>
                </span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center focus-within:border-[#4cd7f6]">
                  <input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="bg-transparent text-[#dbe3f2] font-label-md text-xs w-full focus:outline-none"
                    placeholder="alias-name"
                    type="text"
                  />
                </div>
              </div>

              {/* Target Hostname (FQDN) */}
              <div className="md:col-span-5 space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd] flex items-center justify-between">
                  <span>TARGET HOSTNAME (FQDN)</span>
                  <span className="text-[#4edea3] font-mono text-[10px]">Authoritative Zone</span>
                </span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center gap-1.5 focus-within:border-[#4cd7f6]">
                  <span className="material-symbols-outlined text-[#869397] text-[16px]">language</span>
                  <input
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="bg-transparent text-[#4cd7f6] font-label-md text-xs w-full focus:outline-none font-bold font-mono"
                    placeholder="subdomain.example.com"
                    type="text"
                  />
                </div>
              </div>

              {/* TTL Selection */}
              <div className="md:col-span-3 space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd] flex items-center justify-between">
                  <span>TIME TO LIVE (TTL)</span>
                  <span className="text-[#869397]">Propagation</span>
                </span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center justify-between">
                  <select
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    className="bg-transparent text-[#dbe3f2] font-label-md text-xs w-full focus:outline-none appearance-none cursor-pointer"
                  >
                    <option className="bg-[#18202b] text-[#dbe3f2]">Auto (60s Default)</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">120 seconds</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">300 seconds (5m)</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">3600 seconds (1h)</option>
                  </select>
                  <span className="material-symbols-outlined text-[#869397] text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Record Types & Cloudflare Proxy Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Record Types */}
              <div className="p-3 bg-[#18202b] rounded-xl flex items-center justify-between border border-[#232a36]">
                <div>
                  <span className="font-label-md text-xs text-[#dbe3f2] font-semibold block">
                    DNS Record Types Synthesized
                  </span>
                  <span className="font-body-sm text-[11px] text-[#869397]">
                    Select single or dual-stack DNS generation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    onClick={() => setIpv4(!ipv4)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      ipv4 ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#141c27] text-[#869397]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {ipv4 ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="font-label-sm text-[10px] font-bold">IPv4 (A)</span>
                  </label>

                  <label
                    onClick={() => setIpv6(!ipv6)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                      ipv6 ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-[#141c27] text-[#869397]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {ipv6 ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="font-label-sm text-[10px] font-bold">IPv6 (AAAA)</span>
                  </label>
                </div>
              </div>

              {/* Cloudflare Orange Cloud Proxy Toggle */}
              <div className="p-3 bg-[#18202b] rounded-xl flex items-center justify-between border border-[#232a36]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#f6821f]/20 flex items-center justify-center text-[#f6821f]">
                    <span className="material-symbols-outlined text-[20px]">filter_drama</span>
                  </div>
                  <div>
                    <span className="font-label-md text-xs text-[#dbe3f2] font-semibold block">
                      Cloudflare CDN Proxy (Orange Cloud)
                    </span>
                    <span className="font-body-sm text-[11px] text-[#869397]">
                      Mask origin WAN IP behind Cloudflare edge
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setProxyOn(!proxyOn)}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <div
                    className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${
                      proxyOn
                        ? 'bg-[#f6821f] justify-end shadow-[0_0_10px_rgba(246,130,31,0.4)]'
                        : 'bg-[#2d3541] justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-[#070f19] rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Authentication & Credentials Vault */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-xs uppercase tracking-wider text-[#4cd7f6] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                3. Authentication & Credentials Vault
              </label>
              <div className="flex items-center bg-[#070f19] p-0.5 rounded-lg border border-[#232a36]">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#232a36] text-[#4cd7f6] font-label-sm text-[10px] font-semibold"
                >
                  Enter New Secret
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded text-[#869397] hover:text-[#dbe3f2] font-label-sm text-[10px]"
                >
                  Use Vault Token
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* API Token */}
              <div className="md:col-span-7 space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd] flex items-center justify-between">
                  <span>CLOUDFLARE API TOKEN (SCOPED: ZONE:DNS:EDIT)</span>
                  <span className="text-[#869397]">Encrypted in Kernel Keyring</span>
                </span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center justify-between focus-within:border-[#4cd7f6]">
                  <input
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    type={showToken ? 'text' : 'password'}
                    className="bg-transparent text-[#dbe3f2] font-label-md text-xs w-full focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="text-[#869397] hover:text-[#dbe3f2] ml-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showToken ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Zone ID */}
              <div className="md:col-span-5 space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd] flex items-center justify-between">
                  <span>ZONE IDENTIFIER (ZONE ID)</span>
                  <button
                    type="button"
                    onClick={() => setZoneId('89f41b9d03429fa2a88e7b1a03e')}
                    className="text-[#4cd7f6] hover:underline text-[10px] font-mono"
                  >
                    Auto-Detect
                  </button>
                </span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center justify-between focus-within:border-[#4cd7f6]">
                  <input
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    type="text"
                    className="bg-transparent text-[#dbe3f2] font-label-md text-xs w-full focus:outline-none font-mono"
                  />
                  <span className="material-symbols-outlined text-[#4edea3] text-[18px]" title="Valid 32-char hex">
                    check_circle
                  </span>
                </div>
              </div>
            </div>

            {/* Handshake Verification Banner */}
            <div className="p-3 bg-[#00a572]/10 rounded-xl border border-[#00a572]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">verified</span>
                <div>
                  <span className="font-label-md text-xs text-[#4edea3] font-bold">API Handshake Verified</span>
                  <span className="font-body-sm text-xs text-[#bcc9cd] ml-2">
                    HTTP 200: Token valid for Zone <span className="text-[#dbe3f2] font-mono">lab.domain.net</span> (Expires: Never)
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert('Handshake verified successfully with Cloudflare API v4!')}
                className="bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] font-label-sm text-[11px] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span> Re-Test Handshake
              </button>
            </div>
          </div>

          {/* 5. IP Ingestion & Interface Binding */}
          <div className="pt-4 space-y-3">
            <label className="font-label-md text-xs uppercase tracking-wider text-[#4cd7f6] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
              4. IP Ingestion Source & Interface Binding
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Uplink Binding */}
              <div className="space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd]">PHYSICAL UPLINK BINDING</span>
                <div className="bg-[#070f19] px-3 py-2 rounded-lg border border-[#232a36] flex items-center justify-between">
                  <select
                    value={uplink}
                    onChange={(e) => setUplink(e.target.value)}
                    className="bg-transparent text-[#dbe3f2] font-label-md text-xs w-full focus:outline-none appearance-none cursor-pointer font-mono"
                  >
                    <option className="bg-[#18202b] text-[#dbe3f2]">WAN1 Primary (eth0 — 198.51.100.2)</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">WAN2 Backup (eth1 — 203.0.113.88)</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">Active Default Gateway (Failover Dynamic)</option>
                    <option className="bg-[#18202b] text-[#dbe3f2]">Specific VPN / Tunnel Interface (wg0)</option>
                  </select>
                  <span className="material-symbols-outlined text-[#869397] text-[16px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* IP Discovery Mechanism */}
              <div className="space-y-1">
                <span className="font-label-sm text-[10px] text-[#bcc9cd]">IP DISCOVERY MECHANISM</span>
                <div className="bg-[#070f19] p-1 rounded-lg border border-[#232a36] flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => setIpMethod('netlink')}
                    className={`flex-1 py-1 px-1 rounded text-center font-label-sm text-[11px] font-semibold transition-colors ${
                      ipMethod === 'netlink' ? 'bg-[#18202b] text-[#4cd7f6]' : 'text-[#869397] hover:text-[#dbe3f2]'
                    }`}
                  >
                    Kernel Netlink
                  </button>
                  <button
                    type="button"
                    onClick={() => setIpMethod('reflector')}
                    className={`flex-1 py-1 px-1 rounded text-center font-label-sm text-[11px] font-semibold transition-colors ${
                      ipMethod === 'reflector' ? 'bg-[#18202b] text-[#4cd7f6]' : 'text-[#869397] hover:text-[#dbe3f2]'
                    }`}
                  >
                    HTTP Reflector
                  </button>
                  <button
                    type="button"
                    onClick={() => setIpMethod('stun')}
                    className={`flex-1 py-1 px-1 rounded text-center font-label-sm text-[11px] font-semibold transition-colors ${
                      ipMethod === 'stun' ? 'bg-[#18202b] text-[#4cd7f6]' : 'text-[#869397] hover:text-[#dbe3f2]'
                    }`}
                  >
                    STUN Server
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Policies */}
            <div className="space-y-2 pt-1">
              <label
                onClick={() => setFailoverPinning(!failoverPinning)}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#18202b] hover:bg-[#232a36] transition-colors cursor-pointer border border-[#232a36]"
              >
                <input
                  type="checkbox"
                  checked={failoverPinning}
                  onChange={(e) => setFailoverPinning(e.target.checked)}
                  className="mt-0.5 accent-[#4cd7f6] cursor-pointer"
                />
                <div>
                  <span className="font-label-md text-xs text-[#dbe3f2] font-semibold flex items-center gap-1.5">
                    Multi-WAN Failover Pinning
                    <span className="font-label-sm text-[10px] px-1.5 py-0.2 rounded bg-[#4cd7f6]/10 text-[#4cd7f6]">
                      Fast Re-route (≤2s)
                    </span>
                  </span>
                  <span className="font-body-sm text-[11px] text-[#869397]">
                    Automatically re-point this hostname to WAN2 if WAN1 gateway ping watchdog trips.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setForceUpdate(!forceUpdate)}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#18202b] hover:bg-[#232a36] transition-colors cursor-pointer border border-[#232a36]"
              >
                <input
                  type="checkbox"
                  checked={forceUpdate}
                  onChange={(e) => setForceUpdate(e.target.checked)}
                  className="mt-0.5 accent-[#4cd7f6] cursor-pointer"
                />
                <div>
                  <span className="font-label-md text-xs text-[#dbe3f2] font-semibold">Force Update Period</span>
                  <span className="font-body-sm text-[11px] text-[#869397]">
                    Re-push and verify DNS record every 24 hours even if local kernel IP state remains unchanged.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 6. Pre-flight Verification & Dry-run Preview */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#869397] font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">terminal</span>
                Pre-flight Engine Inspection & Live Query
              </span>
              <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-bold">
                READY FOR PROVISIONING
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#070f19] font-mono text-[11px] leading-5 text-[#bcc9cd] overflow-x-auto border border-[#18202b]">
              {dryRunOutput.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[#4cd7f6] font-bold">[{idx + 1}]</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Modal Footer */}
        <div className="px-6 py-4 bg-[#070f19] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#232a36]">
          <div className="flex items-center gap-2 text-[#869397] font-label-sm text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span>
              Kernel Daemon: <span className="text-[#dbe3f2] font-semibold">Inadyn 2.10</span> live re-hash enabled
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#232a36] hover:bg-[#323a46] text-[#dbe3f2] font-label-md text-xs font-semibold transition-all"
              type="button"
            >
              Cancel & Discard
            </button>
            <button
              onClick={handleDryRun}
              disabled={isDryRunning}
              className="px-4 py-2 rounded-lg bg-[#18202b] hover:bg-[#232a36] text-[#4cd7f6] font-label-md text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#3d494c]/50"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isDryRunning ? 'animate-spin' : ''}`}>
                play_arrow
              </span>
              <span>{isDryRunning ? 'Querying...' : 'Dry-Run Handshake'}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-label-md text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_16px_rgba(6,182,212,0.4)]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Save & Provision Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
