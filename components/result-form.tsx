"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ApiResponse = { cid: string }

const IPFS_GATEWAY = "https://w3s.link/ipfs"

export default function ResultForm() {
  const [exam, setExam] = React.useState("")
  const [rollNo, setRollNo] = React.useState("")
  const [dob, setDob] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [cid, setCid] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const canSubmit = !!exam && !!rollNo && !!dob && !isSubmitting

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCid(null)
    setIsSubmitting(true)
    try {
      // Basic client-side validation
      if (rollNo.length < 3) {
        throw new Error("Roll number must be at least 3 characters.")
      }
      // POST to server to fetch CID only
      const res = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rollNo, dob }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to fetch result CID.")
      }
      const data = (await res.json()) as ApiResponse
      if (!data?.cid) throw new Error("Server did not return a CID.")
      setCid(data.cid)
      console.log(" CID received:", data.cid)
    } catch (err: any) {
      console.log(" Submit error:", err?.message || err)
      setError(err?.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onDownload() {
    if (!cid) return
    setIsDownloading(true)
    try {
      // Fetch from IPFS gateway and trigger a local download
      const url = `${IPFS_GATEWAY}/${cid}`
      const resp = await fetch(url, { mode: "cors" })
      if (!resp.ok) throw new Error("Failed to fetch file from IPFS. Currently the flow has been mocked to demonstrate the functionality.")
      const blob = await resp.blob()
      const objectUrl = URL.createObjectURL(blob)

      const a = document.createElement("a")
      const safeExam = exam.toLowerCase().replace(/\s+/g, "-")
      const safeRoll = rollNo.replace(/[^a-zA-Z0-9_-]/g, "")
      a.href = objectUrl
      a.download = `${safeExam}-${safeRoll}-result`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (err: any) {
      console.log(" Download error:", err?.message || err)
      setError(err?.message || "Unable to download the file from IPFS.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="border bg-card">
      <CardHeader>
        <CardTitle className="text-xl">Result Access</CardTitle>
        <CardDescription className="text-pretty">
          Choose your exam, enter your Roll Number and Date of Birth, then Submit to enable downloading your official
          result.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="exam">Choose Exam</Label>
            <select
              id="exam"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              aria-required
            >
              <option value="">-- Select Exam --</option>
              <option value="CBSE-Class-10">CBSE Class 10</option>
              <option value="CBSE-Class-12">CBSE Class 12</option>
              <option value="JEE-Main">JEE Main</option>
              <option value="NEET-UG">NEET UG</option>
              <option value="State-Board">State Board</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter your roll number"
              aria-required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} aria-required />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canSubmit} className="disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!cid || isDownloading}
              onClick={onDownload}
              className="disabled:opacity-50"
            >
              {isDownloading ? "Preparing..." : "Download Result"}
            </Button>
          </div>

          <div role="status" aria-live="polite" className="text-sm">
            {cid ? (
              <span className="text-muted-foreground">
                {"Result is ready. You can download now. (CID: "}
                <code className="font-mono">{cid}</code>
                {")"}
              </span>
            ) : (
              <span className="text-muted-foreground">Submit to retrieve your result.</span>
            )}
          </div>

          {error && (
            <p className="text-sm text-[color:var(--color-destructive)]" role="alert">
              {error}
            </p>
          )}
        </form>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        {"The server only returns a CID; files are served from IPFS via a public gateway."}
      </CardFooter>
    </Card>
  )
}
