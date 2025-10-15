import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: suppliers, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching suppliers:", error);
      return NextResponse.json(
        { error: "Failed to fetch suppliers" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("Error in suppliers GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();

    const { name, phone, email, address } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: supplier, error } = await supabase
      .from("suppliers")
      .insert([
        {
          name,
          phone: phone || null,
          email: email || null,
          address: address || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating supplier:", error);
      return NextResponse.json(
        { error: "Failed to create supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    console.error("Error in suppliers POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
