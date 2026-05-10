import { Clock3, NotebookPen } from "lucide-react";

import { AddNoteForm } from "@/components/notes/add-note-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotesPageData } from "@/lib/data/planner";
import { requireUserSession } from "@/lib/require-user-session";
import { formatRelativeDate } from "@/lib/utils";

export default async function NotesPage() {
  const session = await requireUserSession();
  const trips = await getNotesPageData(session!.user.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trip notes and journal</CardTitle>
          <CardDescription>Capture logistics, reflections, and the small details that make the trip smoother.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddNoteForm trips={trips.map((trip) => ({ id: trip.id, title: trip.title }))} />
        </CardContent>
      </Card>

      {trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{trip.title}</CardTitle>
                <CardDescription>{trip.notes.length} journal entries</CardDescription>
              </div>
              <Badge>{trip.notes.length} notes</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {trip.notes.map((note) => (
              <div key={note.id} className="rounded-[24px] bg-slate-50 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <NotebookPen className="h-4 w-4 text-slate-500" />
                  <p className="font-medium text-slate-950">{note.title}</p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatRelativeDate(note.createdAt)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{note.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
