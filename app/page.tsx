import ResultForm from "@/components/result-form"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-semibold text-balance">Government of India — Examination Results</h1>
          <p className="text-sm text-muted-foreground">View and download your official result securely.</p>
          <nav className="mt-3">
            <Link href="/how-it-works" className="text-sm underline underline-offset-4 text-foreground">
              How it works
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <ResultForm />
      </section>

      <footer className="border-t mt-12">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted-foreground">
          {"For any discrepancies, contact your board/authority. © Government of India"}
        </div>
      </footer>
    </main>
  )
}
