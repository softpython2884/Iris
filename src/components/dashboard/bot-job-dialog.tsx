"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '../ui/textarea';
import { LoaderCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BotJobDialog({ children }: { children: React.ReactNode }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [cookies, setCookies] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!targetUrl) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "L'URL cible est requise.",
      });
      return;
    }
    setIsLoading(true);

    try {
      // For now, we assume we have a valid admin token stored.
      // In a real app, this would be retrieved from a secure context.
      const tempAdminToken = "temporary-placeholder-token"; // This needs to be replaced with real auth handling

      const response = await fetch('/api/bots/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // THIS IS A PLACEHOLDER - Real auth token should be used
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVyYXRvcklkIjoiT3BlcmF0b3ItNyIsInNlY3VyaXR5TGV2ZWwiOiI3IiwiaWF0IjoxNzE0NjY0NjQyLCJleHAiOjE3MTQ2OTM0NDJ9.3w-4rUQbXpM8t5a9-f5XGzY7j6k8qZz_aY9eP8tWbKc`
        },
        body: JSON.stringify({ targetUrl, cookies }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Le job a échoué avec le statut ${response.status}`);
      }

      console.log("Résultat du job d'enrichissement :", result);
      toast({
        title: "Job terminé",
        description: `Analyse de ${targetUrl} réussie. ${result.entities?.length || 0} entités extraites. Consultez la console.`,
      });
      setIsOpen(false); // Close dialog on success

    } catch (error: any) {
      console.error("Erreur lors du lancement du job de bot:", error);
      toast({
        variant: "destructive",
        title: "Erreur du Job",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-primary border-accent/20">
        <DialogHeader>
          <DialogTitle className="text-accent">Lancer un nouveau Job de Bot</DialogTitle>
          <DialogDescription>
            Entrez l'URL à analyser. Le bot va scraper la page, extraire le contenu et l'analyser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right text-accent/80">
              URL Cible
            </Label>
            <Input
              id="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="col-span-3 bg-background/50 border-accent/50"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cookies" className="text-right text-accent/80">
              Cookies (Opt.)
            </Label>
            <Textarea
              id="cookies"
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              className="col-span-3 bg-background/50 border-accent/50"
              placeholder="cookie1=valeur1; cookie2=valeur2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Lancer l'analyse
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
