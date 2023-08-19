import { NextApiHandler } from "next";
import { File, NFTStorage } from "nft.storage";
import formidable from "formidable";
import { tmpdir } from "os";
import { readFileSync, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY as string;
console.log("token", NFT_STORAGE_KEY);
const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY1RjM5MzVBQzg1MzA5NDc0MUZCMGQyNTY4NDcxMjMyMDA3OTBFMzUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MzA5NjQzMDc5OCwibmFtZSI6Im5ldyJ9.RGWsbMjMAoarN8iuRZ4pNPkkLV_hXvO2oQn_d1jEPVo",
});
export const POST = async (req: NextRequest) => {
  if (req.method != "POST") {
    return NextResponse.json({
      error: `Unsupported method ${req.method}`,
    });
  }
  try {
    //parse req body and save image in /tmp
    const data: any = await new Promise((res, rej) => {
      const form = formidable({ multiples: true, uploadDir: tmpdir() });
      form.parse(req, (err, fields, files) => {
        if (err) rej(err);
        res({ ...fields, ...files });
      });
    });
    const {
      filepath,
      originalFilename = "image",
      mimetype = "image",
    } = data.image;
    const buffer = readFileSync(filepath);
    const arraybuffer = Uint8Array.from(buffer).buffer;
    const file = new File([arraybuffer], originalFilename, { type: mimetype });
    const metadata = await client.store({
      name: data.name,
      description: data.description,
      image: file,
    });
    //delete tmp image
    //delete tmp image
    unlinkSync(filepath);
    return NextResponse.json({ uri: metadata.url });
  } catch (err) {
    console.log(err);
  }
};
export const config = {
  api: {
    bodyParser: false,
  },
};
