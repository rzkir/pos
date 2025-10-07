import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch all sizes
export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: sizes, error } = await supabase
      .from("product_sizes")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching sizes:", error);
      return NextResponse.json(
        { error: "Failed to fetch sizes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sizes });
  } catch (error) {
    console.error("Error in GET /api/sizes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new size
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Size name is required" },
        { status: 400 }
      );
    }

    const { data: size, error } = await supabase
      .from("product_sizes")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Error creating size:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Size name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create size" },
        { status: 500 }
      );
    }

    return NextResponse.json({ size }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/sizes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
