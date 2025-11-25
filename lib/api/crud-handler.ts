import { connectDB } from "@/lib/db/mongoose";
import { ApiError } from "./error-handler";
import type { Document, Model } from "mongoose";
import type { ZodSchema } from "zod";

export interface CrudOptions {
  model: Model<any>;
  schema?: ZodSchema;
  populate?: string | string[];
}

export interface ListOptions {
  model: Model<any>;
  searchFields?: string[];
  filterField?: string;
  populate?: string | string[];
}

export async function handleGetById(
  id: string,
  options: CrudOptions
): Promise<Document | null> {
  await connectDB();

  let query = options.model.findById(id);

  if (options.populate) {
    const populateArr = Array.isArray(options.populate)
      ? options.populate
      : [options.populate];
    populateArr.forEach((field) => {
      query = query.populate(field);
    });
  }

  const document = await query;

  if (!document) {
    throw new ApiError(404, `${options.model.collection.name} not found`);
  }

  return document;
}

export async function handleUpdate(
  id: string,
  data: unknown,
  options: CrudOptions
): Promise<Document> {
  await connectDB();

  const validatedData = options.schema ? options.schema.parse(data) : data;

  let query = options.model.findByIdAndUpdate(id, validatedData, { new: true });

  if (options.populate) {
    const populateArr = Array.isArray(options.populate)
      ? options.populate
      : [options.populate];
    populateArr.forEach((field) => {
      query = query.populate(field);
    });
  }

  const document = await query;

  if (!document) {
    throw new ApiError(404, `${options.model.collection.name} not found`);
  }

  return document;
}

export async function handleDelete(
  id: string,
  options: CrudOptions
): Promise<void> {
  await connectDB();

  const document = await options.model.findByIdAndDelete(id);

  if (!document) {
    throw new ApiError(404, `${options.model.collection.name} not found`);
  }
}

export function createCrudRoute(options: CrudOptions) {
  return {
    async get(id: string) {
      return handleGetById(id, options);
    },
    async update(id: string, data: unknown) {
      return handleUpdate(id, data, options);
    },
    async delete(id: string) {
      return handleDelete(id, options);
    },
  };
}

export default async function handleList(
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
