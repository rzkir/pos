import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase";

// GET - Fetch all products
export async function GET() {
  try {
    const supabase = createAdminServerClient();

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories(name),
        product_types(name),
        product_sizes(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminServerClient();
    const body = await request.json();
    const {
      name,
      price,
      stock,
      image_url,
      category_id,
      type_id,
      size_id,
      barcode,
    } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!price || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: "Valid stock quantity is required" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: name.trim(),
          price: parseFloat(price),
          stock: parseInt(stock),
          image_url: image_url || null,
          category_id: category_id || null,
          type_id: type_id || null,
          size_id: size_id || null,
          barcode: barcode || null,
        },
      ])
      .select(
        `
        *,
        product_categories(name),
        product_types(name),
        product_sizes(name)
      `
      )
      .single();

    if (error) {
      console.error("Error creating product:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Product barcode already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
