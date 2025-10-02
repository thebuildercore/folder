import Link from "next/link"
import FlowDiagram from "@/components/flow-diagram"

export default function HowItWorksPage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-semibold text-balance">How the Result Portal Works</h1>
          <p className="text-sm text-muted-foreground">
            Diagrammatic breakdown of each step from Submit to Download via IPFS.
          </p>
          <nav className="mt-3">
            <Link href="/" className="text-sm underline underline-offset-4 text-foreground">
              ← Back to results
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <FlowDiagram />
      </section>

      <footer className="border-t mt-12">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted-foreground">
          {"For transparency, the server returns only the IPFS CID. Files are fetched from a public IPFS gateway."}
        </div>
      </footer>
    </main>
  )
}
