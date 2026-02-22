import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Email sending is disabled. Please use WhatsApp instead." },
    { status: 503 }
  );
}
