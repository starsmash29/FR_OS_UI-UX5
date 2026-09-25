export type AppScreen =
  | 'ddns' // 1. Dynamic DNS Services & FQDN Sync Engine
  | 'auditor-control-plane' // 4. FR_OS Control Plane (Auditor Mode)
  | 'operator-cockpit' // 6. Elevated Privileges Active Cockpit
  | 'vlan10-convergence' // 9. VLAN 10 Convergence Monitoring (+30m Extension)
  | 'lease-expired' // 7. Privilege Lease Expired / Auto-Revocation
  | 'audit-receipt' // 11. Elevation Audit Receipt & State Transition Report
  | 'pdf-cert-sheet1' // 12. PDF Certificate Sheet 1 (Executive Summary)
  | 'pdf-cert-sheet2'; // 13. PDF Certificate Sheet 2 (Hex Memory Trace)

export type ModalType =
  | null
  | 'create-ddns' // 2. Create Dynamic DNS Profile Modal
  | 'device-inspector' // 3. Client Device Inspector
  | 'request-elevation' // 5. Request Elevated Privileges Modal
  | 'extend-lease' // 8. Extend Privilege Lease Window Modal
  | 'revoke-privilege'; // 10. Revoke Elevated Privileges Modal

export type UserRole = 'viewer_readonly' | 'operator_elevated';

export interface DdnsProfile {
  id: string;
  status: 'SYNCD' | 'PAUSED' | 'WARNING';
  hostname: string;
  zoneInfo: string;
  provider: string;
  providerType: string;
  isProxied?: boolean;
  boundUplink: string;
  uplinkColor: 'primary' | 'secondary' | 'tertiary' | 'outline';
  resolvedIp: string;
  ttl: string;
  lastAuditTime: string;
  lastAuditStatus: string;
  lastAuditCode: string;
}

export interface FirewallRule {
  id: string;
  action: 'ALLOW' | 'DROP' | 'INSPECT' | 'PASS FASTPATH';
  name: string;
  description: string;
  protocol: string;
  source: string;
  destination: string;
  hitPackets: string;
  totalBytes: string;
  ttlRemaining?: string;
  direction?: string;
}

export interface AuditLogEntry {
  timestamp: string;
  source: string;
  message: string;
  type?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'outline';
}
