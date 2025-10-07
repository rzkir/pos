import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch all product types
export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: types, error } = await supabase
      .from("product_types")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching product types:", error);
      return NextResponse.json(
        { error: "Failed to fetch product types" },
        { status: 500 }
      );
    }

    return NextResponse.json({ types });
  } catch (error) {
    console.error("Error in GET /api/products/type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new product type
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Product type name is required" },
        { status: 400 }
      );
    }

    const { data: type, error } = await supabase
      .from("product_types")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Error creating product type:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Product type name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create product type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ type }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products/type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
