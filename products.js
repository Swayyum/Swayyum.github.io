// Product catalog — add new apps/plugins here; the page renders from this list.
const PRODUCTS = [
  {
    id: "fluxon",
    name: "Fluxon",
    kind: "app",
    featured: true,
    status: "shipped",
    platform: "macOS 14+",
    tagline: "Production-grade system observability with live metrics and a visual Disk Explorer.",
    description:
      "A native macOS product that turns low-level CPU, memory, network, disk, and process telemetry into an operator-friendly interface.",
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
    tagline: "A Python terminal product built around a complete game loop and responsive TUI.",
    description:
      "A shipped Python package combining stateful game systems, scoring logic, progression, and a polished terminal interface.",
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
    tagline: "A secure Oura API integration that turns health data into timely actions.",
    description:
      "A native SwiftUI client integrating OAuth-protected Oura data, local Keychain storage, score dashboards, and context-aware reminders.",
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
    tagline: "Local-network discovery and conflict avoidance inside a command workflow.",
    description:
      "Scans a live LAN, identifies assigned addresses, and turns network state into clear recommendations for the user.",
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
    tagline: "Searchable knowledge access with optional AI-assisted exploration.",
    description:
      "A focused retrieval interface for browsing and searching verses, with AI-assisted features when Raycast AI is available.",
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
