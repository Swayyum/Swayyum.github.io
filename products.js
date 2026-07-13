// Product catalog — add new apps/plugins here; the page renders from this list.
const PRODUCTS = [
  {
    id: "fluxon",
    name: "Fluxon",
    kind: "app",
    featured: true,
    status: "shipped",
    platform: "macOS 14+",
    version: "1.0",
    tagline: "Production-grade system observability with live metrics and a visual Disk Explorer.",
    description:
      "A native macOS monitor that turns CPU, memory, network, disk, and process telemetry into an operator-friendly dashboard — metrics stay on your Mac, no account or cloud sync.",
    features: [
      "Overview — live CPU, memory, network, disk, battery, and thermals",
      "Processes — sort and inspect what's burning CPU and RAM",
      "Extended metrics & Time Travel — deeper graphs and scrubbable history",
      "Disk Explorer — folder picker + WizTree-style treemap for space hogs",
      "Menu bar companion — glanceable stats, including over fullscreen apps",
      "Startup Apps & System Info — login items, hardware, storage, and network",
    ],
    licenseNote: "Free for personal use",
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
    tagline:
      "Native macOS menu bar app that turns Oura health signals into clear daily actions.",
    description:
      "Opens from the menu bar with Readiness, Sleep, and Activity at a glance. OAuth-protected sync, Keychain storage, and context-aware reminders — your data stays on your Mac.",
    image: "assets/oura-menu-bar-readme.png",
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
