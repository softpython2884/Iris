export type Entity = {
  id: string;
  name: string;
  type: 'Person' | 'Organization' | 'Site';
  tags: string[];
  description: string;
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
