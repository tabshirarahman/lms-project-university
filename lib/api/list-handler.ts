import { connectDB } from "@/lib/db/mongoose";
import type { Model } from "mongoose";

export interface ListOptions {
  model: Model<any>;
  searchFields?: string[];
  filterField?: string;
  populate?: string | string[];
}

export async function handleList(
  query: Record<string, string>,
  options: ListOptions
): Promise<{
  data: any[];
  pagination: { page: number; limit: number; total: number; pages: number };
}> {
  await connectDB();

  const page = Math.max(1, Number.parseInt(query.page || "1"));
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit || "10"))
  );

  let mongoQuery = options.model.find();

  // Handle search
  if (query.search && options.searchFields && options.searchFields.length > 0) {
    const searchRegex = new RegExp(query.search, "i");
    const searchConditions = options.searchFields.map((field) => ({
      [field]: searchRegex,
    }));
    mongoQuery = mongoQuery.or(searchConditions);
  }

  // Handle filter
  if (query[options.filterField || "status"] && options.filterField) {
    mongoQuery = mongoQuery
      .where(options.filterField)
      .equals(query[options.filterField || "status"]);
  }

  // Handle populate
  if (options.populate) {
    const populateArr = Array.isArray(options.populate)
      ? options.populate
      : [options.populate];
    populateArr.forEach((field) => {
      mongoQuery = mongoQuery.populate(field);
    });
  }

  const total = await options.model.countDocuments(mongoQuery.getFilter());
  const skip = (page - 1) * limit;

  const data = await mongoQuery.skip(skip).limit(limit).sort({ createdAt: -1 });

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
