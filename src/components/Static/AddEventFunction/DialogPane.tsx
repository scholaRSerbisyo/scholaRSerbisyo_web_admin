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
import React from "react";

export default function DialogPaneComponent() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={openDialog}>
                    <PlusIcon /> Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full h-full max-w-[80vw] max-h-[80vh] bg-background text-primary p-5 relative">
                <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogDescription>Add Event information here.</DialogDescription>
                </DialogHeader>
                {/*<AddEventButtonComponent closeDialog={closeDialog} setLoading={setIsLoading} />*/}
                {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
