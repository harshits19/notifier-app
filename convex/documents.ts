import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

/* export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const documents = await ctx.db.query("documents").collect()
    return documents
  },
}) */
/* Mutation - update */

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()
    return documents
  },
})

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect()
    return documents
  },
})
export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error("Not found")
    if (existingDocument.userId !== userId) throw new Error("Unauthorized")

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })
        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    } //options to be updated in existing doc

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) options.parentDocument = undefined //if parent has isArchived = true then make its parentDoc undefined
    }
    const doc = await ctx.db.patch(args.id, options) //update the existingDoc with new options(isArchived = false, parentDoc =undefined)

    recursiveRestore(args.id)
    return doc
  },
})
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error("Not found")
    if (existingDocument.userId !== userId) throw new Error("Unauthorized")

    const document = await ctx.db.delete(args.id)
    return document
  },
})
export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error("Not found")
    if (existingDocument.userId !== userId) throw new Error("Unauthorized")
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })
        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    recursiveArchive(args.id)
    return document
  },
})
/* function to get files for sidebar */
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not Authenticated")
    const userId =
      identity.subject /* fetch docs indexed by user_parent(userid == parentDoc) aslo filter those which are not archieved */
    const documents = await ctx.db
      .query("documents")
      .withIndex(
        "by_user_parent",
        (q) =>
          q
            .eq("userId", userId)
            .eq(
              "parentDocument",
              args.parentDocument,
            ) /* parentDoc is optional (used in case of children note) */,
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()
    return documents
  },
})

export const create = mutation({
  //create new instance in document db
  args: {
    //args required while calling create fn
    title: v.string(),
    parentDocument: v.optional(v.id("documents")), //required when we create a sub doc(doc inside another doc)
  },
  handler: async (ctx, args) => {
    //ctx - context, args - arguments
    const identity = await ctx.auth.getUserIdentity() //validate user
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject //get userId
    const document = await ctx.db.insert("documents", {
      //to create a new doc instance in db
      title: args.title,
      parentDocument: args.parentDocument,
      userId: userId, //got userId from ctx.auth.getUserIdentity()
      isArchived: false, //by default values
      isPublished: false,
    })
    return document
  },
})
