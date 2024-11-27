import React, { createContext, useContext, useState } from "react";
import { Event } from "@/components/types"; // Adjust the path to your Event type

interface EventsContextProps {
  events: Event[] | null; // The list of events
  setEvents: (events: Event[]) => void; // Function to update the list of events
  onEventSelect: ((event: Event) => void) | null; // Callback function for selecting an event
  setOnEventSelect: (callback: (event: Event) => void) => void; // Function to update the event select callback
}

// Default values for the context
const EventsContext = React.createContext<{
    events: Event[] | null;
    sectionTitle: string;
    setEvents: React.Dispatch<React.SetStateAction<Event[] | null>>;
    setSectionTitle: React.Dispatch<React.SetStateAction<string>>;
}>({
    events: null,
    sectionTitle: "",
    setEvents: () => {},
    setSectionTitle: () => {},
});

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = React.useState<Event[] | null>(null);
    const [sectionTitle, setSectionTitle] = React.useState("");

    return (
        <EventsContext.Provider value={{ events, sectionTitle, setEvents, setSectionTitle }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEventsContext = () => React.useContext(EventsContext);
