import { NextRequest, NextResponse } from "next/server";

// Backend route for saving results
export async function POST(req: NextRequest) {
  // TODO: implement persistence logic here (database, object storage, etc.)
  return NextResponse.json(
    { message: "Save endpoint not implemented yet" },
    { status: 200 },
  );
}



