import { Database, User, Building, Globe, Tag } from 'lucide-react';
import { Entity } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';

const entities: Entity[] = [
  {
    id: 'E-001',
    name: 'John "Ghost" Doe',
    type: 'Person',
    tags: ['operative', 'classified', 'high-risk'],
    description:
      'Highly skilled operative with a redacted past. Specialized in covert intelligence gathering and direct action. Provenance of most data points is classified under directive 7G.',
    accessLevel: 3,
  },
  {
    id: 'E-002',
    name: 'Aperture Science',
    type: 'Organization',
    tags: ['research', 'tech', 'defunct'],
    description:
      'Defunct technology conglomerate known for advanced, often dangerous, research. Primary data sourced from public records and leaked internal memos.',
    accessLevel: 1,
  },
  {
    id: 'E-003',
    name: 'Site-19',
    type: 'Site',
    tags: ['secure-facility', 'anomalous'],
    description:
      'A secure containment facility for anomalous objects. Location is classified. Information cross-referenced from multiple intelligence agency reports.',
    accessLevel: 3,
  },
];

const TypeIcon = ({ type }: { type: Entity['type'] }) => {
  const icon = {
    Person: <User className="h-4 w-4" />,
    Organization: <Building className="h-4 w-4" />,
    Site: <Globe className="h-4 w-4" />,
  }[type];
  return <span className="text-accent/80">{icon}</span>;
};

const AccessLevelBadge = ({ level }: {level: Entity['accessLevel']}) => {
    const config = {
        1: { text: "LVL 1", className: "border-green-500/50 text-green-500" },
        2: { text: "LVL 2", className: "border-yellow-500/50 text-yellow-500" },
        3: { text: "LVL 3", className: "border-red-500/50 text-red-500" },
    }[level];
    return <Badge variant="outline" className={config.className}>{config.text}</Badge>
}

export function EntityDatabase() {
  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="py-2 px-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-accent" />
          <CardTitle className="text-base text-accent">ENTITY DB</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-2 py-0 overflow-y-auto">
        <Accordion type="single" collapsible className="w-full">
          {entities.map((entity) => (
            <AccordionItem key={entity.id} value={entity.id} className="border-accent/10">
              <AccordionTrigger className="hover:no-underline hover:bg-accent/10 rounded-md px-2 py-1.5 text-sm">
                <div className="flex items-center gap-3">
                  <TypeIcon type={entity.type} />
                  <span>{entity.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 text-xs space-y-2 text-muted-foreground bg-background/50 rounded-b-md">
                <p>{entity.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-3 w-3 text-accent/50"/>
                      {entity.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/80 text-foreground/80 text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <AccessLevelBadge level={entity.accessLevel} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
