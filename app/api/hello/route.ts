import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { File } from "@web-std/file";

import { NFTStorage } from "nft.storage";
import fs, { readFileSync } from "fs";
import { unlinkSync } from "fs";
import mime from "mime";
const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY1RjM5MzVBQzg1MzA5NDc0MUZCMGQyNTY4NDcxMjMyMDA3OTBFMzUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MzA5NjQzMDc5OCwibmFtZSI6Im5ldyJ9.RGWsbMjMAoarN8iuRZ4pNPkkLV_hXvO2oQn_d1jEPVo",
});
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  //   const filePath = `/tmp/${file.name}`
  const filePath = path.join(process.cwd(), "public", file.name);
  await writeFile(filePath, buffer);
  const arraybuffer = Uint8Array.from(buffer).buffer;
  const content = await fs.promises.readFile(filePath);
  const filllle = new File([content], path.basename(filePath), {
    type: mime.getType(filePath) || "image/jpg",
  });
  console.log(`open ${filePath} to see the uploaded file`);
  const uri = await client.store({
    image: filllle,
    name: data.get("name")?.toString() || "name",
    description: data.get("description")?.toString() || "desc",
  });
  console.log("uri", uri);
  unlinkSync(filePath);
  return NextResponse.json({ uri, filename: data.get("filename") });
}
export const config = {
  api: {
    bodyParser: false,
  },
};
