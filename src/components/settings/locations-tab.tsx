"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Location {
  id: string;
  room: string;
  cabinet: string | null;
  shelf: string | null;
  _count: { items: number };
}

interface RoomGroup {
  room: string;
  expanded: boolean;
  cabinets: { cabinet: string; expanded: boolean; shelves: Location[] }[];
  locationsWithoutCabinet: Location[];
}

export function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({ room: "", cabinet: "", shelf: "" });
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedCabinets, setExpandedCabinets] = useState<Set<string>>(new Set());

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/settings/locations");
    const data = await res.json();
    setLocations(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const rooms = locations.reduce<Record<string, Location[]>>((acc, loc) => {
    if (!acc[loc.room]) acc[loc.room] = [];
    acc[loc.room].push(loc);
    return acc;
  }, {});

  function openCreate(preset?: Partial<{ room: string; cabinet: string }>) {
    setEditing(null);
    setForm({ room: preset?.room || "", cabinet: preset?.cabinet || "", shelf: "" });
    setDialogOpen(true);
  }

  function openEdit(loc: Location) {
    setEditing(loc);
    setForm({ room: loc.room, cabinet: loc.cabinet || "", shelf: loc.shelf || "" });
    setDialogOpen(true);
  }

  async function handleSave() {
    const payload = {
      room: form.room,
      cabinet: form.cabinet || null,
      shelf: form.shelf || null,
    };

    if (editing) {
      const res = await fetch(`/api/settings/locations/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to update"); return; }
      toast.success("Location updated");
    } else {
      const res = await fetch("/api/settings/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to create"); return; }
      toast.success("Location created");
    }
    setDialogOpen(false);
    fetchLocations();
  }

  async function handleDelete(loc: Location) {
    if (!confirm(`Delete "${[loc.room, loc.cabinet, loc.shelf].filter(Boolean).join(" / ")}"?`)) return;
    const res = await fetch(`/api/settings/locations/${loc.id}`, { method: "DELETE" });
    if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to delete"); return; }
    toast.success("Location deleted");
    fetchLocations();
  }

  function toggleRoom(room: string) {
    setExpandedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(room)) next.delete(room); else next.add(room);
      return next;
    });
  }

  function toggleCabinet(key: string) {
    setExpandedCabinets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Locations</h3>
        <Button size="sm" onClick={() => openCreate()}><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>

      <div className="space-y-1">
        {Object.keys(rooms).length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No locations</p>
        ) : Object.entries(rooms).map(([room, locs]) => {
          const isExpanded = expandedRooms.has(room);
          const cabinetGroups = locs.reduce<Record<string, Location[]>>((acc, loc) => {
            const key = loc.cabinet || "__no_cabinet__";
            if (!acc[key]) acc[key] = [];
            acc[key].push(loc);
            return acc;
          }, {});

          return (
            <div key={room} className="border rounded-md">
              <button
                onClick={() => toggleRoom(room)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/50 text-sm font-medium"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span>{room}</span>
                <Badge variant="secondary" className="ml-auto">{locs.reduce((s, l) => s + l._count.items, 0)} items</Badge>
              </button>

              {isExpanded && (
                <div className="pl-6 pb-2 space-y-1">
                  {Object.entries(cabinetGroups).map(([cabinet, cabinetLocs]) => {
                    if (cabinet === "__no_cabinet__") {
                      return cabinetLocs.map((loc) => (
                        <div key={loc.id} className="flex items-center justify-between px-3 py-1.5 text-sm">
                          <span className="text-muted-foreground">{room}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{loc._count.items}</Badge>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(loc)}><Pencil className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(loc)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                          </div>
                        </div>
                      ));
                    }

                    const cabKey = `${room}-${cabinet}`;
                    const isCabExpanded = expandedCabinets.has(cabKey);

                    return (
                      <div key={cabKey} className="border-l ml-2">
                        <button
                          onClick={() => toggleCabinet(cabKey)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 text-sm"
                        >
                          {isCabExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          <span>{cabinet}</span>
                          <Badge variant="outline" className="ml-auto">{cabinetLocs.reduce((s, l) => s + l._count.items, 0)}</Badge>
                        </button>
                        {isCabExpanded && (
                          <div className="pl-6 pb-1">
                            {cabinetLocs.map((loc) => (
                              <div key={loc.id} className="flex items-center justify-between px-3 py-1 text-sm">
                                <span className="text-muted-foreground">{loc.shelf || "No shelf"}</span>
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline">{loc._count.items}</Badge>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(loc)}><Pencil className="h-3 w-3" /></Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(loc)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                </div>
                              </div>
                            ))}
                            <Button variant="ghost" size="sm" className="text-xs mt-1" onClick={() => openCreate({ room, cabinet })}>
                              <Plus className="h-3 w-3 mr-1" />Add shelf
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => openCreate({ room })}>
                    <Plus className="h-3 w-3 mr-1" />Add cabinet
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Location" : "Add Location"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Room</Label>
              <Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </div>
            <div>
              <Label>Cabinet</Label>
              <Input value={form.cabinet} onChange={(e) => setForm({ ...form, cabinet: e.target.value })} placeholder="Optional" />
            </div>
            <div>
              <Label>Shelf</Label>
              <Input value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.room}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
