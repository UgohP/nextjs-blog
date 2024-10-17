import { ConnectDB } from "@/lb/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import React from "react";
import Blog from "@/lb/models/BlogModel";

const LoadDb = async () => {
  await ConnectDB();
};

LoadDb();

export const GET = async (request) => {
  try {
    const blogs = await Blog.find({})
    return NextResponse.json({blogs});
  } catch (err) {
    return NextResponse.json({ msg: "API Error" });
  }
};

export const POST = async (request) => {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();
    const image = formData.get("image");
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;
    const blogData = {
      title: `${formData.get("title")}`,
      description: `${formData.get("description")}`,
      category: `${formData.get("category")}`,
      author: `${formData.get("author")}`,
      image: `${imgUrl}`,
      authorImg: `${formData.get("authorImg")}`,
    };
    await Blog.create(blogData);
    console.log(`Created`);
    return NextResponse.json(
      { success: true, msg: "Created" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: "API Error" + err }, { status: 500 });
  }
};
