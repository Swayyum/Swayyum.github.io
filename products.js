// Product catalog — add new apps/plugins here; the page renders from this list.
const PRODUCTS = [
  {
    id: "fluxon",
    name: "Fluxon",
    kind: "app",
    featured: true,
    status: "shipped",
    platform: "macOS 14+",
    tagline: "Native system monitor with live metrics and a WizTree-style Disk Explorer.",
    description:
      "CPU, memory, network, disks, processes, history, and a menu bar companion. Free for personal use.",
    image:
      "https://raw.githubusercontent.com/Swayyum/fluxon-releases/main/docs/media/hero.png",
    imageAlt: "Fluxon System Overview dashboard",
    accent: "#1d4ed8",
    links: [
      {
        label: "Download",
        href: "https://github.com/Swayyum/fluxon-releases/releases",
        primary: true,
      },
      {
        label: "Releases",
        href: "https://github.com/Swayyum/fluxon-releases",
      },
    ],
  },
  {
    id: "typatro",
    name: "Typatro",
    kind: "app",
    featured: true,
    status: "shipped",
    platform: "Terminal · Python",
    tagline: "A slot-machine typing roguelike for your terminal.",
    description:
      "Stack Chips × Mult, beat Blinds, collect Jokers, and climb endless Antes in a casino-felt TUI.",
    image:
      "https://raw.githubusercontent.com/Swayyum/Typatro/main/docs/images/hero.png",
    imageAlt: "Typatro run mode with blind sidebar and live score",
    accent: "#1d4ed8",
    links: [
      {
        label: "Install",
        href: "https://pypi.org/project/typatro/",
        primary: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Swayyum/Typatro",
      },
    ],
  },
  {
    id: "oura-menu-bar",
    name: "Oura Menu Bar",
    kind: "app",
    featured: true,
    status: "shipped",
    platform: "macOS 14+",
    tagline: "Readiness, sleep, and activity from the menu bar.",
    description:
      "Native SwiftUI menu bar app synced to the Oura API, with score details, a full Dashboard, and quiet move reminders. Tokens stay in Keychain; metrics stay on your Mac.",
    image: "assets/oura-menu-bar-hero.jpg",
    imageAlt: "Oura Menu Bar showing recovery scores and move reminders in the macOS menu bar",
    accent: "#1d4ed8",
    links: [
      {
        label: "Download",
        href: "https://github.com/Swayyum/oura-menu-bar/releases",
        primary: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Swayyum/oura-menu-bar",
      },
    ],
  },
  {
    id: "ip-finder",
    name: "IP Finder",
    kind: "raycast",
    featured: false,
    status: "shipped",
    platform: "Raycast",
    tagline: "Scan your local network and find free IP addresses.",
    description:
      "Detect assigned IPs and get smart recommendations to avoid conflicts on your LAN.",
    image: null,
    imageAlt: null,
    accent: "#1d4ed8",
    links: [
      {
        label: "Install on Raycast",
        href: "https://www.raycast.com/swayam_mehta/ip-finder",
        primary: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Swayyum/IP-Finder-Raycast-Plugin",
      },
    ],
  },
  {
    id: "bhagavad-gita-quotes",
    name: "Bhagavad Gita Quotes",
    kind: "raycast",
    featured: false,
    status: "shipped",
    platform: "Raycast",
    tagline: "Read and search verses from the Bhagavad Gita.",
    description:
      "Browse and search quotes from Raycast. Optional AI features when Raycast AI is available.",
    image: null,
    imageAlt: null,
    accent: "#1d4ed8",
    links: [
      {
        label: "Install on Raycast",
        href: "https://www.raycast.com/swayam_mehta/bhagavad-gita-quotes",
        primary: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Swayyum/Bhagavad-Gita-Raycast-Plugin",
      },
    ],
  },
];

// Placeholder slots for future apps — keep or replace as you ship.
const UPCOMING = [
  {
    id: "next",
    name: "Next up",
    tagline: "More apps land here as they ship.",
  },
];
