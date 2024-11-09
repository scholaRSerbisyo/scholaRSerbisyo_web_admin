import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEventButtonComponent } from "./AddEventButton";

export default function DialogPaneComponent() {
    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon /> Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-[80vw] max-h-[80vh] bg-background text-primary p-5">
                <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
                <DialogDescription>Add Event information here.</DialogDescription>
                </DialogHeader>
                <AddEventButtonComponent />
            </DialogContent>
        </Dialog>
    )
}