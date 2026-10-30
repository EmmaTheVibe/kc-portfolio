export type Message = { from: "me" | "them"; text: string; sender?: string };

export type Thread = {
  id: string;
  name: string;
  initials: string;
  colors: [string, string];
  time: string;
  messages: Message[];
};

export const threads: Thread[] = [
  {
    id: "courier",
    name: "Dev (Courier)",
    initials: "DC",
    colors: ["#fdba74", "#ea580c"],
    time: "9:41 AM",
    messages: [
      { from: "them", text: "hi your parcel is on the doorstep" },
      { from: "them", text: "also random q do you make apps" },
      { from: "me", text: "I do, yeah" },
      { from: "them", text: "ok so hear me out" },
      { from: "them", text: "an app that tells you when your parcel is on the doorstep" },
      { from: "me", text: "That's… the text you just sent me" },
      { from: "them", text: "exactly. proven demand" },
      { from: "them", text: "I can pay you in equity and one (1) unclaimed parcel. it's rattling" },
    ],
  },
  {
    id: "mum",
    name: "Mum",
    initials: "M",
    colors: ["#f9a8d4", "#db2777"],
    time: "Yesterday",
    messages: [
      { from: "them", text: "Hi love, quick favour" },
      { from: "them", text: "The printer has started printing everything in italics" },
      { from: "me", text: "Printers can't really do that on their own" },
      { from: "them", text: "Well this one has. It looks very sure of itself" },
      { from: "me", text: "I'll take a look on Sunday" },
      { from: "them", text: "Thank you!! Also what's the wifi password, it's not working" },
      { from: "me", text: "It's on a sticker on the router" },
      { from: "them", text: "I know. I've been typing the sticker's serial number" },
      { from: "them", text: "Bring snacks x" },
    ],
  },
  {
    id: "five-a-side",
    name: "Sunday Five-a-side ⚽",
    initials: "5",
    colors: ["#86efac", "#16a34a"],
    time: "Monday",
    messages: [
      { from: "them", sender: "Sam", text: "who's bringing the ball this week" },
      { from: "them", sender: "Priya", text: "Mark said he'd build an app for it" },
      { from: "me", text: "I said that ONCE" },
      { from: "them", sender: "Sam", text: "so is that a no on the ball" },
    ],
  },
];
