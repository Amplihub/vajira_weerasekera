"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/lib/trpc/client";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CyclesHeader() {
  return (
    <AdminPageHeader
      title="360 Cycles"
      description="Leadership feedback cycles with AI summaries."
      action={<CreateCycleDialog />}
    />
  );
}

function CreateCycleDialog() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [title, setTitle] = useState("");

  const clients = useQuery(trpc.coaching.listClients.queryOptions({ page: 1, limit: 100 }));
  const clientName = (c: { contact: { fullName: string | null; email: string } }) => c.contact.fullName || c.contact.email;
  const selectedClient = clients.data?.items.find((c) => c.id === clientId);

  const create = useMutation(
    trpc.cycles.create.mutationOptions({
      onSuccess: () => {
        toast.success("Cycle created");
        setOpen(false);
        setTitle("");
        setClientId("");
        qc.invalidateQueries({ queryKey: trpc.cycles.list.queryKey() });
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-xl gradient-brand px-4 text-sm font-medium text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
        <Plus className="size-4" /> New cycle
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-heading text-xl">New 360 cycle</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium uppercase tracking-wide text-brand-ink/60">Client</Label>
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "h-9 w-full justify-between px-3 font-normal", !selectedClient && "text-muted-foreground")}
              >
                {selectedClient ? clientName(selectedClient) : "Select client"}
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[var(--anchor-width)] min-w-[18rem] p-0">
                <Command>
                  <CommandInput placeholder="Search clients…" />
                  <CommandList>
                    <CommandEmpty>No clients found.</CommandEmpty>
                    {clients.data?.items.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={clientName(c)}
                        onSelect={() => {
                          setClientId(c.id);
                          setPickerOpen(false);
                        }}
                      >
                        <Check className={cn("size-4", clientId === c.id ? "opacity-100" : "opacity-0")} />
                        {clientName(c)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium uppercase tracking-wide text-brand-ink/60">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q2 360 Review" />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={create.isPending}
            onClick={() => {
              if (!clientId || !title) return toast.error("Client and title required");
              create.mutate({ coachingClientId: clientId, title });
            }}
          >
            {create.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
