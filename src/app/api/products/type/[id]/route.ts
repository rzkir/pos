import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch single product type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminServerClient();
    const { id } = await params;

    const { data: type, error } = await supabase
      .from("product_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product type:", error);
      return NextResponse.json(
        { error: "Product type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ type });
  } catch (error) {
    console.error("Error in GET /api/products/type/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update product type
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
        { error: "Product type name is required" },
        { status: 400 }
      );
    }

    const { data: type, error } = await supabase
      .from("product_types")
      .update({ name: name.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product type:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Product type name already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to update product type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ type });
  } catch (error) {
    console.error("Error in PUT /api/products/type/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product type
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminServerClient();
    const { id } = await params;

    // Check if product type is being used by any products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id")
      .eq("type_id", id)
      .limit(1);

    if (productsError) {
      console.error("Error checking products:", productsError);
      return NextResponse.json(
        { error: "Failed to check product type usage" },
        { status: 500 }
      );
    }

    if (products && products.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete product type. It is being used by one or more products.",
        },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("product_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product type:", error);
      return NextResponse.json(
        { error: "Failed to delete product type" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Product type deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/products/type/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
