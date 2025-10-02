"use client"

import type * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

function Arrow() {
  return (
    <div aria-hidden="true" className="flex justify-center my-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="text-muted-foreground"
        role="img"
        aria-label="arrow down"
      >
        <path
          d="M12 5v14m0 0l-5-5m5 5l5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

type StepProps = {
  title: string
  summary: string
  details: React.ReactNode
}

function Step({ title, summary, details }: StepProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-pretty">{summary}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm">Details</AccordionTrigger>
            <AccordionContent className="text-sm text-pretty">{details}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default function FlowDiagram() {
  return (
    <div aria-label="Process diagram for result retrieval" className="grid gap-4">
      <Step
        title="1) User fills the form on the homepage"
        summary="Exam, Roll Number, and Date of Birth are entered in the UI."
        details={
          <ul className="list-disc pl-5">
            <li>Form fields: exam (select), roll number (input), date of birth (date input).</li>
            <li>Accessibility: labels are linked via htmlFor and aria-required is set.</li>
            <li>Client-side checks ensure minimum input quality (e.g., roll number length).</li>
          </ul>
        }
      />
      <Arrow />

      <Step
        title="2) Client validates and sends a request"
        summary="On Submit, the browser makes a POST request to /api/result."
        details={
          <div className="grid gap-2">
            <p>The client performs lightweight validation, then calls the API:</p>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
              {`fetch("/api/result", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ exam, rollNo, dob }),
})`}
            </pre>
            <ul className="list-disc pl-5">
              <li>No result data is sent back; only metadata needed for lookup is sent.</li>
              <li>Network errors and invalid responses are handled gracefully in the UI.</li>
            </ul>
          </div>
        }
      />
      <Arrow />

      <Step
        title="3) Server verifies and returns the IPFS CID"
        summary="The API route validates inputs and looks up the record, returning the CID only."
        details={
          <div className="grid gap-2">
            <p>In app/api/result/route.ts, the server:</p>
            <ul className="list-disc pl-5">
              <li>Validates required fields and performs any security checks (rate-limiting, audit logs).</li>
              <li>Looks up a datastore for the user’s result and returns only the IPFS CID.</li>
              <li>Does not serve files directly, keeping server responses minimal.</li>
            </ul>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
              {`return NextResponse.json({ cid }, { status: 200, headers: { "Cache-Control": "no-store" } })`}
            </pre>
          </div>
        }
      />
      <Arrow />

      <Step
        title="4) UI enables the Download button"
        summary="After receiving a valid CID, the Download button becomes active."
        details={
          <ul className="list-disc pl-5">
            <li>The CID is stored in component state.</li>
            <li>Errors are shown in-line via an accessible alert message.</li>
            <li>Loading states indicate Submit and Download progress.</li>
          </ul>
        }
      />
      <Arrow />

      <Step
        title="5) Download fetches from IPFS gateway"
        summary="The client fetches the file via a public IPFS gateway using the CID."
        details={
          <div className="grid gap-2">
            <p>Using a trusted gateway (e.g., w3s.link) and the CID:</p>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
              {`const url = \`https://w3s.link/ipfs/\${cid}\`
const resp = await fetch(url, { mode: "cors" })
const blob = await resp.blob()`}
            </pre>
            <ul className="list-disc pl-5">
              <li>No sensitive content passes through the server.</li>
              <li>Download filename is sanitized using exam and roll number.</li>
            </ul>
          </div>
        }
      />
      <Arrow />

      <Step
        title="6) Browser triggers a safe local download"
        summary="A temporary object URL is created for the blob and auto-clicked to save the file."
        details={
          <div className="grid gap-2">
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
              {`const objectUrl = URL.createObjectURL(blob)
const a = document.createElement("a")
a.href = objectUrl
a.download = \`\${exam}-\${rollNo}-result\`
a.click()
URL.revokeObjectURL(objectUrl)`}
            </pre>
            <ul className="list-disc pl-5">
              <li>Object URL is revoked immediately after to avoid memory leaks.</li>
              <li>All heavy lifting happens on the client; the server remains lean.</li>
            </ul>
          </div>
        }
      />
    </div>
  )
}
