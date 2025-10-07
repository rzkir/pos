import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch all categories
export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: categories, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error in GET /api/products/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const { data: category, error } = await supabase
      .from("product_categories")
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Category name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
