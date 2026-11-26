"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Bot,
  Webhook,
  Table,
  Mail,
  Sparkles,
  GitBranch,
  ArrowRight
} from "lucide-react";

const REAL_CHAPTERS = [
  {
    number: "01",
    title: "The AI Agency Opportunity",
    summary: "AI is a capability—not the product. What an AI agency delivers, and the business model value chain.",
    topics: ["Capability vs. product trap", "Four high-demand service categories", "Agency unit economics"]
  },
  {
    number: "02",
    title: "Choose a Niche and Validate Demand",
    summary: "Why focus makes selling easier. Score evidence over excitement, and conduct customer discovery interviews.",
    topics: ["Niche scorecard framework", "Interview questions that reveal reality", "The validation feedback loop"]
  },
  {
    number: "03",
    title: "Design Your First Productised Service",
    summary: "Turn broad skills into a defined starter package with clear scope boundaries before opening tools.",
    topics: ["Scope boundary rules", "Fixed-scope starter package", "Problem-to-offer matrix"]
  },
  {
    number: "04",
    title: "Build a Credible Portfolio Before Your First Client",
    summary: "Demo proof of capability without pretending demo work is client work. Three assets that build trust.",
    topics: ["Demo vs. client work distinction", "Loom walkthrough structure", "Frictionless portfolio deck"]
  },
  {
    number: "05",
    title: "Tools, Architecture, and Safe AI Workflows",
    summary: "Simplest reliable stack. Privacy, data minimisation, failure modes, and required human-in-the-loop controls.",
    topics: ["n8n architecture patterns", "Data privacy & zero-retention rules", "Human handoff fail-safes"]
  },
  {
    number: "06",
    title: "Pricing, Scope, and Project Economics",
    summary: "Price the work—not the number of tools. Illustrative pricing calculations and scope protection.",
    topics: ["Setup fee + retainer math", "Cost passthrough policy", "Scope creep defence clauses"]
  },
  {
    number: "07",
    title: "Prospect Research and Ethical Outreach",
    summary: "Find businesses with a plausible reason to care. Write messages that sound human and follow up respectfully.",
    topics: ["Boolean search queries", "Value-first message scripts", "7-day follow-up cadence"]
  },
  {
    number: "08",
    title: "Discovery Calls and Proposals",
    summary: "Lead with curiosity. A proposal blueprint that makes decisions easier and handles objections without pressure.",
    topics: ["15-min discovery framework", "One-page proposal format", "Handling budget & AI trust doubts"]
  },
  {
    number: "09",
    title: "Delivery, QA, and Client Handover",
    summary: "Follow a repeatable delivery lifecycle. Handover documentation is part of the product clients pay for.",
    topics: ["Sandbox testing checklist", "Loom handover walkthrough", "Incident response protocol"]
  },
  {
    number: "10",
    title: "Retainers, Retention, and Client Trust",
    summary: "Recurring revenue requires recurring value. Make reporting useful with weekly executive summaries.",
    topics: ["Retainer deliverable menu", "Automated metric reporting", "Churn prevention triggers"]
  },
  {
    number: "11",
    title: "Systems and Responsible Scaling",
    summary: "Document SOPs before delegating. Know your operating numbers and manage platform changes safely.",
    topics: ["Agency operating benchmarks", "Tool migration guidelines", "Founder time allocation"]
  },
  {
    number: "12",
    title: "Your First 30 Days",
    summary: "Week-by-week implementation blueprint: Validate, Demonstrate, Reach prospects, and Deliver.",
    topics: ["Week 1: Validation sprint", "Week 2: Workflow build", "Week 3: 50 personalized outreaches", "Week 4: Pilot client close"]
  }
];

const INCLUDED_WORKFLOWS = [
  { id: "01", name: "Lead Capture + AI Qualification", file: "01-lead-capture-ai-qualification.json", nodes: 11, highlight: "Webhook → LLM Scoring → Google Sheets CRM → Slack Alert" },
  { id: "02", name: "AI Email Triage & Auto-Draft", file: "02-ai-email-triage-auto-draft.json", nodes: 9, highlight: "Gmail Inbox → Sentiment & Urgency Analysis → Draft Generator" },
  { id: "03", name: "Website AI Chatbot Agent", file: "03-website-ai-chatbot-agent.json", nodes: 7, highlight: "Webhook Chat → RAG Knowledge Base → Lead Handover" },
  { id: "04", name: "Social Media Content Engine", file: "04-social-media-content-engine.json", nodes: 8, highlight: "Trend Topic → GPT-4 Copywriting → Multi-Platform Formatter" },
  { id: "05", name: "Appointment Booking Automation", file: "05-appointment-booking-automation.json", nodes: 8, highlight: "Calendar Webhook → Timezone Check → SMS/Email Reminders" },
  { id: "06", name: "AI Proposal Generator", file: "06-ai-proposal-generator.json", nodes: 10, highlight: "Call Notes → Scope Extractor → Branded Google Doc Proposal" },
  { id: "07", name: "Cold Outreach Personalizer", file: "07-cold-outreach-personalizer.json", nodes: 9, highlight: "Prospect URL → Web Scraper → Custom Icebreaker Generator" },
  { id: "08", name: "Review & Reputation Manager", file: "08-review-reputation-manager.json", nodes: 10, highlight: "New Review → Sentiment Gate → Public Reply or Escalation" },
  { id: "09", name: "Client Onboarding Automation", file: "09-client-onboarding-automation.json", nodes: 9, highlight: "Payment Webhook → Google Drive Folder → Intake Form → Welcome Pack" },
  { id: "10", name: "Weekly Client Performance Report", file: "10-weekly-client-report.json", nodes: 8, highlight: "API Data Sync → KPI Summary → Executive PDF / Email Dispatch" }
];

export function ProductProof() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(INCLUDED_WORKFLOWS[0]);
  const [expandedChapter, setExpandedChapter] = useState<string | null>("01");
  const [workflowView, setWorkflowView] = useState<"visual" | "json">("visual");

  return (
    <section id="proof" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Verified Product Proof
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            See Exactly What’s Inside Before You Buy
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-300">
            Real n8n automation blueprints and the authentic 12-chapter operating manual. No generic stock screenshots or vague outlines.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ============================================================ */}
          {/* Card A: See Inside the Automation Library                     */}
          {/* ============================================================ */}
          <div className="glass-panel flex flex-col rounded-3xl p-6 shadow-glass sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
              <div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  Preview A • n8n Architecture
                </span>
                <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                  See Inside the Automation Library
                </h3>
              </div>

              {/* View Toggle */}
              <div className="flex rounded-full border border-white/10 bg-black/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setWorkflowView("visual")}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                    workflowView === "visual"
                      ? "bg-cyan-500/20 text-cyan-200 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Canvas View
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowView("json")}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                    workflowView === "json"
                      ? "bg-violet-500/20 text-violet-200 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  JSON Spec
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Each workflow is an import-ready <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-cyan-300">.json</code> file with production nodes, fail-safe error branches, and sticky-note setup annotations.
            </p>

            {/* Workflow Selector Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {INCLUDED_WORKFLOWS.map((wf) => (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`shrink-0 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all ${
                    selectedWorkflow.id === wf.id
                      ? "border-cyan-400/50 bg-cyan-500/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <span className="text-cyan-400 mr-1.5 font-bold">#{wf.id}</span>
                  {wf.name}
                </button>
              ))}
            </div>

            {/* Interactive Visual Canvas */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-semibold text-white">
                    VD-{selectedWorkflow.id} | {selectedWorkflow.name}
                  </span>
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                  {selectedWorkflow.nodes} Nodes • Tested n8n v1.x
                </span>
              </div>

              {workflowView === "visual" ? (
                <div className="mt-5 space-y-4">
                  {/* Real workflow pipeline representation */}
                  <div className="relative rounded-xl border border-white/[0.08] bg-black/40 p-4">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                      Execution Pipeline ({selectedWorkflow.highlight})
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-lg border border-violet-400/20 bg-violet-500/10 p-2.5">
                        <Webhook className="h-4 w-4 text-violet-300 shrink-0" />
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">Trigger Node</div>
                          <div className="text-[10px] text-slate-400">Webhook / App Event</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-2.5">
                        <Bot className="h-4 w-4 text-cyan-300 shrink-0" />
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">AI LangChain Engine</div>
                          <div className="text-[10px] text-slate-400">OpenAI Chat + Extraction</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2.5">
                        <Table className="h-4 w-4 text-emerald-300 shrink-0" />
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">Data Layer</div>
                          <div className="text-[10px] text-slate-400">Google Sheets / CRM Sync</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg border border-amber-400/20 bg-amber-500/10 p-2.5">
                        <Mail className="h-4 w-4 text-amber-300 shrink-0" />
                        <div>
                          <div className="font-mono text-xs font-semibold text-white">Dispatch Action</div>
                          <div className="text-[10px] text-slate-400">Gmail Draft / Slack Ping</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                        Includes conditional fail-safes &amp; human verification points
                      </span>
                      <span className="text-emerald-400 font-mono">Status: Ready to Import</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* JSON Schema Preview */
                <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/60 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                  <pre className="text-slate-400">
{`{
  "name": "VD-${selectedWorkflow.id} | ${selectedWorkflow.name}",
  "nodes": [
    { "name": "Webhook Trigger", "type": "n8n-nodes-base.webhook", "position": [0, 0] },
    { "name": "Normalize Data", "type": "n8n-nodes-base.set", "position": [240, 0] },
    { "name": "AI Agent", "type": "@n8n/n8n-nodes-langchain.chainLlm", "position": [480, 0] },
    { "name": "CRM Sync", "type": "n8n-nodes-base.googleSheets", "position": [720, 0] },
    { "name": "Human Approval", "type": "n8n-nodes-base.if", "position": [960, 0] }
  ],
  "meta": { "templateVersion": "2027.1", "license": "single_user_commercial" }
}`}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
              <span>All 10 workflows included in the ZIP download</span>
              <a href="#pricing" className="text-cyan-400 hover:underline flex items-center gap-1 font-medium">
                Get full access for ₹999 <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Card B: Inside the Complete Course Manual                     */}
          {/* ============================================================ */}
          <div className="glass-panel flex flex-col rounded-3xl p-6 shadow-glass sm:p-8 lg:col-span-5">
            <div className="border-b border-white/[0.08] pb-5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300">
                Preview B • Authentic Curriculum
              </span>
              <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                Inside the Complete Course Manual
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Actual table of contents from the 12-chapter PDF ebook included in the bundle.
              </p>
            </div>

            {/* Scrollable Chapter List */}
            <div className="mt-5 space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {REAL_CHAPTERS.map((ch) => {
                const isOpen = expandedChapter === ch.number;
                return (
                  <div
                    key={ch.number}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? "border-violet-400/35 bg-white/[0.04]"
                        : "border-white/[0.07] bg-white/[0.015] hover:border-white/15"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedChapter(isOpen ? null : ch.number)}
                      className="flex w-full items-center justify-between p-3.5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/15 font-mono text-xs font-bold text-violet-300">
                          {ch.number}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {ch.title}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-violet-300" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] p-3.5 pt-2 text-xs text-slate-300">
                            <p className="leading-relaxed text-slate-300">{ch.summary}</p>
                            <ul className="mt-2.5 space-y-1 text-[11px] text-slate-400">
                              {ch.topics.map((t, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Appendices strip */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#070b14] p-3.5 text-xs text-slate-300">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold mb-1">
                Plus 4 Practical Appendices
              </div>
              <p className="text-[11px] text-slate-400">
                Outreach scripts (Appendix A), proposal contract blueprint (B), AI prompt library (C), and pre-launch publication checklist (D).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
