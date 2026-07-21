import { prismaDb } from "@/lib/db";

export async function getAllTags() {
  return await prismaDb.tag.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTag(label: string) {
  return await prismaDb.tag.create({
    data: { name: label },
  });
}

export async function deleteTag(id: string) {
  return await prismaDb.tag.delete({ where: { id } });
}
