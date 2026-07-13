// Career content for Skills / Experience / GitHub sections.
// Source of truth: assets/Swayam_Mehta_Resume.pdf (extracted July 2026).
// Do not invent employers or dates beyond the résumé.

const CAREER = {
  skillsIntro:
    "Languages, AI tooling, cloud, and systems work from production deployments and shipped products—not a demo checklist.",
  skillRows: [
    {
      id: "core",
      label: "Languages & AI",
      items: [
        { name: "Python", mark: "PY" },
        { name: "C / C++", mark: "C+" },
        { name: "Java", mark: "JV" },
        { name: "JavaScript", mark: "JS" },
        { name: "Bash", mark: "SH" },
        { name: "Machine learning", mark: "ML" },
        { name: "Deep learning", mark: "DL" },
        { name: "Computer vision", mark: "VI" },
        { name: "PyTorch", mark: "PT" },
        { name: "TensorFlow", mark: "TF" },
        { name: "OpenCV", mark: "CV" },
        { name: "NumPy", mark: "NP" },
        { name: "Pandas", mark: "PD" },
      ],
    },
    {
      id: "ops",
      label: "Cloud, data & ops",
      items: [
        { name: "AWS", mark: "AW" },
        { name: "Azure", mark: "AZ" },
        { name: "Azure DevOps", mark: "AD" },
        { name: "Docker", mark: "DK" },
        { name: "Linux", mark: "LX" },
        { name: "SQL", mark: "SQ" },
        { name: "PostgreSQL", mark: "PG" },
        { name: "MongoDB", mark: "MG" },
        { name: "CI / CD", mark: "CI" },
        { name: "Power BI", mark: "BI" },
        { name: "Terraform", mark: "IA" },
        { name: "Ansible", mark: "AN" },
      ],
    },
  ],
  certifications: [
    {
      name: "Complete Terraform and Ansible Bootcamp",
      issuer: "Udemy",
    },
  ],
  experienceIntro:
    "Customer-facing deployment work—pilots, demos, production AI systems—and the engineering underneath.",
  experience: [
    {
      id: "sam-ssam",
      company: "SAM Analytic Solutions",
      team: "SSAM Team",
      role: "Junior Systems Engineer",
      location: "Raleigh, NC",
      start: "May 2024",
      end: "Present",
      status: "active",
      url: null,
      bullets: [
        "Worked directly with customers and internal stakeholders to deploy AI-driven monitoring and analytics systems into production environments.",
        "Planned and delivered live technical demonstrations, proof-of-value pilots, and solution walkthroughs for technical and non-technical audiences.",
        "Represented engineering at industry conferences and client events—booth demos and detailed technical Q&A.",
        "Fed real-time customer feedback from demos and deployments back into product and engineering priorities.",
        "Designed and maintained Python backend services and APIs for end-to-end AI workflows (ingestion through inference and reporting).",
        "Built evaluation and validation tooling to measure performance and robustness under real operating conditions.",
        "Implemented CI/CD with Azure DevOps to automate testing, validation, and deployment.",
        "Authored technical documentation, deployment guides, and operational playbooks for repeatable customer onboarding.",
        "Supported post-deployment troubleshooting and customer enablement.",
      ],
    },
  ],
  education: [
    {
      id: "uncc",
      school: "University of North Carolina at Charlotte",
      degree: "B.S. Computer Engineering — Machine Learning Concentration",
      minor: "Mathematics",
      start: "August 2020",
      end: "December 2024",
      status: "done",
    },
  ],
  github: {
    login: "Swayyum",
    profileUrl: "https://github.com/Swayyum",
    dataUrl: "github-contributions.json",
  },
};
