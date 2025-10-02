import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { exam, rollNo, dob } = (await req.json?.()) || {}
    if (!exam || !rollNo || !dob) {
      return new NextResponse("Missing required fields.", { status: 400 })
    }

    // Perform your server-side verification here (captcha, throttling, audit logs, etc.)
    // Lookup record in your datastore and return the IPFS CID only.
    // For demo, we return a known sample CID. Replace with real CID from your DB.
    // Example CID below points to a placeholder resource; swap to your actual IPFS content.
    const demoCid = "bafybeigdyrzt3c7v4l4l2v6m4k6lo2o4u7s5l3f7kq5qzqzqzqzqzqzq"
    console.log(" Result requested:", { exam, rollNo, dob, cid: demoCid })

    return NextResponse.json(
      { cid: demoCid },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (err: any) {
    console.log("/api/result error:", err?.message || err)
    return new NextResponse("Server error.", { status: 500 })
  }
}
