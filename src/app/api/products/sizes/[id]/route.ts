import { NextRequest, NextResponse } from "next/server";

import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch single sizes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminServerClient();
    const { id } = await params;

    const { data: sizes, error } = await supabase
      .from("product_sizes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching Sizes:", error);
      return NextResponse.json({ error: "Sizes not found" }, { status: 404 });
    }

    return NextResponse.json({ sizes });
  } catch (error) {
    console.error("Error in GET /api/sizes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update Sizes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminServerClient();
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Sizes name is required" },
        { status: 400 }
      );
    }

    const { data: sizes, error } = await supabase
      .from("product_sizes")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating Sizes:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Sizes name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to update Sizes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sizes });
  } catch (error) {
    console.error("Error in PUT /api/sizes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete sizes
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminServerClient();
    const { id } = await params;

    // Check if sizes is being used by any products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("sizes_id", id)
      .limit(1);

    if (productsError) {
      console.error("Error checking products:", productsError);
      return NextResponse.json(
        { error: "Failed to check sizes usage" },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete sizes. It is being used by one or more products.",
        },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("product_sizes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting sizes:", error);
      return NextResponse.json(
        { error: "Failed to delete sizes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Sizes deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/sizes/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
