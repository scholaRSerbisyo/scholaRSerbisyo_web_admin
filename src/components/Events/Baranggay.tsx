import { AddEventButtonComponent } from "../Static/AddEventFunction/AddEventButton";


export default function BaranggayComponent() {
    return (
        <main className="flex flex-1 flex-col gap-4 lg:gap-4 p-2">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">Baranggay</h1>
                <AddEventButtonComponent />
            </div>
            <div className="flex flex-col lg:flex-row gap-5 justify-between flex-1 rounded-lg border border-dashed shadow-sm p-3">
                asdasd
            </div>
        </main>
    )
}