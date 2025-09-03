export type Entity = {
  id: string;
  name: string;
  type: 'Person' | 'Organization' | 'Site';
  tags: string[];
  summary: string;
  keyFacts: string[];
  relationships: { entityName: string; relationship: string }[];
  relatedLinks?: string[];
  provenance?: string;
  accessLevel: 1 | 2 | 3;
};

export type Bot = {
  id: string;
  status: 'Crawling' | 'Idle' | 'Error' | 'Offline';
  targetDomain: string;
  trustScore: number;
  lastActivity: string;
};

export type SystemLogEntry = {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM';
  message: string;
};

export type AuditLogEntry = {
  id: number;
  timestamp: string;
  eventType: string;
  operatorId: string | null;
  details: string;
  signature: string;
};

export type BotJob = {
    id: string;
    operatorId: string;
    initialUrl: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
};

export type BotJobUrl = {
    id: number;
    jobId: string;
    url: string;
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
    depth: number;
};

export type BotJobLog = {
    id: number;
    jobId: string;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
};

export type ExtractedEntityDb = {
    id: string;
    jobId: string;
    name: string;
    type: 'Person' | 'Organization' | 'Site';
    summary: string;
    tags: string;
    keyFacts: string;
    relationships: string;
    relatedLinks: string;
    provenance?: string;
    accessLevel: 1 | 2 | 3;
}
