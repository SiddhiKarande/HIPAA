import z from "zod";
import { Schema, SchemaDefinitionProperty, Types } from "mongoose";

export class BaseSchema extends Schema {
	constructor(schema: { [key: string]: SchemaDefinitionProperty<any, any> }) {
		super(
			{
				...schema,
				isDeleted: {
					type: Boolean,
					require: true,
					default: false,
				},
				createdBy: {
					type: Schema.Types.ObjectId,
					ref: "users",
				},
				updatedBy: {
					type: Schema.Types.ObjectId,
					ref: "users",
				},
			},
			{ timestamps: true }
		);
	}
}

export const ZBase = z.object({
	_id: z.instanceof(Types.ObjectId).optional(),
	isDeleted: z.boolean().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	createdBy: z.string().optional(),
	updatedBy: z.string().optional(),
});

export interface IResponses {
	[key: string]: {
		statusCode: number;
		message: string;
	};
}

export interface IPaginationSearchQueries {
	page?: number;
	limit?: number;
	searchQuery?: any;
	filters?: { [key: string]: any };
}
