import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

type RecordItem = {
  id: number;
  category: string;
  type: string;
  date: string;
  amount: number;
  client: string;
  item: string;
  note: string;
};

const dataFile = path.join(process.cwd(), "data", "records.json");

async function readData(): Promise<RecordItem[]> {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    return JSON.parse(data) as RecordItem[];
  } catch (err) {
    return [];
  }
}

async function writeData(records: RecordItem[]) {
  await fs.writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function GET() {
  const records = await readData();
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const newRecord = (await req.json()) as Omit<RecordItem, "id">;
  const records = await readData();
  const id = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
  const record: RecordItem = { id, ...newRecord };
  records.push(record);
  await writeData(records);
  return NextResponse.json(record, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const updated = (await req.json()) as RecordItem;
  const records = await readData();
  const index = records.findIndex((r) => r.id === updated.id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  records[index] = updated;
  await writeData(records);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  let records = await readData();
  records = records.filter((r) => r.id !== id);
  await writeData(records);
  return NextResponse.json({ id });
}
