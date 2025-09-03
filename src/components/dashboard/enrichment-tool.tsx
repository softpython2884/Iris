"use client";

import { useState, useTransition } from 'react';
import { BrainCircuit, Loader, Wand2 } from 'lucide-react';
import {
  automatedEntityEnrichment,
  AutomatedEntityEnrichmentOutput,
} from '@/ai/flows/automated-entity-enrichment';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export function EnrichmentTool() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AutomatedEntityEnrichmentOutput | null>(null);
  const [text, setText] = useState('New intel just came in: John Doe, former CEO of OmniCorp, was spotted near the old Aperture Science facility. We need to verify this.');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const { output, error } = await automatedEntityEnrichment({ text });
      if (error) {
        console.error(error);
        toast({
          title: "Enrichment Failed",
          description: "Could not process the text. Please check system logs.",
          variant: "destructive",
        })
        return;
      }
      setResult(output);
    });
  };

  return (
    <Card className="flex-1 flex flex-col border-primary/50 bg-primary/10">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg text-accent">AUTOMATED ENRICHMENT</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Process raw text to perform NER and link entities.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            placeholder="Paste raw text here..."
            className="flex-1 bg-background/50 h-32 resize-none border-accent/20"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" disabled={isPending || !text} className="bg-accent text-accent-foreground hover:bg-accent/80">
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Enrich Text
          </Button>
        </form>
        <div className="flex-1 overflow-auto rounded-md border border-accent/10 bg-background/50 p-4">
          <h3 className="text-sm font-semibold text-accent/80 mb-2">ENRICHED OUTPUT:</h3>
          {isPending && <p className="text-muted-foreground animate-pulse">Processing stream...</p>}
          {result ? (
            <p className="whitespace-pre-wrap text-sm text-foreground/90">{result.enrichedText}</p>
          ) : (
            !isPending && <p className="text-muted-foreground">Output will appear here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
